from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.utils import hash_password
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    """Initialize database and create test user."""
    try:
        # Drop all tables
        Base.metadata.drop_all(bind=engine)
        logger.info("Existing tables dropped")

        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")

        # Create test user
        db = SessionLocal()
        test_user = User(
            email="test@example.com",
            hashed_password=hash_password("Test123!"),
            role="user"
        )
        db.add(test_user)
        db.commit()
        logger.info("Test user created successfully")

    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database() 