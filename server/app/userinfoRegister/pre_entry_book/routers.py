from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
import os
import shutil
from datetime import datetime
from fastapi.responses import FileResponse
from uuid import uuid4
from fastapi.staticfiles import StaticFiles

router = APIRouter(
    prefix="/pre_entry_book",
    tags=["著作信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

def get_unique_filename(filename: str) -> str:
    ext = os.path.splitext(filename)[1]
    return f"{uuid4().hex}{ext}"

@router.post("/upload", response_model=schemas.PreEntryBook)
async def upload_book(
    著作中文名: str = Form(...),
    出版社: str = Form(...),
    第几作者: str = Form(...),
    出版日期: str = Form(...),
    著作编号: str = Form(...),
    著作类别: str = Form(...),
    作者名单: str = Form(...),
    著作字数: str = Form(...),
    出版号: str = Form(...),
    isbn: str = Form(...),
    作者排名: str = Form(...),
    备注: str = Form(None),
    file: UploadFile = File(None),  # 允许无文件
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    file_url = None
    if file:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_book", "上传文件")
        os.makedirs(user_dir, exist_ok=True)
        unique_filename = get_unique_filename(file.filename)
        file_path = os.path.join(user_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_url = f"/static/{current_user.id}/pre_entry_book/上传文件/{unique_filename}"
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
        上传文件=file_url,
        备注=备注
    )
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
    # 直接返回，上传文件字段就是URL，前端可直接用于预览
    return book

@router.put("/{id}", response_model=schemas.PreEntryBook)
async def update_book(
    id: int,
    著作中文名: str = Form(...),
    出版社: str = Form(...),
    第几作者: str = Form(...),
    出版日期: str = Form(...),
    著作编号: str = Form(...),
    著作类别: str = Form(...),
    作者名单: str = Form(...),
    著作字数: str = Form(...),
    出版号: str = Form(...),
    isbn: str = Form(...),
    作者排名: str = Form(...),
    备注: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_book = db.query(models.PreEntryBook).filter(
        models.PreEntryBook.id == id,
        models.PreEntryBook.user_id == current_user.id
    ).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    try:
        pub_date = datetime.strptime(出版日期, "%Y-%m-%d")
    except Exception:
        pub_date = None

    db_book.著作中文名 = 著作中文名
    db_book.出版社 = 出版社
    db_book.第几作者 = 第几作者
    db_book.出版日期 = pub_date
    db_book.著作编号 = 著作编号
    db_book.著作类别 = 著作类别
    db_book.作者名单 = 作者名单
    db_book.著作字数 = 著作字数
    db_book.出版号 = 出版号
    db_book.isbn = isbn
    db_book.作者排名 = 作者排名
    db_book.备注 = 备注

    if file:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_book", "上传文件")
        os.makedirs(user_dir, exist_ok=True)
        unique_filename = get_unique_filename(file.filename)
        file_path = os.path.join(user_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        db_book.上传文件 = f"/static/{current_user.id}/pre_entry_book/上传文件/{unique_filename}"
    # 如果 file 为空，不覆盖 db_book.上传文件

    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/{id}")
def delete_book(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    # 删除物理文件（如果有）
    if db_book.上传文件:
        file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_book", "上传文件", os.path.basename(db_book.上传文件))
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass  # 文件删除失败不影响主流程
    db.delete(db_book)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_book_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not book or not book.上传文件:
        raise HTTPException(status_code=404, detail="File not found")
    # 还原物理路径，支持分用户、分表、分字段子文件夹
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_book", "上传文件", os.path.basename(book.上传文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
