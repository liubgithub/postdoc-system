import os
import shutil
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
from datetime import datetime
from fastapi.responses import FileResponse
from typing import List

router = APIRouter(
    prefix="/pre_entry_paper",
    tags=["学术论文"]
)

UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploaded_files')))

@router.post("/", response_model=schemas.PreEntryPaper)
async def create_paper(
    # 必填字段（核心信息）
    论文名称: str = Form(...),
    刊物名称: str = Form(...),
    发表日期: str = Form(...),
    
    # 可选字段（详细信息）
    本人署名排序: str = Form(""),
    起始页号: str = Form(""),
    刊物级别: str = Form(""),
    是否共同第一: str = Form(""),
    通讯作者: str = Form(""),
    论文类型: str = Form(""),
    影响因子: str = Form(""),
    作者名单: str = Form(""),
    第一作者: str = Form(""),
    导师署名排序: str = Form(""),
    本校是否第一: str = Form(""),
    第一署名单位: str = Form(""),
    发表状态: str = Form(""),
    论文收录检索: str = Form(""),
    他引次数: str = Form(""),
    是否和学位论文相关: str = Form(""),
    出版号: str = Form(""),
    出版社: str = Form(""),
    总期号: str = Form(""),
    刊物编号: str = Form(""),
    备注: str = Form(""),
    
    # 可选文件
    论文发表证书: UploadFile = File(None),
    论文接收函: UploadFile = File(None),
    论文电子版: UploadFile = File(None),
    
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 解析发表日期
    try:
        pub_date = datetime.strptime(发表日期, "%Y-%m-%d") if 发表日期 else None
    except Exception:
        raise HTTPException(status_code=400, detail="发表日期格式错误，应为 YYYY-MM-DD")
    
    # 创建论文记录
    db_paper = models.PreEntryPaper(
        user_id=current_user.id,
        论文名称=论文名称,
        刊物名称=刊物名称,
        发表日期=pub_date,
        本人署名排序=本人署名排序,
        起始页号=起始页号,
        刊物级别=刊物级别,
        是否共同第一=是否共同第一,
        通讯作者=通讯作者,
        论文类型=论文类型,
        影响因子=影响因子,
        作者名单=作者名单,
        第一作者=第一作者,
        导师署名排序=导师署名排序,
        本校是否第一=本校是否第一,
        第一署名单位=第一署名单位,
        发表状态=发表状态,
        论文收录检索=论文收录检索,
        他引次数=他引次数,
        是否和学位论文相关=是否和学位论文相关,
        出版号=出版号,
        出版社=出版社,
        总期号=总期号,
        刊物编号=刊物编号,
        备注=备注
    )
    
    # 处理文件上传
    file_fields = [
        ("论文发表证书", 论文发表证书),
        ("论文接收函", 论文接收函), 
        ("论文电子版", 论文电子版)
    ]
    
    for field_name, upload_file in file_fields:
        if upload_file:
            user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_paper", field_name)
            os.makedirs(user_dir, exist_ok=True)
            
            # 直接使用原始文件名，但确保文件名安全
            original_filename = upload_file.filename
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
                shutil.copyfileobj(upload_file.file, buffer)
            
            setattr(db_paper, field_name, f"/static/{current_user.id}/pre_entry_paper/{field_name}/{final_filename}")
    
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper

@router.put("/{id}", response_model=schemas.PreEntryPaper)
async def update_paper(
    id: int,
    # 必填字段
    论文名称: str = Form(...),
    刊物名称: str = Form(...),
    发表日期: str = Form(...),
    
    # 可选字段
    本人署名排序: str = Form(""),
    起始页号: str = Form(""),
    刊物级别: str = Form(""),
    是否共同第一: str = Form(""),
    通讯作者: str = Form(""),
    论文类型: str = Form(""),
    影响因子: str = Form(""),
    作者名单: str = Form(""),
    第一作者: str = Form(""),
    导师署名排序: str = Form(""),
    本校是否第一: str = Form(""),
    第一署名单位: str = Form(""),
    发表状态: str = Form(""),
    论文收录检索: str = Form(""),
    他引次数: str = Form(""),
    是否和学位论文相关: str = Form(""),
    出版号: str = Form(""),
    出版社: str = Form(""),
    总期号: str = Form(""),
    刊物编号: str = Form(""),
    备注: str = Form(""),
    
    # 可选文件
    论文发表证书: UploadFile = File(None),
    论文接收函: UploadFile = File(None),
    论文电子版: UploadFile = File(None),
    
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 查询要更新的论文记录
    db_paper = db.query(models.PreEntryPaper).filter(
        models.PreEntryPaper.id == id,
        models.PreEntryPaper.user_id == current_user.id
    ).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # 解析发表日期
    try:
        pub_date = datetime.strptime(发表日期, "%Y-%m-%d") if 发表日期 else None
    except Exception:
        raise HTTPException(status_code=400, detail="发表日期格式错误，应为 YYYY-MM-DD")
    
    # 更新字段（只更新提供的字段）
    db_paper.论文名称 = 论文名称
    db_paper.刊物名称 = 刊物名称
    db_paper.发表日期 = pub_date
    db_paper.本人署名排序 = 本人署名排序
    db_paper.起始页号 = 起始页号
    db_paper.刊物级别 = 刊物级别
    db_paper.是否共同第一 = 是否共同第一
    db_paper.通讯作者 = 通讯作者
    db_paper.论文类型 = 论文类型
    db_paper.影响因子 = 影响因子
    db_paper.作者名单 = 作者名单
    db_paper.第一作者 = 第一作者
    db_paper.导师署名排序 = 导师署名排序
    db_paper.本校是否第一 = 本校是否第一
    db_paper.第一署名单位 = 第一署名单位
    db_paper.发表状态 = 发表状态
    db_paper.论文收录检索 = 论文收录检索
    db_paper.他引次数 = 他引次数
    db_paper.是否和学位论文相关 = 是否和学位论文相关
    db_paper.出版号 = 出版号
    db_paper.出版社 = 出版社
    db_paper.总期号 = 总期号
    db_paper.刊物编号 = 刊物编号
    db_paper.备注 = 备注
    
    # 处理文件字段：只处理有新文件上传的字段
    file_fields = [
        ("论文发表证书", 论文发表证书),
        ("论文接收函", 论文接收函), 
        ("论文电子版", 论文电子版)
    ]
    
    for field_name, upload_file in file_fields:
        if upload_file:  # 只有当有新文件时才处理
            # 删除旧文件
            old_file_path = getattr(db_paper, field_name)
            if old_file_path:
                try:
                    old_file_relative = old_file_path.replace("/static/", "")
                    old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                    if os.path.exists(old_file_absolute):
                        os.remove(old_file_absolute)
                except Exception:
                    pass
            
            # 保存新文件
            user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_paper", field_name)
            os.makedirs(user_dir, exist_ok=True)
            
            # 直接使用原始文件名，但确保文件名安全
            original_filename = upload_file.filename
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
                shutil.copyfileobj(upload_file.file, buffer)
            
            setattr(db_paper, field_name, f"/static/{current_user.id}/pre_entry_paper/{field_name}/{final_filename}")
    
    db.commit()
    db.refresh(db_paper)
    return db_paper

@router.get("/me", response_model=List[schemas.PreEntryPaper])
def get_my_papers(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryPaper).filter(models.PreEntryPaper.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryPaper)
def get_paper(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id, models.PreEntryPaper.user_id == current_user.id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@router.delete("/{id}")
def delete_paper(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id, models.PreEntryPaper.user_id == current_user.id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    # 删除所有文件字段
    for field in ["论文发表证书", "论文接收函", "论文电子版"]:
        file_url = getattr(db_paper, field, None)
        if file_url:
            try:
                old_file_relative = file_url.replace("/static/", "")
                old_file_absolute = os.path.join(UPLOAD_ROOT, old_file_relative)
                if os.path.exists(old_file_absolute):
                    os.remove(old_file_absolute)
            except Exception:
                pass
    db.delete(db_paper)
    db.commit()
    return {"ok": True}

@router.get("/download/{id}/{field}")
def download_paper_file(id: int, field: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id, models.PreEntryPaper.user_id == current_user.id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    file_url = getattr(db_paper, field, None)
    if not file_url:
        raise HTTPException(status_code=404, detail="File not found")
    file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_paper", field, os.path.basename(file_url))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=os.path.basename(file_path))
