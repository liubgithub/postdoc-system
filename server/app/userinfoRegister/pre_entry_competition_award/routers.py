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
    prefix="/pre_entry_competition_award",
    tags=["竞赛获奖信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryCompetitionAward)
async def create_competition_award(
    竞赛名称: str = Form(...),
    获奖类别: str = Form(""),
    获奖等级: str = Form(""),
    获奖时间: str = Form(""),
    本人署名: str = Form(""),
    获奖级别: str = Form(""),
    颁奖单位: str = Form(""),
    第一完成单位: str = Form(""),
    完成单位排名: str = Form(""),
    是否和学位论文相关: str = Form(""),
    奖项名称: str = Form(""),
    作者名单: str = Form(""),
    备注: str = Form(""),
    achievement_type: int = Form(0),
    上传获奖证书文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    award_date = datetime.strptime(获奖时间, "%Y-%m-%d") if 获奖时间 else None

    db_award = models.PreEntryCompetitionAward(
        user_id=current_user.id,
        achievement_type=achievement_type,
        竞赛名称=竞赛名称,
        获奖类别=获奖类别,
        获奖等级=获奖等级,
        获奖时间=award_date,
        本人署名=本人署名,
        获奖级别=获奖级别,
        颁奖单位=颁奖单位,
        第一完成单位=第一完成单位,
        完成单位排名=完成单位排名,
        是否和学位论文相关=是否和学位论文相关,
        奖项名称=奖项名称,
        作者名单=作者名单,
        备注=备注
    )

    # 文件上传
    if 上传获奖证书文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_competition_award", "上传获奖证书文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传获奖证书文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传获奖证书文件.file, buffer)
        db_award.上传获奖证书文件 = f"/static/{current_user.id}/pre_entry_competition_award/上传获奖证书文件/{final_filename}"

    db.add(db_award)
    db.commit()
    db.refresh(db_award)
    return db_award

@router.put("/{id}", response_model=schemas.PreEntryCompetitionAward)
async def update_competition_award(
    id: int,
    竞赛名称: str = Form(...),
    获奖类别: str = Form(""),
    获奖等级: str = Form(""),
    获奖时间: str = Form(""),
    本人署名: str = Form(""),
    获奖级别: str = Form(""),
    颁奖单位: str = Form(""),
    第一完成单位: str = Form(""),
    完成单位排名: str = Form(""),
    是否和学位论文相关: str = Form(""),
    奖项名称: str = Form(""),
    作者名单: str = Form(""),
    备注: str = Form(""),
    achievement_type: int = Form(0),
    上传获奖证书文件: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_award = db.query(models.PreEntryCompetitionAward).filter(
        models.PreEntryCompetitionAward.id == id,
        models.PreEntryCompetitionAward.user_id == current_user.id
    ).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Competition award not found")

    award_date = datetime.strptime(获奖时间, "%Y-%m-%d") if 获奖时间 else None

    db_award.竞赛名称 = 竞赛名称
    db_award.获奖类别 = 获奖类别
    db_award.获奖等级 = 获奖等级
    db_award.获奖时间 = award_date
    db_award.本人署名 = 本人署名
    db_award.获奖级别 = 获奖级别
    db_award.颁奖单位 = 颁奖单位
    db_award.第一完成单位 = 第一完成单位
    db_award.完成单位排名 = 完成单位排名
    db_award.是否和学位论文相关 = 是否和学位论文相关
    db_award.奖项名称 = 奖项名称
    db_award.作者名单 = 作者名单
    db_award.备注 = 备注
    db_award.achievement_type = achievement_type

    # 文件上传
    if 上传获奖证书文件:
        # 删除旧文件
        old_file_path = db_award.上传获奖证书文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_competition_award", "上传获奖证书文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传获奖证书文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传获奖证书文件.file, buffer)
        db_award.上传获奖证书文件 = f"/static/{current_user.id}/pre_entry_competition_award/上传获奖证书文件/{final_filename}"

    db.commit()
    db.refresh(db_award)
    return db_award

@router.get("/me", response_model=List[schemas.PreEntryCompetitionAward])
def get_my_competition_awards(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryCompetitionAward)
def get_competition_award(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    award = db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.id == id, models.PreEntryCompetitionAward.user_id == current_user.id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Competition award not found")
    return award

@router.delete("/{id}")
def delete_competition_award(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_award = db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.id == id, models.PreEntryCompetitionAward.user_id == current_user.id).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Competition award not found")
    # 删除物理文件
    if db_award.上传获奖证书文件:
        try:
            old_file_relative = db_award.上传获奖证书文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    db.delete(db_award)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_competition_award_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    award = db.query(models.PreEntryCompetitionAward).filter(models.PreEntryCompetitionAward.id == id, models.PreEntryCompetitionAward.user_id == current_user.id).first()
    if not award or not award.上传获奖证书文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_competition_award", "上传获奖证书文件", os.path.basename(award.上传获奖证书文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
