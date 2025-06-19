from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime


class TransactionType(str, Enum):
    expense = "Expense"
    revenue = "Revenue"


class AccountingEntryBase(BaseModel):
    amount: float = Field(..., gt=0, description="Amount must be greater than 0")
    type: TransactionType
    description: Optional[str] = None
    task_id: Optional[int] = None
    project_id: Optional[int] = None


class AccountingEntryCreate(AccountingEntryBase):
    pass


class AccountingEntryOut(AccountingEntryBase):
    id: int
    timestamp: datetime
    user_id: Optional[int]

    class Config:
        from_attributes = True
