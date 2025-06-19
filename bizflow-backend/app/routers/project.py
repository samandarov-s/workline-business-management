# app/routers/project.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas, database
from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

@router.post("/", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    new_project = models.Project(**project.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


@router.get("/", response_model=List[schemas.ProjectOut])
def get_projects(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Project).offset(skip).limit(limit).all()


@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=schemas.ProjectOut)
def update_project(project_id: int, update_data: schemas.ProjectUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return None
@router.get("/{project_id}/tasks", response_model=List[schemas.TaskOut])
def get_tasks_by_project(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return db.query(models.Task).filter(models.Task.project_id == project_id).all()
@router.post("/{project_id}/tasks", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task_under_project(
    project_id: int,
    task: schemas.TaskCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_task = models.Task(**task.model_dump(), project_id=project_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task
@router.get("/{project_id}/progress")
def get_project_progress(
    project_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    total = db.query(models.Task).filter(models.Task.project_id == project_id).count()
    completed = db.query(models.Task).filter(models.Task.project_id == project_id, models.Task.status == models.TaskStatus.done).count()
    in_progress = db.query(models.Task).filter(models.Task.project_id == project_id, models.Task.status == models.TaskStatus.in_progress).count()
    todo = db.query(models.Task).filter(models.Task.project_id == project_id, models.Task.status == models.TaskStatus.todo).count()

    return {
        "project_id": project.id,
        "project_name": project.name,
        "total_tasks": total,
        "completed": completed,
        "in_progress": in_progress,
        "todo": todo,
        "completion_rate": round(completed / total, 2) if total > 0 else 0.0
    }
