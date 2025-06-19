from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict

from app import models, database
from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/summary/by-project", response_model=List[Dict])
def report_by_project(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    results = db.query(
        models.AccountingEntry.project_id,
        models.AccountingEntry.type,
        func.sum(models.AccountingEntry.amount).label("total")
    ).group_by(models.AccountingEntry.project_id, models.AccountingEntry.type).all()

    return [
        {"project_id": r.project_id, "type": r.type, "total": r.total}
        for r in results
    ]


@router.get("/summary/by-task", response_model=List[Dict])
def report_by_task(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    results = db.query(
        models.AccountingEntry.task_id,
        models.AccountingEntry.type,
        func.sum(models.AccountingEntry.amount).label("total")
    ).group_by(models.AccountingEntry.task_id, models.AccountingEntry.type).all()

    return [
        {"task_id": r.task_id, "type": r.type, "total": r.total}
        for r in results
    ]
