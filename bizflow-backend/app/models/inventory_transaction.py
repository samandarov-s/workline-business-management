from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class TransactionType(str, enum.Enum):
    addition = "Addition"
    subtraction = "Subtraction"
    adjustment = "Adjustment"

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity_change = Column(Integer, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    performed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    note = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    item = relationship("InventoryItem", back_populates="transactions")
    user = relationship("User")
