from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database
from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/financial-records",
    tags=["Financial Records"]
)

@router.post("/", response_model=schemas.FinancialRecordOut, status_code=status.HTTP_201_CREATED)
def create_record(
    record: schemas.FinancialRecordCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_record = models.FinancialRecord(**record.model_dump(), submitted_by=current_user.id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/", response_model=List[schemas.FinancialRecordOut])
def get_records(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.FinancialRecord).all()
