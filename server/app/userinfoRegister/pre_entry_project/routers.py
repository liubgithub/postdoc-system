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
    prefix="/pre_entry_project",
    tags=["项目信息"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryProject)
async def create_project(
    项目编号: str = Form(""),
    项目名称: str = Form(...),
    项目类型: str = Form(""),
    是否和学位论文相关: str = Form(""),
    项目标题: str = Form(""),
    立项日期: str = Form(""),
    项目层次: str = Form(""),
    是否结项: str = Form(""),
    验收或鉴定日期: str = Form(""),
    项目执行状态: str = Form(""),
    本人角色: str = Form(""),
    参与者总数: str = Form(""),
    参与者名单: str = Form(""),
    承担任务: str = Form(""),
    项目经费说明: str = Form(""),
    备注: str = Form(""),
    上传项目成果文件: UploadFile = File(None),
    time: str = Form(""),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析日期
    start_date = datetime.strptime(立项日期, "%Y-%m-%d") if 立项日期 else None
    accept_date = datetime.strptime(验收或鉴定日期, "%Y-%m-%d") if 验收或鉴定日期 else None
    time_date = datetime.strptime(time, "%Y-%m-%d") if time else None

    db_project = models.PreEntryProject(
        user_id=current_user.id,
        time=time_date,
        项目编号=项目编号,
        项目名称=项目名称,
        项目类型=项目类型,
        是否和学位论文相关=是否和学位论文相关,
        项目标题=项目标题,
        立项日期=start_date,
        项目层次=项目层次,
        是否结项=是否结项,
        验收或鉴定日期=accept_date,
        项目执行状态=项目执行状态,
        本人角色=本人角色,
        参与者总数=参与者总数,
        参与者名单=参与者名单,
        承担任务=承担任务,
        项目经费说明=项目经费说明,
        备注=备注
    )

    # 文件上传
    if 上传项目成果文件:
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_project", "上传项目成果文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传项目成果文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传项目成果文件.file, buffer)
        db_project.上传项目成果文件 = f"/static/{current_user.id}/pre_entry_project/上传项目成果文件/{final_filename}"

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{id}", response_model=schemas.PreEntryProject)
async def update_project(
    id: int,
    项目编号: str = Form(""),
    项目名称: str = Form(...),
    项目类型: str = Form(""),
    是否和学位论文相关: str = Form(""),
    项目标题: str = Form(""),
    立项日期: str = Form(""),
    项目层次: str = Form(""),
    是否结项: str = Form(""),
    验收或鉴定日期: str = Form(""),
    项目执行状态: str = Form(""),
    本人角色: str = Form(""),
    参与者总数: str = Form(""),
    参与者名单: str = Form(""),
    承担任务: str = Form(""),
    项目经费说明: str = Form(""),
    备注: str = Form(""),
    上传项目成果文件: UploadFile = File(None),
    time: str = Form(""),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_project = db.query(models.PreEntryProject).filter(
        models.PreEntryProject.id == id,
        models.PreEntryProject.user_id == current_user.id
    ).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    start_date = datetime.strptime(立项日期, "%Y-%m-%d") if 立项日期 else None
    accept_date = datetime.strptime(验收或鉴定日期, "%Y-%m-%d") if 验收或鉴定日期 else None
    time_date = datetime.strptime(time, "%Y-%m-%d") if time else None

    db_project.项目编号 = 项目编号
    db_project.项目名称 = 项目名称
    db_project.项目类型 = 项目类型
    db_project.是否和学位论文相关 = 是否和学位论文相关
    db_project.项目标题 = 项目标题
    db_project.立项日期 = start_date
    db_project.项目层次 = 项目层次
    db_project.是否结项 = 是否结项
    db_project.验收或鉴定日期 = accept_date
    db_project.项目执行状态 = 项目执行状态
    db_project.本人角色 = 本人角色
    db_project.参与者总数 = 参与者总数
    db_project.参与者名单 = 参与者名单
    db_project.承担任务 = 承担任务
    db_project.项目经费说明 = 项目经费说明
    db_project.备注 = 备注
    db_project.time = time_date

    # 文件上传
    if 上传项目成果文件:
        # 删除旧文件
        old_file_path = db_project.上传项目成果文件
        if old_file_path:
            try:
                old_file_relative = old_file_path.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
        user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_project", "上传项目成果文件")
        os.makedirs(user_dir, exist_ok=True)
        original_filename = 上传项目成果文件.filename
        safe_filename = "".join(c for c in original_filename if c.isalnum() or c in "._-")
        base_name, ext = os.path.splitext(safe_filename)
        counter = 1
        final_filename = safe_filename
        while os.path.exists(os.path.join(user_dir, final_filename)):
            final_filename = f"{base_name}_{counter}{ext}"
            counter += 1
        file_path = os.path.join(user_dir, final_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(上传项目成果文件.file, buffer)
        db_project.上传项目成果文件 = f"/static/{current_user.id}/pre_entry_project/上传项目成果文件/{final_filename}"

    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/me", response_model=list[schemas.PreEntryProject])
def get_my_projects(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryProject).filter(models.PreEntryProject.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryProject)
def get_project(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    project = db.query(models.PreEntryProject).filter(models.PreEntryProject.id == id, models.PreEntryProject.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{id}")
def delete_project(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_project = db.query(models.PreEntryProject).filter(models.PreEntryProject.id == id, models.PreEntryProject.user_id == current_user.id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    # 删除物理文件
    if db_project.上传项目成果文件:
        try:
            old_file_relative = db_project.上传项目成果文件.replace("/static/", "")
            old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
            if os.path.exists(old_file_absolute):
                os.remove(old_file_absolute)
        except Exception:
            pass
    db.delete(db_project)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}")
def download_project_file(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    project = db.query(models.PreEntryProject).filter(models.PreEntryProject.id == id, models.PreEntryProject.user_id == current_user.id).first()
    if not project or not project.上传项目成果文件:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_project", "上传项目成果文件", os.path.basename(project.上传项目成果文件))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
