from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum


class TaskStatus(str, enum.Enum):
    todo = "To Do"
    in_progress = "In Progress"
    done = "Done"


class TaskPriority(str, enum.Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    urgent = "Urgent"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.todo)
    priority = Column(Enum(TaskPriority), default=TaskPriority.medium)

    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    
    # Relationships
    assignee = relationship("User", back_populates="tasks")
    project = relationship("Project", back_populates="tasks")
    time_entries = relationship("TimeEntry", back_populates="task")
    financial_records = relationship("FinancialRecord", back_populates="task")
    accounting_entries = relationship("AccountingEntry", back_populates="task")




