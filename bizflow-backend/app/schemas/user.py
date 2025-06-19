from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ✅ Base schema (shared fields)
class UserBase(BaseModel):
    email: str
    role: str = "user"

# ✅ For user registration
class UserCreate(UserBase):
    password: str

# ✅ For login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ✅ For API response (excluding password)
class UserOut(UserBase):
    id: int
    created_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True  # ✅ correct for Pydantic v2

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None

