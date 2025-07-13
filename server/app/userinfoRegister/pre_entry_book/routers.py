from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
import os
import shutil
from datetime import datetime

router = APIRouter(
    prefix="/pre_entry_book",
    tags=["著作信息"]
)

UPLOAD_DIR = "uploaded_files/pre_entry_book"

@router.post("/upload", response_model=schemas.PreEntryBook)
async def upload_book(
    著作中文名: str = Form(...),
    出版社: str = Form(...),
    第几作者: str = Form(...),
    出版日期: str = Form(...),  # 前端传字符串，后端转datetime
    著作编号: str = Form(...),
    著作类别: str = Form(...),
    作者名单: str = Form(...),
    著作字数: str = Form(...),
    出版号: str = Form(...),
    isbn: str = Form(...),
    作者排名: str = Form(...),
    备注: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # 转换出版日期
    try:
        pub_date = datetime.strptime(出版日期, "%Y-%m-%d")
    except Exception:
        pub_date = None
    db_book = models.PreEntryBook(
        user_id=current_user.id,
        著作中文名=著作中文名,
        出版社=出版社,
        第几作者=第几作者,
        出版日期=pub_date,
        著作编号=著作编号,
        著作类别=著作类别,
        作者名单=作者名单,
        著作字数=著作字数,
        出版号=出版号,
        isbn=isbn,
        作者排名=作者排名,
        上传文件=file_path,
        备注=备注
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

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

from fastapi.responses import FileResponse

@router.get("/download/{id}")
def download_book_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not book or not book.上传文件:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(book.上传文件, filename=os.path.basename(book.上传文件))
