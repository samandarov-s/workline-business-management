from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class InventoryBase(BaseModel):
    name: str
    sku: str
    category: Optional[str] = None
    quantity: int = Field(ge=0)
    low_stock_threshold: Optional[int] = 5

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=0)
    low_stock_threshold: Optional[int] = None

class InventoryOut(InventoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
