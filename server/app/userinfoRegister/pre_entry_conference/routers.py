from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas

router = APIRouter(
    prefix="/pre_entry_conference",
    tags=["学术会议信息"]
)

@router.post("/", response_model=schemas.PreEntryConference)
def create_conference(conference: schemas.PreEntryConferenceCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_conference = models.PreEntryConference(**conference.dict(exclude={"user_id", "achievement_id"}), user_id=current_user.id)
    db.add(db_conference)
    db.commit()
    db.refresh(db_conference)
    return db_conference

@router.get("/me", response_model=list[schemas.PreEntryConference])
def get_my_conferences(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryConference).filter(models.PreEntryConference.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryConference)
def get_conference(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    conference = db.query(models.PreEntryConference).filter(models.PreEntryConference.id == id, models.PreEntryConference.user_id == current_user.id).first()
    if not conference:
        raise HTTPException(status_code=404, detail="Conference not found")
    return conference

@router.put("/{id}", response_model=schemas.PreEntryConference)
def update_conference(id: int, conference: schemas.PreEntryConferenceUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_conference = db.query(models.PreEntryConference).filter(models.PreEntryConference.id == id, models.PreEntryConference.user_id == current_user.id).first()
    if not db_conference:
        raise HTTPException(status_code=404, detail="Conference not found")
    for key, value in conference.dict(exclude_unset=True, exclude={"user_id", "achievement_id"}).items():
        setattr(db_conference, key, value)
    db.commit()
    db.refresh(db_conference)
    return db_conference

@router.delete("/{id}")
def delete_conference(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_conference = db.query(models.PreEntryConference).filter(models.PreEntryConference.id == id, models.PreEntryConference.user_id == current_user.id).first()
    if not db_conference:
        raise HTTPException(status_code=404, detail="Conference not found")
    db.delete(db_conference)
    db.commit()
    return {"ok": True}
