from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas, database
from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/accounting",
    tags=["Accounting"]
)

@router.post("/", response_model=schemas.AccountingEntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    entry: schemas.AccountingEntryCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_entry = models.AccountingEntry(
        amount=entry.amount,
        type=entry.type,
        description=entry.description,
        task_id=entry.task_id,
        project_id=entry.project_id,
        user_id=current_user.id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.get("/", response_model=List[schemas.AccountingEntryOut])
def get_entries(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.AccountingEntry).all()


@router.get("/by-task/{task_id}", response_model=List[schemas.AccountingEntryOut])
def get_entries_by_task(
    task_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.AccountingEntry).filter(models.AccountingEntry.task_id == task_id).all()


@router.get("/by-project/{project_id}", response_model=List[schemas.AccountingEntryOut])
def get_entries_by_project(
    project_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.AccountingEntry).filter(models.AccountingEntry.project_id == project_id).all()
