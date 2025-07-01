from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas

router = APIRouter(
    prefix="/pre_entry_patent",
    tags=["专利信息"]
)

@router.post("/", response_model=schemas.PreEntryPatent)
def create_patent(patent: schemas.PreEntryPatentCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_patent = models.PreEntryPatent(**patent.dict(exclude={"user_id", "achievement_id"}), user_id=current_user.id)
    db.add(db_patent)
    db.commit()
    db.refresh(db_patent)
    return db_patent

@router.get("/me", response_model=list[schemas.PreEntryPatent])
def get_my_patents(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryPatent).filter(models.PreEntryPatent.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryPatent)
def get_patent(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id, models.PreEntryPatent.user_id == current_user.id).first()
    if not patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    return patent

@router.put("/{id}", response_model=schemas.PreEntryPatent)
def update_patent(id: int, patent: schemas.PreEntryPatentUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id, models.PreEntryPatent.user_id == current_user.id).first()
    if not db_patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    for key, value in patent.dict(exclude_unset=True, exclude={"user_id", "achievement_id"}).items():
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
    return {"ok": True}
