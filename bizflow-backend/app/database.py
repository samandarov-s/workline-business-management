from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv
import logging
from contextlib import contextmanager
import time
from typing import Generator

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Check if we should use SQLite for development
USE_SQLITE = os.getenv("USE_SQLITE", "true").lower() == "true"
DB_PASSWORD = os.getenv("DB_PASSWORD")

if USE_SQLITE or not DB_PASSWORD:
    # Use SQLite for development
    DATABASE_URL = "sqlite:///./bizflow.db"
    logger.info("Using SQLite database for development")
    
    # Create engine for SQLite
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},  # Required for SQLite
        echo=os.getenv("SQL_ECHO", "false").lower() == "true"
    )
else:
    # Use PostgreSQL for production
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "bizflow")
    DB_USER = os.getenv("DB_USER", "postgres")
    
    # Connection pool settings
    POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "5"))
    MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    POOL_TIMEOUT = int(os.getenv("DB_POOL_TIMEOUT", "30"))
    POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", "1800"))  # 30 minutes

    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    logger.info("Using PostgreSQL database for production")
    
    # Create engine with connection pooling
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=POOL_SIZE,
        max_overflow=MAX_OVERFLOW,
        pool_timeout=POOL_TIMEOUT,
        pool_recycle=POOL_RECYCLE,
        pool_pre_ping=True,  # Enable connection health checks
        echo=os.getenv("SQL_ECHO", "false").lower() == "true"
    )

# Create session factory
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db() -> None:
    """Initialize database connection and verify connectivity."""
    try:
        # Import all models to ensure they're registered
        try:
            from app import models  # This imports all models
        except ImportError as e:
            logger.warning(f"Could not import models: {str(e)}")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        # Test database connection
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        logger.info("Database connection successful")
        
        # Create default admin user if SQLite and doesn't exist
        if USE_SQLITE or not DB_PASSWORD:
            create_default_user(db)
            
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise
    finally:
        if 'db' in locals():
            db.close()

def create_default_user(db):
    """Create a default admin user for development."""
    try:
        from app.models.user import User
        from app.utils import hash_password
        
        # Check if admin user already exists
        existing_user = db.query(User).filter(User.email == "admin@test.com").first()
        if not existing_user:
            admin_user = User(
                email="admin@test.com",
                hashed_password=hash_password("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            logger.info("Created default admin user: admin@test.com / admin123")
    except Exception as e:
        logger.warning(f"Could not create default user: {str(e)}")
        if db:
            db.rollback()
