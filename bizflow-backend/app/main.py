from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base, SessionLocal, init_db
from sqlalchemy import text
from app import models
import logging
import time
from typing import Callable
import os
from dotenv import load_dotenv

# Import all routers
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.task import router as task_router
from app.routers.project import router as project_router
from app.routers.inventory import router as inventory_router
from app.routers.inventory_transaction import router as inventory_transaction_router
from app.routers.inventory_item import router as inventory_item_router
from app.routers.financial_record import router as financial_record_router
from app.routers.report import router as report_router
from app.routers.time_entry import router as time_entry_router
from app.routers.accounting import router as accounting_router
from app.routers.reporting import router as reporting_router

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="BizFlow API",
    description="Backend API for BizFlow application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
]

# Allow environment override or development mode
if os.getenv("ALLOWED_ORIGINS"):
    origins = os.getenv("ALLOWED_ORIGINS").split(",")
elif os.getenv("DEVELOPMENT", "true").lower() == "true":
    # In development, be more permissive
    origins = ["*"]
    logger.info("Development mode: Allowing all origins")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

logger.info(f"CORS configured for origins: {origins}")

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next: Callable):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(
            f"Method: {request.method} Path: {request.url.path} "
            f"Status: {response.status_code} Duration: {process_time:.2f}s"
        )
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"Method: {request.method} Path: {request.url.path} "
            f"Error: {str(e)} Duration: {process_time:.2f}s"
        )
        raise

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Initialize database
try:
    init_db()
except Exception as e:
    logger.error(f"Failed to initialize database: {str(e)}")
    raise

# Root endpoint
@app.get("/")
def root():
    return {"message": "BizFlow backend is running"}

# CORS test endpoint
@app.get("/test-cors")
def test_cors():
    return {"status": "success", "message": "CORS is working correctly"}

# Health check endpoint
@app.get("/health")
def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Service unhealthy - database connection failed"
        )
    finally:
        db.close()

# Include routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(task_router)
app.include_router(project_router)
app.include_router(inventory_router)
app.include_router(inventory_transaction_router)
app.include_router(inventory_item_router)
app.include_router(financial_record_router)
app.include_router(report_router)
app.include_router(time_entry_router)
app.include_router(accounting_router)
app.include_router(reporting_router)

