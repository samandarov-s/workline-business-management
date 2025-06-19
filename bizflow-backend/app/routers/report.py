from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app import models, database, auth_utils
from typing import Dict

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/financial-summary", response_model=Dict[str, float])
def get_financial_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    total_expense = db.query(func.coalesce(func.sum(models.FinancialRecord.amount), 0)) \
        .filter(models.FinancialRecord.type == "Expense").scalar()
    total_revenue = db.query(func.coalesce(func.sum(models.FinancialRecord.amount), 0)) \
        .filter(models.FinancialRecord.type == "Revenue").scalar()

    return {
        "total_expense": total_expense,
        "total_revenue": total_revenue,
        "net": total_revenue - total_expense
    }

@router.get("/task-status-count", response_model=Dict[str, int])
def get_task_status_count(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    result = db.query(
        models.Task.status,
        func.count(models.Task.id)
    ).group_by(models.Task.status).all()

    return {status.value: count for status, count in result}

@router.get("/inventory-snapshot", response_model=Dict[str, int])
def get_inventory_snapshot(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    items = db.query(models.InventoryItem).all()
    return {item.name: item.quantity for item in items}
