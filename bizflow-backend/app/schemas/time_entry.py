from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TimeEntryBase(BaseModel):
    task_id: Optional[int] = None
    project_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    note: Optional[str] = None

class TimeEntryCreate(TimeEntryBase):
    pass

class TimeEntryOut(TimeEntryBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True  # for Pydantic v2
