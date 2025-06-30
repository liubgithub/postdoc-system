from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
from app.userinfoRegister.pre_entry_achievement.services import sync_achievement_count

router = APIRouter(
    prefix="/pre_entry_paper",
    tags=["学术论文信息"]
)

@router.post("/", response_model=schemas.PreEntryPaper)
def create_paper(paper: schemas.PreEntryPaperCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_paper = models.PreEntryPaper(**paper.dict(), user_id=current_user.id)
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    sync_achievement_count(db, current_user.id, "学术论文信息")
    return db_paper

@router.get("/{id}", response_model=schemas.PreEntryPaper)
def get_paper(id: int, db: Session = Depends(get_db)):
    paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@router.get("/user/{user_id}", response_model=list[schemas.PreEntryPaper])
def get_papers_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.PreEntryPaper).filter(models.PreEntryPaper.user_id == user_id).all()

@router.put("/{id}", response_model=schemas.PreEntryPaper)
def update_paper(id: int, paper: schemas.PreEntryPaperUpdate, db: Session = Depends(get_db)):
    db_paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    for key, value in paper.dict(exclude_unset=True).items():
        setattr(db_paper, key, value)
    db.commit()
    db.refresh(db_paper)
    return db_paper

@router.delete("/{id}")
def delete_paper(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id, models.PreEntryPaper.user_id == current_user.id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    db.delete(db_paper)
    db.commit()
    sync_achievement_count(db, current_user.id, "学术论文信息")
    return {"ok": True}
