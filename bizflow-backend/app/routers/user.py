from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas, database, utils
from app.auth_utils import get_current_user
import logging
import re
from datetime import datetime
import traceback
# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

def validate_password(password: str) -> bool:
    """Validate password strength"""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    return True

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

@router.post("/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    """
    Create a new user.
    
    Args:
        user: User creation data
        db: Database session
        
    Returns:
        Created user data
        
    Raises:
        HTTPException: If user creation fails
    """
    try:
        # Validate email format
        if not validate_email(user.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )

        # Validate password strength
        if not validate_password(user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters long and contain uppercase, lowercase, and numbers"
            )

        # Check if user already exists
        existing_user = db.query(models.User).filter(models.User.email == user.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Hash the password
        hashed_password = utils.hash_password(user.password)
        
        # Create new user
        new_user = models.User(
            email=user.email,
            hashed_password=hashed_password,
            role=user.role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user created: {new_user.email}")
        return new_user
        
    except IntegrityError:
        logger.error(f"Database integrity error while creating user: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    except HTTPException:
        # Re-raise HTTP exceptions without modification
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the user"
        )

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Get current user's profile.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user's data
    """
    return current_user
