from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas

router = APIRouter(
    prefix="/pre_entry_book",
    tags=["著作信息"]
)

@router.post("/", response_model=schemas.PreEntryBook)
def create_book(book: schemas.PreEntryBookCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_book = models.PreEntryBook(**book.dict(exclude={"user_id", "achievement_id"}), user_id=current_user.id)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.get("/me", response_model=list[schemas.PreEntryBook])
def get_my_books(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryBook).filter(models.PreEntryBook.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryBook)
def get_book(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{id}", response_model=schemas.PreEntryBook)
def update_book(id: int, book: schemas.PreEntryBookUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    for key, value in book.dict(exclude_unset=True, exclude={"user_id", "achievement_id"}).items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/{id}")
def delete_book(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(db_book)
    db.commit()
    return {"ok": True}
