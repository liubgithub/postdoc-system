from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas

router = APIRouter(
    prefix="/pre_entry_industry_standard",
    tags=["行业标准信息"]
)

@router.post("/", response_model=schemas.PreEntryIndustryStandard)
def create_standard(item: schemas.PreEntryIndustryStandardCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_item = models.PreEntryIndustryStandard(**item.dict(exclude={"user_id"}), user_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/me", response_model=list[schemas.PreEntryIndustryStandard])
def get_my_standards(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryIndustryStandard)
def get_standard(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.id == id, models.PreEntryIndustryStandard.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item

@router.put("/{id}", response_model=schemas.PreEntryIndustryStandard)
def update_standard(id: int, item: schemas.PreEntryIndustryStandardUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_item = db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.id == id, models.PreEntryIndustryStandard.user_id == current_user.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Not found")
    for key, value in item.dict(exclude_unset=True, exclude={"user_id"}).items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{id}")
def delete_standard(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_item = db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.id == id, models.PreEntryIndustryStandard.user_id == current_user.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True} 