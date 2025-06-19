from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class RecordType(str, enum.Enum):
    expense = "Expense"
    revenue = "Revenue"

class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    type = Column(Enum(RecordType), nullable=False)
    description = Column(Text, nullable=True)

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="financial_records")
    project = relationship("Project", back_populates="financial_records")
    user = relationship("User", back_populates="financial_records")
