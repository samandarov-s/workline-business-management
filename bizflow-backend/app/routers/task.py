from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app import models, schemas, database
from app.auth_utils import get_current_user
from app.services.notifier import send_email_notification  # ✅ new import

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

@router.post("/", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    new_task = models.Task(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.get("/", response_model=List[schemas.TaskOut])
def get_tasks(
    skip: int = 0,
    limit: int = 20,
    assignee_id: int = None,
    project_id: int = None,
    status: schemas.TaskStatus = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Task)

    if assignee_id is not None:
        query = query.filter(models.Task.assignee_id == assignee_id)
    if project_id is not None:
        query = query.filter(models.Task.project_id == project_id)
    if status is not None:
        query = query.filter(models.Task.status == status)

    return query.offset(skip).limit(limit).all()


@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # check if status is changing from not done to done
    was_not_done = task.status != models.TaskStatus.done

    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)

    # 🔔 Notify if newly completed
    if was_not_done and task.status == models.TaskStatus.done and task.assignee:
        send_email_notification(
            user_email=task.assignee.email,
            subject="✅ Task Completed",
            message=f"Task '{task.title}' has been marked as done."
        )

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return None
