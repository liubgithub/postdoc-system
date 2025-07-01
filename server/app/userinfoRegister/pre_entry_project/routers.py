from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas

router = APIRouter(
    prefix="/pre_entry_project",
    tags=["项目信息"]
)

@router.post("/", response_model=schemas.PreEntryProject)
def create_project(project: schemas.PreEntryProjectCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_project = models.PreEntryProject(**project.dict(exclude={"user_id", "achievement_id"}), user_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/me", response_model=list[schemas.PreEntryProject])
def get_my_projects(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryProject).filter(models.PreEntryProject.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryProject)
def get_project(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    project = db.query(models.PreEntryProject).filter(models.PreEntryProject.id == id, models.PreEntryProject.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{id}", response_model=schemas.PreEntryProject)
def update_project(id: int, project: schemas.PreEntryProjectUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_project = db.query(models.PreEntryProject).filter(models.PreEntryProject.id == id, models.PreEntryProject.user_id == current_user.id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.dict(exclude_unset=True, exclude={"user_id", "achievement_id"}).items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{id}")
def delete_project(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_project = db.query(models.PreEntryProject).filter(models.PreEntryProject.id == id, models.PreEntryProject.user_id == current_user.id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"ok": True}
