from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from . import models, schemas
from typing import List

router = APIRouter(
    prefix="/pre_entry_achievement",
    tags=["入站前成果统计"]
)

@router.post("/", response_model=schemas.PreEntryAchievement)
def create_achievement(achievement: schemas.PreEntryAchievement, db: Session = Depends(get_db)):
    db_achievement = models.BsPreEntryAchievement(
        user_id=achievement.user_id,
        category=achievement.category,
        count=achievement.count,
        remark=achievement.remark
    )
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

@router.get("/user/{user_id}", response_model=List[schemas.PreEntryAchievement])
def get_achievements_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.BsPreEntryAchievement).filter(models.BsPreEntryAchievement.user_id == user_id).all()

@router.get("/{achievement_id}", response_model=schemas.PreEntryAchievement)
def get_achievement(achievement_id: int, db: Session = Depends(get_db)):
    achievement = db.query(models.BsPreEntryAchievement).filter(models.BsPreEntryAchievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

@router.put("/{achievement_id}", response_model=schemas.PreEntryAchievement)
def update_achievement(achievement_id: int, achievement: schemas.PreEntryAchievement, db: Session = Depends(get_db)):
    db_achievement = db.query(models.BsPreEntryAchievement).filter(models.BsPreEntryAchievement.id == achievement_id).first()
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db_achievement.category = achievement.category
    db_achievement.count = achievement.count
    db_achievement.remark = achievement.remark
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

@router.delete("/{achievement_id}")
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    db_achievement = db.query(models.BsPreEntryAchievement).filter(models.BsPreEntryAchievement.id == achievement_id).first()
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(db_achievement)
    db.commit()
    return {"ok": True}
