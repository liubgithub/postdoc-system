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
    prefix="/pre_entry_patent",
    tags=["专利信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryPatent)
async def create_patent(
    专利名称: str = Form(...),
    专利类型: str = Form(""),
    申请日期: str = Form(""),
    授权日期: str = Form(""),
    专利号: str = Form(""),
    申请号: str = Form(""),
    发明人: str = Form(""),
    专利权人: str = Form(""),
    专利状态: str = Form(""),
    备注: str = Form(""),
    上传文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    apply_date = datetime.strptime(申请日期, "%Y-%m-%d") if 申请日期 else None
    grant_date = datetime.strptime(授权日期, "%Y-%m-%d") if 授权日期 else None

    db_patent = models.PreEntryPatent(
        user_id=current_user.id,
        专利名称=专利名称,
        专利类型=专利类型,
        申请日期=apply_date,
        授权日期=grant_date,
        专利号=专利号,
        申请号=申请号,
        发明人=发明人,
        专利权人=专利权人,
        专利状态=专利状态,
        备注=备注
    )

    # 文件上传
    if 上传文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_patent", "上传文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传文件.file, buffer)
        db_patent.上传文件 = f"/static/{current_user.id}/pre_entry_patent/上传文件/{final_filename}"

    db.add(db_patent)
    db.commit()
    db.refresh(db_patent)
    return db_patent

@router.put("/{id}", response_model=schemas.PreEntryPatent)
async def update_patent(
    id: int,
    专利名称: str = Form(...),
    专利类型: str = Form(""),
    申请日期: str = Form(""),
    授权日期: str = Form(""),
    专利号: str = Form(""),
    申请号: str = Form(""),
    发明人: str = Form(""),
    专利权人: str = Form(""),
    专利状态: str = Form(""),
    备注: str = Form(""),
    上传文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_patent = db.query(models.PreEntryPatent).filter(
        models.PreEntryPatent.id == id,
        models.PreEntryPatent.user_id == current_user.id
    ).first()
    if not db_patent:
        raise HTTPException(status_code=404, detail="Patent not found")

    apply_date = datetime.strptime(申请日期, "%Y-%m-%d") if 申请日期 else None
    grant_date = datetime.strptime(授权日期, "%Y-%m-%d") if 授权日期 else None

    db_patent.专利名称 = 专利名称
    db_patent.专利类型 = 专利类型
    db_patent.申请日期 = apply_date
    db_patent.授权日期 = grant_date
    db_patent.专利号 = 专利号
    db_patent.申请号 = 申请号
    db_patent.发明人 = 发明人
    db_patent.专利权人 = 专利权人
    db_patent.专利状态 = 专利状态
    db_patent.备注 = 备注

    # 文件上传
    if 上传文件:
        # 删除旧文件
        old_file_path = db_patent.上传文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_patent", "上传文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传文件.file, buffer)
        db_patent.上传文件 = f"/static/{current_user.id}/pre_entry_patent/上传文件/{final_filename}"

    db.commit()
    db.refresh(db_patent)
    return db_patent

@router.get("/me", response_model=List[schemas.PreEntryPatent])
def get_my_patents(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryPatent).filter(models.PreEntryPatent.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryPatent)
def get_patent(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id, models.PreEntryPatent.user_id == current_user.id).first()
    if not patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    return patent

@router.delete("/{id}")
def delete_patent(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id, models.PreEntryPatent.user_id == current_user.id).first()
    if not db_patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    # 删除物理文件
    if db_patent.上传文件:
        try:
            old_file_relative = db_patent.上传文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    db.delete(db_patent)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_patent_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    patent = db.query(models.PreEntryPatent).filter(models.PreEntryPatent.id == id, models.PreEntryPatent.user_id == current_user.id).first()
    if not patent or not patent.上传文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_patent", "上传文件", os.path.basename(patent.上传文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
