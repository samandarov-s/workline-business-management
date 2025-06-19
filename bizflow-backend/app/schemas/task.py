from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class TaskStatus(str, Enum):
    todo = "To Do"
    in_progress = "In Progress"
    done = "Done"


class TaskPriority(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    urgent = "Urgent"


class TaskBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.todo
    priority: Optional[TaskPriority] = TaskPriority.medium
    assignee_id: Optional[int] = None
    project_id: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    assignee_id: Optional[int] = None
    project_id: Optional[int] = None
    due_date: Optional[datetime] = None
    updated_at: Optional[datetime] = None  # Optional but present for completeness


class TaskOut(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # for Pydantic v2
