from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class RecordType(str, Enum):
    expense = "Expense"
    revenue = "Revenue"

class FinancialRecordBase(BaseModel):
    amount: float = Field(..., gt=0)
    type: RecordType
    description: Optional[str] = None
    task_id: Optional[int] = None
    project_id: Optional[int] = None

class FinancialRecordCreate(FinancialRecordBase):
    pass

class FinancialRecordOut(FinancialRecordBase):
    id: int
    submitted_by: int
    created_at: datetime

    class Config:
        from_attributes = True
