from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
import os
import shutil
from datetime import datetime
from fastapi.responses import FileResponse
from typing import List

router = APIRouter(
    prefix="/pre_entry_book",
    tags=["著作信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryBook)
async def create_book(
    # 必填字段
    著作中文名: str = Form(...),
    出版社: str = Form(...),
    出版日期: str = Form(...),
    
    # 可选字段
    第几作者: str = Form(""),
    著作编号: str = Form(""),
    著作类别: str = Form(""),
    作者名单: str = Form(""),
    著作字数: str = Form(""),
    出版号: str = Form(""),
    isbn: str = Form(""),
    作者排名: str = Form(""),
    备注: str = Form(""),
    
    # 可选文件
    file: UploadFile = File(None),
    
    # 新增时间字段
    time: str = Form(""),
    
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析出版日期和时间
    try:
        pub_date = datetime.strptime(出版日期, "%Y-%m-%d") if 出版日期 else None
        time_value = datetime.strptime(time, "%Y-%m-%d") if time else None
    except Exception:
        raise HTTPException(status_code=400, detail="日期格式错误，应为 YYYY-MM-DD")
    
    # 创建著作记录
    db_book = models.PreEntryBook(
        user_id=current_user.id,
        著作中文名=著作中文名,
        出版社=出版社,
        出版日期=pub_date,
        第几作者=第几作者,
        著作编号=著作编号,
        著作类别=著作类别,
        作者名单=作者名单,
        著作字数=著作字数,
        出版号=出版号,
        isbn=isbn,
        作者排名=作者排名,
        备注=备注,
        time=time_value
    )
    
    # 处理文件上传
    if file:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_book", "上传文件")
        os.makedirs(user_dir, exist_ok=True)
        
        # 直接使用原始文件名，但确保文件名安全
        original_filename = file.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        
        # 检查文件是否已存在，如果存在则添加数字后缀
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        
        file_path = os.path.join(user_dir, final_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        db_book.上传文件 = f"/static/{current_user.id}/pre_entry_book/上传文件/{final_filename}"
    
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.put("/{id}", response_model=schemas.PreEntryBook)
async def update_book(
    id: int,
    # 必填字段
    著作中文名: str = Form(...),
    出版社: str = Form(...),
    出版日期: str = Form(...),
    
    # 可选字段
    第几作者: str = Form(""),
    著作编号: str = Form(""),
    著作类别: str = Form(""),
    作者名单: str = Form(""),
    著作字数: str = Form(""),
    出版号: str = Form(""),
    isbn: str = Form(""),
    作者排名: str = Form(""),
    备注: str = Form(""),
    
    # 可选文件
    file: UploadFile = File(None),
    
    # 新增时间字段
    time: str = Form(""),
    
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 查询要更新的著作记录
    db_book = db.query(models.PreEntryBook).filter(
        models.PreEntryBook.id == id,
        models.PreEntryBook.user_id == current_user.id
    ).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # 解析出版日期和时间
    try:
        pub_date = datetime.strptime(出版日期, "%Y-%m-%d") if 出版日期 else None
        time_value = datetime.strptime(time, "%Y-%m-%d") if time else None
    except Exception:
        raise HTTPException(status_code=400, detail="日期格式错误，应为 YYYY-MM-DD")
    
    # 更新字段
    db_book.著作中文名 = 著作中文名
    db_book.出版社 = 出版社
    db_book.出版日期 = pub_date
    db_book.第几作者 = 第几作者
    db_book.著作编号 = 著作编号
    db_book.著作类别 = 著作类别
    db_book.作者名单 = 作者名单
    db_book.著作字数 = 著作字数
    db_book.出版号 = 出版号
    db_book.isbn = isbn
    db_book.作者排名 = 作者排名
    db_book.备注 = 备注
    db_book.time = time_value
    
    # 处理文件字段：只处理有新文件上传的情况
    if file:
        # 删除旧文件
        old_file_path = db_book.上传文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        
        # 保存新文件
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_book", "上传文件")
        os.makedirs(user_dir, exist_ok=True)
        
        # 直接使用原始文件名，但确保文件名安全
        original_filename = file.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        
        # 检查文件是否已存在，如果存在则添加数字后缀
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        
        file_path = os.path.join(user_dir, final_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        db_book.上传文件 = f"/static/{current_user.id}/pre_entry_book/上传文件/{final_filename}"
    
    db.commit()
    db.refresh(db_book)
    return db_book

@router.get("/me", response_model=List[schemas.PreEntryBook])
def get_my_books(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryBook).filter(models.PreEntryBook.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryBook)
def get_book(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.delete("/{id}")
def delete_book(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # 删除物理文件
    if db_book.上传文件:
        try:
            old_file_relative = db_book.上传文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    
    db.delete(db_book)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_book_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    book = db.query(models.PreEntryBook).filter(models.PreEntryBook.id == id, models.PreEntryBook.user_id == current_user.id).first()
    if not book or not book.上传文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_book", "上传文件", os.path.basename(book.上传文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
