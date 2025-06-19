from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class TransactionType(str, Enum):
    addition = "Addition"
    subtraction = "Subtraction"
    adjustment = "Adjustment"

class InventoryTransactionBase(BaseModel):
    item_id: int
    quantity_change: int
    type: TransactionType
    note: Optional[str] = None

class InventoryTransactionCreate(InventoryTransactionBase):
    pass

class InventoryTransactionOut(InventoryTransactionBase):
    id: int
    performed_by: Optional[int]
    timestamp: datetime

    class Config:
        from_attributes = True
