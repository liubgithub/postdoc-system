from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

router = APIRouter(
    prefix="/pre_entry_subject_research",
    tags=["课题研究信息"]
)

@router.post("/", response_model=schemas.PreEntrySubjectResearch)
def create_subject(subject: schemas.PreEntrySubjectResearchCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_subject = models.PreEntrySubjectResearch(**subject.dict(exclude={"user_id", "achievement_id"}), user_id=current_user.id)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/me", response_model=list[schemas.PreEntrySubjectResearch])
def get_my_subjects(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntrySubjectResearch)
def get_subject(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    subject = db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.id == id, models.PreEntrySubjectResearch.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.put("/{id}", response_model=schemas.PreEntrySubjectResearch)
def update_subject(id: int, subject: schemas.PreEntrySubjectResearchUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_subject = db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.id == id, models.PreEntrySubjectResearch.user_id == current_user.id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    for key, value in subject.dict(exclude_unset=True, exclude={"user_id", "achievement_id"}).items():
        setattr(db_subject, key, value)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/{id}")
def delete_subject(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_subject = db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.id == id, models.PreEntrySubjectResearch.user_id == current_user.id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(db_subject)
    db.commit()
    return {"ok": True}
