from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
import os
import shutil
from datetime import datetime
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/pre_entry_industry_standard",
    tags=["行业标准信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryIndustryStandard)
async def create_industry_standard(
    标准名称: str = Form(...),
    标准编号: str = Form(""),
    发布日期: str = Form(""),
    实施日期: str = Form(""),
    归口单位: str = Form(""),
    起草单位: str = Form(""),
    适用范围: str = Form(""),
    备注: str = Form(""),
    上传文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    publish_date = datetime.strptime(发布日期, "%Y-%m-%d") if 发布日期 else None
    implement_date = datetime.strptime(实施日期, "%Y-%m-%d") if 实施日期 else None

    db_standard = models.PreEntryIndustryStandard(
        user_id=current_user.id,
        标准名称=标准名称,
        标准编号=标准编号,
        发布日期=publish_date,
        实施日期=implement_date,
        归口单位=归口单位,
        起草单位=起草单位,
        适用范围=适用范围,
        备注=备注
    )

    # 文件上传
    if 上传文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_industry_standard", "上传文件")
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
        db_standard.上传文件 = f"/static/{current_user.id}/pre_entry_industry_standard/上传文件/{final_filename}"

    db.add(db_standard)
    db.commit()
    db.refresh(db_standard)
    return db_standard

@router.put("/{id}", response_model=schemas.PreEntryIndustryStandard)
async def update_industry_standard(
    id: int,
    标准名称: str = Form(...),
    标准编号: str = Form(""),
    发布日期: str = Form(""),
    实施日期: str = Form(""),
    归口单位: str = Form(""),
    起草单位: str = Form(""),
    适用范围: str = Form(""),
    备注: str = Form(""),
    上传文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_standard = db.query(models.PreEntryIndustryStandard).filter(
        models.PreEntryIndustryStandard.id == id,
        models.PreEntryIndustryStandard.user_id == current_user.id
    ).first()
    if not db_standard:
        raise HTTPException(status_code=404, detail="Industry standard not found")

    publish_date = datetime.strptime(发布日期, "%Y-%m-%d") if 发布日期 else None
    implement_date = datetime.strptime(实施日期, "%Y-%m-%d") if 实施日期 else None

    db_standard.标准名称 = 标准名称
    db_standard.标准编号 = 标准编号
    db_standard.发布日期 = publish_date
    db_standard.实施日期 = implement_date
    db_standard.归口单位 = 归口单位
    db_standard.起草单位 = 起草单位
    db_standard.适用范围 = 适用范围
    db_standard.备注 = 备注

    # 文件上传
    if 上传文件:
        # 删除旧文件
        old_file_path = db_standard.上传文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_industry_standard", "上传文件")
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
        db_standard.上传文件 = f"/static/{current_user.id}/pre_entry_industry_standard/上传文件/{final_filename}"

    db.commit()
    db.refresh(db_standard)
    return db_standard

@router.get("/me", response_model=list[schemas.PreEntryIndustryStandard])
def get_my_industry_standards(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryIndustryStandard)
def get_industry_standard(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    standard = db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.id == id, models.PreEntryIndustryStandard.user_id == current_user.id).first()
    if not standard:
        raise HTTPException(status_code=404, detail="Industry standard not found")
    return standard

@router.delete("/{id}")
def delete_industry_standard(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_standard = db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.id == id, models.PreEntryIndustryStandard.user_id == current_user.id).first()
    if not db_standard:
        raise HTTPException(status_code=404, detail="Industry standard not found")
    # 删除物理文件
    if db_standard.上传文件:
        try:
            old_file_relative = db_standard.上传文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    db.delete(db_standard)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_industry_standard_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    standard = db.query(models.PreEntryIndustryStandard).filter(models.PreEntryIndustryStandard.id == id, models.PreEntryIndustryStandard.user_id == current_user.id).first()
    if not standard or not standard.上传文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_industry_standard", "上传文件", os.path.basename(standard.上传文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path)) 