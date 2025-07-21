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
    prefix="/pre_entry_subject_research",
    tags=["课题研究信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntrySubjectResearch)
async def create_subject(
    课题名称: str = Form(...),
    课题来源: str = Form(""),
    开始时间: str = Form(""),
    结束时间: str = Form(""),
    课题负责人: str = Form(""),
    本人承担部分: str = Form(""),
    课题级别: str = Form(""),
    备注: str = Form(""),
    上传文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    start_date = datetime.strptime(开始时间, "%Y-%m-%d") if 开始时间 else None
    end_date = datetime.strptime(结束时间, "%Y-%m-%d") if 结束时间 else None

    db_subject = models.PreEntrySubjectResearch(
        user_id=current_user.id,
        课题名称=课题名称,
        课题来源=课题来源,
        开始时间=start_date,
        结束时间=end_date,
        课题负责人=课题负责人,
        本人承担部分=本人承担部分,
        课题级别=课题级别,
        备注=备注
    )

    # 文件上传
    if 上传文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_subject_research", "上传文件")
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
        db_subject.上传文件 = f"/static/{current_user.id}/pre_entry_subject_research/上传文件/{final_filename}"

    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.put("/{id}", response_model=schemas.PreEntrySubjectResearch)
async def update_subject(
    id: int,
    课题名称: str = Form(...),
    课题来源: str = Form(""),
    开始时间: str = Form(""),
    结束时间: str = Form(""),
    课题负责人: str = Form(""),
    本人承担部分: str = Form(""),
    课题级别: str = Form(""),
    备注: str = Form(""),
    上传文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_subject = db.query(models.PreEntrySubjectResearch).filter(
        models.PreEntrySubjectResearch.id == id,
        models.PreEntrySubjectResearch.user_id == current_user.id
    ).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    start_date = datetime.strptime(开始时间, "%Y-%m-%d") if 开始时间 else None
    end_date = datetime.strptime(结束时间, "%Y-%m-%d") if 结束时间 else None

    db_subject.课题名称 = 课题名称
    db_subject.课题来源 = 课题来源
    db_subject.开始时间 = start_date
    db_subject.结束时间 = end_date
    db_subject.课题负责人 = 课题负责人
    db_subject.本人承担部分 = 本人承担部分
    db_subject.课题级别 = 课题级别
    db_subject.备注 = 备注

    # 文件上传
    if 上传文件:
        # 删除旧文件
        old_file_path = db_subject.上传文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_subject_research", "上传文件")
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
        db_subject.上传文件 = f"/static/{current_user.id}/pre_entry_subject_research/上传文件/{final_filename}"

    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/me", response_model=list[schemas.PreEntrySubjectResearch])
def get_my_subjects(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntrySubjectResearch)
def get_subject(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    subject = db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.id == id, models.PreEntrySubjectResearch.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.delete("/{id}")
def delete_subject_research(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_research = db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.id == id, models.PreEntrySubjectResearch.user_id == current_user.id).first()
    if not db_research:
        raise HTTPException(status_code=404, detail="Subject research not found")
    # 删除物理文件
    if db_research.上传文件:
        try:
            old_file_relative = db_research.上传文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    db.delete(db_research)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_subject_research_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    research = db.query(models.PreEntrySubjectResearch).filter(models.PreEntrySubjectResearch.id == id, models.PreEntrySubjectResearch.user_id == current_user.id).first()
    if not research or not research.上传文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_subject_research", "上传文件", os.path.basename(research.上传文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
