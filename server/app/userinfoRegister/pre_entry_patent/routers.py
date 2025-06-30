from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
from app.userinfoRegister.pre_entry_achievement.services import sync_achievement_count

router = APIRouter(
    prefix="/pre_entry_patent",
    tags=["专利信息"]
)

@router.post("/", response_model=schemas.PreEntryPatent)
def create_patent(patent: schemas.PreEntryPatentCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_patent = models.PreEntryPatent(**patent.dict(), user_id=current_user.id)
    db.add(db_patent)
    db.commit()
    db.refresh(db_patent)
    sync_achievement_count(db, current_user.id, "专利信息")
    return db_patent

@router.get("/{id}", response_model=schemas.PreEntryPatent)
def get_patent(id: int, db: Session = Depends(get_db)):
    patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id).first()
    if not patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    return patent

@router.get("/user/{user_id}", response_model=list[schemas.PreEntryPatent])
def get_patents_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.PreEntryPatent).filter(models.PreEntryPatent.user_id == user_id).all()

@router.put("/{id}", response_model=schemas.PreEntryPatent)
def update_patent(id: int, patent: schemas.PreEntryPatentUpdate, db: Session = Depends(get_db)):
    db_patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id).first()
    if not db_patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    for key, value in patent.dict(exclude_unset=True).items():
        setattr(db_patent, key, value)
    db.commit()
    db.refresh(db_patent)
    return db_patent

@router.delete("/{id}")
def delete_patent(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id, models.PreEntryPatent.user_id == current_user.id).first()
    if not db_patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    db.delete(db_patent)
    db.commit()
    sync_achievement_count(db, current_user.id, "专利信息")
    return {"ok": True}
