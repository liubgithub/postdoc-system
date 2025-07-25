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
    专利成果名称: str = Form(...),
    专利类型: str = Form(""),
    提交时间: str = Form(""),
    批准日期: str = Form(""),
    授权公告号: str = Form(""),
    申请编号: str = Form(""),
    作者排名: str = Form(""),
    专利权人: str = Form(""),
    专利成果编码: str = Form(""),
    备注: str = Form(""),
    专利证书文文件: UploadFile = File(None),
    time: int = Form(0),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    apply_date = datetime.strptime(提交时间, "%Y-%m-%d") if 提交时间 else None
    grant_date = datetime.strptime(批准日期, "%Y-%m-%d") if 批准日期 else None

    db_patent = models.PreEntryPatent(
        user_id=current_user.id,
        time=time,
        专利成果名称=专利成果名称,
        专利类型=专利类型,
        提交时间=apply_date,
        批准日期=grant_date,
        授权公告号=授权公告号,
        申请编号=申请编号,
        作者排名=作者排名,
        专利权人=专利权人,
        专利成果编码=专利成果编码,
        备注=备注
    )

    # 文件上传
    if 专利证书文文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_patent", "专利证书文文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 专利证书文文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(专利证书文文件.file, buffer)
        db_patent.专利证书文文件 = f"/static/{current_user.id}/pre_entry_patent/专利证书文文件/{final_filename}"

    db.add(db_patent)
    db.commit()
    db.refresh(db_patent)
    return db_patent

@router.put("/{id}", response_model=schemas.PreEntryPatent)
async def update_patent(
    id: int,
    专利成果名称: str = Form(...),
    专利类型: str = Form(""),
    提交时间: str = Form(""),
    批准日期: str = Form(""),
    授权公告号: str = Form(""),
    申请编号: str = Form(""),
    作者排名: str = Form(""),
    专利权人: str = Form(""),
    专利成果编码: str = Form(""),
    备注: str = Form(""),
    专利证书文文件: UploadFile = File(None),
    time: int = Form(0),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_patent = db.query(models.PreEntryPatent).filter(
        models.PreEntryPatent.id == id,
        models.PreEntryPatent.user_id == current_user.id
    ).first()
    if not db_patent:
        raise HTTPException(status_code=404, detail="Patent not found")

    apply_date = datetime.strptime(提交时间, "%Y-%m-%d") if 提交时间 else None
    grant_date = datetime.strptime(批准日期, "%Y-%m-%d") if 批准日期 else None

    db_patent.专利成果名称 = 专利成果名称
    db_patent.专利类型 = 专利类型
    db_patent.提交时间 = apply_date
    db_patent.批准日期 = grant_date
    db_patent.授权公告号 = 授权公告号
    db_patent.申请编号 = 申请编号
    db_patent.作者排名 = 作者排名
    db_patent.专利权人 = 专利权人
    db_patent.专利成果编码 = 专利成果编码
    db_patent.备注 = 备注
    db_patent.time = time

    # 文件上传
    if 专利证书文文件:
        # 删除旧文件
        old_file_path = db_patent.专利证书文文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_patent", "专利证书文文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 专利证书文文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(专利证书文文件.file, buffer)
        db_patent.专利证书文文件 = f"/static/{current_user.id}/pre_entry_patent/专利证书文文件/{final_filename}"

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
    if db_patent.专利证书文文件:
        try:
            old_file_relative = db_patent.专利证书文文件.replace("/static/", "")
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
    if not patent or not patent.专利证书文文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_patent", "专利证书文文件", os.path.basename(patent.专利证书文文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
