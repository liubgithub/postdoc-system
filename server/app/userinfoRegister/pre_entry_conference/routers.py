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
    prefix="/pre_entry_conference",
    tags=["会议信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryConference)
async def create_conference(
    会议编号: str = Form(""),
    会议名称: str = Form(...),
    会议英文名: str = Form(""),
    主办单位: str = Form(""),
    会议举办形式: str = Form(""),
    会议等级: str = Form(""),
    国家或地区: str = Form(""),
    是否境外: str = Form(""),
    会议起始日: str = Form(""),
    会议终止日: str = Form(""),
    举办单位: str = Form(""),
    会议人数: str = Form(""),
    联系人电话: str = Form(""),
    会议地点: str = Form(""),
    会议报告: str = Form(""),
    会议报告文件: UploadFile = File(None),
    备注: str = Form(""),
    time: str = Form(""),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    start_date = datetime.strptime(会议起始日, "%Y-%m-%d") if 会议起始日 else None
    end_date = datetime.strptime(会议终止日, "%Y-%m-%d") if 会议终止日 else None
    time_parsed = datetime.strptime(time, "%Y-%m-%d") if time else None

    db_conference = models.PreEntryConference(
        user_id=current_user.id,
        time=time_parsed,
        会议编号=会议编号,
        会议名称=会议名称,
        会议英文名=会议英文名,
        主办单位=主办单位,
        会议举办形式=会议举办形式,
        会议等级=会议等级,
        国家或地区=国家或地区,
        是否境外=是否境外,
        会议起始日=start_date,
        会议终止日=end_date,
        举办单位=举办单位,
        会议人数=会议人数,
        联系人电话=联系人电话,
        会议地点=会议地点,
        会议报告=会议报告,
        备注=备注
    )

    # 文件上传
    if 会议报告文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_conference", "会议报告文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 会议报告文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(会议报告文件.file, buffer)
        db_conference.会议报告文件 = f"/static/{current_user.id}/pre_entry_conference/会议报告文件/{final_filename}"

    db.add(db_conference)
    db.commit()
    db.refresh(db_conference)
    return db_conference

@router.put("/{id}", response_model=schemas.PreEntryConference)
async def update_conference(
    id: int,
    会议编号: str = Form(""),
    会议名称: str = Form(...),
    会议英文名: str = Form(""),
    主办单位: str = Form(""),
    会议举办形式: str = Form(""),
    会议等级: str = Form(""),
    国家或地区: str = Form(""),
    是否境外: str = Form(""),
    会议起始日: str = Form(""),
    会议终止日: str = Form(""),
    举办单位: str = Form(""),
    会议人数: str = Form(""),
    联系人电话: str = Form(""),
    会议地点: str = Form(""),
    会议报告: str = Form(""),
    会议报告文件: UploadFile = File(None),
    备注: str = Form(""),
    time: str = Form(""),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_conference = db.query(models.PreEntryConference).filter(
        models.PreEntryConference.id == id,
        models.PreEntryConference.user_id == current_user.id
    ).first()
    if not db_conference:
        raise HTTPException(status_code=404, detail="Conference not found")

    start_date = datetime.strptime(会议起始日, "%Y-%m-%d") if 会议起始日 else None
    end_date = datetime.strptime(会议终止日, "%Y-%m-%d") if 会议终止日 else None
    time_parsed = datetime.strptime(time, "%Y-%m-%d") if time else None

    db_conference.会议编号 = 会议编号
    db_conference.会议名称 = 会议名称
    db_conference.会议英文名 = 会议英文名
    db_conference.主办单位 = 主办单位
    db_conference.会议举办形式 = 会议举办形式
    db_conference.会议等级 = 会议等级
    db_conference.国家或地区 = 国家或地区
    db_conference.是否境外 = 是否境外
    db_conference.会议起始日 = start_date
    db_conference.会议终止日 = end_date
    db_conference.举办单位 = 举办单位
    db_conference.会议人数 = 会议人数
    db_conference.联系人电话 = 联系人电话
    db_conference.会议地点 = 会议地点
    db_conference.会议报告 = 会议报告
    db_conference.备注 = 备注
    db_conference.time = time_parsed

    # 文件上传
    if 会议报告文件:
        # 删除旧文件
        old_file_path = db_conference.会议报告文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_conference", "会议报告文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 会议报告文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(会议报告文件.file, buffer)
        db_conference.会议报告文件 = f"/static/{current_user.id}/pre_entry_conference/会议报告文件/{final_filename}"

    db.commit()
    db.refresh(db_conference)
    return db_conference

@router.get("/me", response_model=List[schemas.PreEntryConference])
def get_my_conferences(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryConference).filter(models.PreEntryConference.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryConference)
def get_conference(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    conference = db.query(models.PreEntryConference).filter(models.PreEntryConference.id == id, models.PreEntryConference.user_id == current_user.id).first()
    if not conference:
        raise HTTPException(status_code=404, detail="Conference not found")
    return conference

@router.delete("/{id}")
def delete_conference(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_conference = db.query(models.PreEntryConference).filter(models.PreEntryConference.id == id, models.PreEntryConference.user_id == current_user.id).first()
    if not db_conference:
        raise HTTPException(status_code=404, detail="Conference not found")
    # 删除物理文件
    if db_conference.会议报告文件:
        try:
            old_file_relative = db_conference.会议报告文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    db.delete(db_conference)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_conference_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    conference = db.query(models.PreEntryConference).filter(models.PreEntryConference.id == id, models.PreEntryConference.user_id == current_user.id).first()
    if not conference or not conference.会议报告文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_conference", "会议报告文件", os.path.basename(conference.会议报告文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
