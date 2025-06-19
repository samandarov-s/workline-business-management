from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum


class TransactionType(str, enum.Enum):
    expense = "Expense"
    revenue = "Revenue"


class AccountingEntry(Base):
    __tablename__ = "accounting_entries"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    description = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    task = relationship("Task", back_populates="accounting_entries")
    project = relationship("Project", back_populates="accounting_entries")
    user = relationship("User", backref="accounting_entries")
