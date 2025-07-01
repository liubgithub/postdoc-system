from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas

router = APIRouter(
    prefix="/pre_entry_new_variety",
    tags=["新品种类型信息"]
)

@router.post("/", response_model=schemas.PreEntryNewVariety)
def create_variety(variety: schemas.PreEntryNewVarietyCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_variety = models.PreEntryNewVariety(**variety.dict(exclude={"user_id", "achievement_id"}), user_id=current_user.id)
    db.add(db_variety)
    db.commit()
    db.refresh(db_variety)
    return db_variety

@router.get("/me", response_model=list[schemas.PreEntryNewVariety])
def get_my_varieties(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryNewVariety)
def get_variety(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    variety = db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.id == id, models.PreEntryNewVariety.user_id == current_user.id).first()
    if not variety:
        raise HTTPException(status_code=404, detail="Variety not found")
    return variety

@router.put("/{id}", response_model=schemas.PreEntryNewVariety)
def update_variety(id: int, variety: schemas.PreEntryNewVarietyUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_variety = db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.id == id, models.PreEntryNewVariety.user_id == current_user.id).first()
    if not db_variety:
        raise HTTPException(status_code=404, detail="Variety not found")
    for key, value in variety.dict(exclude_unset=True, exclude={"user_id", "achievement_id"}).items():
        setattr(db_variety, key, value)
    db.commit()
    db.refresh(db_variety)
    return db_variety

@router.delete("/{id}")
def delete_variety(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_variety = db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.id == id, models.PreEntryNewVariety.user_id == current_user.id).first()
    if not db_variety:
        raise HTTPException(status_code=404, detail="Variety not found")
    db.delete(db_variety)
    db.commit()
    return {"ok": True}
