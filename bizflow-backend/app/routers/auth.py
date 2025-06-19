from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app import models, schemas, database, utils
from app.auth_utils import create_access_token
import logging
from typing import Dict
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=schemas.Token)
async def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
) -> Dict[str, str]:
    """
    Authenticate user and return JWT token.
    
    Args:
        user_credentials: OAuth2 password form containing username and password
        db: Database session
        
    Returns:
        Dict containing access token and token type
        
    Raises:
        HTTPException: If credentials are invalid or user is not found
    """
    try:
        # Find user by email
        user = db.query(models.User).filter(models.User.email == user_credentials.username).first()
        
        if not user:
            logger.warning(f"Login attempt failed: User not found - {user_credentials.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify password
        if not utils.verify_password(user_credentials.password, user.hashed_password):
            logger.warning(f"Login attempt failed: Invalid password for user - {user_credentials.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token = create_access_token(
            data={
                "user_id": user.id,
                "email": user.email,
                "role": user.role,
                "sub": str(user.id)  # Standard JWT subject claim
            }
        )
        
        logger.info(f"User logged in successfully: {user.email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": utils.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )
