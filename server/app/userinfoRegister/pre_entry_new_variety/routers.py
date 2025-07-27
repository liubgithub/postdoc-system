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
    prefix="/pre_entry_new_variety",
    tags=["新品种信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryNewVariety)
async def create_new_variety(
    署名排序: str = Form(""),
    本校是否第一完成单位: str = Form(""),
    公示年份: str = Form(""),
    第一完成单位: str = Form(""),
    动植物名称: str = Form(""),
    品种名称: str = Form(...),
    选育单位: str = Form(""),
    公告号: str = Form(""),
    审定编号: str = Form(""),
    审定单位: str = Form(""),
    作者名单: str = Form(""),
    备注: str = Form(""),
    上传新品种证明文件: UploadFile = File(None),
    time: str = Form(""),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    publish_year = datetime.strptime(公示年份, "%Y-%m-%d") if 公示年份 else None
    time_date = datetime.strptime(time, "%Y-%m-%d") if time else None

    db_variety = models.PreEntryNewVariety(
        user_id=current_user.id,
        time=time_date,
        署名排序=署名排序,
        本校是否第一完成单位=本校是否第一完成单位,
        公示年份=publish_year,
        第一完成单位=第一完成单位,
        动植物名称=动植物名称,
        品种名称=品种名称,
        选育单位=选育单位,
        公告号=公告号,
        审定编号=审定编号,
        审定单位=审定单位,
        作者名单=作者名单,
        备注=备注
    )

    # 文件上传
    if 上传新品种证明文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_new_variety", "上传新品种证明文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传新品种证明文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传新品种证明文件.file, buffer)
        db_variety.上传新品种证明文件 = f"/static/{current_user.id}/pre_entry_new_variety/上传新品种证明文件/{final_filename}"

    db.add(db_variety)
    db.commit()
    db.refresh(db_variety)
    return db_variety

@router.put("/{id}", response_model=schemas.PreEntryNewVariety)
async def update_new_variety(
    id: int,
    署名排序: str = Form(""),
    本校是否第一完成单位: str = Form(""),
    公示年份: str = Form(""),
    第一完成单位: str = Form(""),
    动植物名称: str = Form(""),
    品种名称: str = Form(...),
    选育单位: str = Form(""),
    公告号: str = Form(""),
    审定编号: str = Form(""),
    审定单位: str = Form(""),
    作者名单: str = Form(""),
    备注: str = Form(""),
    上传新品种证明文件: UploadFile = File(None),
    time: str = Form(""),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_variety = db.query(models.PreEntryNewVariety).filter(
        models.PreEntryNewVariety.id == id,
        models.PreEntryNewVariety.user_id == current_user.id
    ).first()
    if not db_variety:
        raise HTTPException(status_code=404, detail="New variety not found")

    publish_year = datetime.strptime(公示年份, "%Y-%m-%d") if 公示年份 else None
    time_date = datetime.strptime(time, "%Y-%m-%d") if time else None

    db_variety.署名排序 = 署名排序
    db_variety.本校是否第一完成单位 = 本校是否第一完成单位
    db_variety.公示年份 = publish_year
    db_variety.第一完成单位 = 第一完成单位
    db_variety.动植物名称 = 动植物名称
    db_variety.品种名称 = 品种名称
    db_variety.选育单位 = 选育单位
    db_variety.公告号 = 公告号
    db_variety.审定编号 = 审定编号
    db_variety.审定单位 = 审定单位
    db_variety.作者名单 = 作者名单
    db_variety.备注 = 备注
    db_variety.time = time_date

    # 文件上传
    if 上传新品种证明文件:
        # 删除旧文件
        old_file_path = db_variety.上传新品种证明文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_new_variety", "上传新品种证明文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传新品种证明文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传新品种证明文件.file, buffer)
        db_variety.上传新品种证明文件 = f"/static/{current_user.id}/pre_entry_new_variety/上传新品种证明文件/{final_filename}"

    db.commit()
    db.refresh(db_variety)
    return db_variety

@router.get("/me", response_model=list[schemas.PreEntryNewVariety])
def get_my_new_varieties(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryNewVariety)
def get_new_variety(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    variety = db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.id == id, models.PreEntryNewVariety.user_id == current_user.id).first()
    if not variety:
        raise HTTPException(status_code=404, detail="New variety not found")
    return variety

@router.delete("/{id}")
def delete_new_variety(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_variety = db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.id == id, models.PreEntryNewVariety.user_id == current_user.id).first()
    if not db_variety:
        raise HTTPException(status_code=404, detail="New variety not found")
    # 删除物理文件
    if db_variety.上传新品种证明文件:
        try:
            old_file_relative = db_variety.上传新品种证明文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    db.delete(db_variety)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_new_variety_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    variety = db.query(models.PreEntryNewVariety).filter(models.PreEntryNewVariety.id == id, models.PreEntryNewVariety.user_id == current_user.id).first()
    if not variety or not variety.上传新品种证明文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_new_variety", "上传新品种证明文件", os.path.basename(variety.上传新品种证明文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
