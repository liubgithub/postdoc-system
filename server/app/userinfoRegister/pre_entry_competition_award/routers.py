from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
from app.userinfoRegister.pre_entry_achievement.services import sync_achievement_count

router = APIRouter(
    prefix="/pre_entry_competition_award",
    tags=["竞赛获奖信息"]
)

@router.post("/", response_model=schemas.PreEntryCompetitionAward)
def create_award(award: schemas.PreEntryCompetitionAwardCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_award = models.PreEntryCompetitionAward(**award.dict(), user_id=current_user.id)
    db.add(db_award)
    db.commit()
    db.refresh(db_award)
    sync_achievement_count(db, current_user.id, "竞赛获奖信息")
    return db_award

@router.get("/me", response_model=list[schemas.PreEntryCompetitionAward])
def get_my_awards(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryCompetitionAward)
def get_award(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    award = db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.id == id, models.PreEntryCompetitionAward.user_id == current_user.id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    return award

@router.put("/{id}", response_model=schemas.PreEntryCompetitionAward)
def update_award(id: int, award: schemas.PreEntryCompetitionAwardUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_award = db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.id == id, models.PreEntryCompetitionAward.user_id == current_user.id).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Award not found")
    for key, value in award.dict(exclude_unset=True).items():
        setattr(db_award, key, value)
    db.commit()
    db.refresh(db_award)
    return db_award

@router.delete("/{id}")
def delete_award(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_award = db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.id == id, models.PreEntryCompetitionAward.user_id == current_user.id).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Award not found")
    db.delete(db_award)
    db.commit()
    sync_achievement_count(db, current_user.id, "竞赛获奖信息")
    return {"ok": True}
