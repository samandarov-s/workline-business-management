from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app import models, schemas, database
from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/time-entries",
    tags=["Time Tracking"]
)

@router.post("/", response_model=schemas.TimeEntryOut, status_code=status.HTTP_201_CREATED)
def log_time(
    entry: schemas.TimeEntryCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    start = entry.start_time or datetime.utcnow()
    end = entry.end_time

    if end and end < start:
        raise HTTPException(status_code=400, detail="End time cannot be before start time.")

    duration = entry.duration_minutes
    if not duration and end:
        duration = int((end - start).total_seconds() / 60)

    new_entry = models.TimeEntry(
        user_id=current_user.id,
        task_id=entry.task_id,
        project_id=entry.project_id,
        start_time=start,
        end_time=end,
        duration_minutes=duration,
        note=entry.note,
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.get("/", response_model=List[schemas.TimeEntryOut])
def get_my_time_entries(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.TimeEntry).filter(models.TimeEntry.user_id == current_user.id).all()
