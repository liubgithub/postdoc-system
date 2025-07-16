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

def get_unique_filename(filename: str) -> str:
    ext = os.path.splitext(filename)[1]
    return f"{uuid4().hex}{ext}"

@router.post("/upload", response_model=schemas.PreEntryPaper)
async def upload_paper(
    论文名称: str = Form(...),
    刊物名称: str = Form(...),
    本人署名排序: str = Form(...),
    发表日期: str = Form(...),
    起始页号: str = Form(...),
    刊物级别: str = Form(...),
    是否共同第一: str = Form(...),
    通讯作者: str = Form(...),
    论文类型: str = Form(...),
    影响因子: str = Form(...),
    作者名单: str = Form(...),
    第一作者: str = Form(...),
    导师署名排序: str = Form(...),
    本校是否第一: str = Form(...),
    第一署名单位: str = Form(...),
    发表状态: str = Form(...),
    论文收录检索: str = Form(...),
    他引次数: str = Form(...),
    是否和学位论文相关: str = Form(...),
    出版号: str = Form(...),
    出版社: str = Form(...),
    总期号: str = Form(...),
    刊物编号: str = Form(...),
    备注: str = Form(None),
    论文发表证书: UploadFile = File(None),
    论文接收函: UploadFile = File(None),
    论文电子版: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    file_urls = {}
    for field, upload in [("论文发表证书", 论文发表证书), ("论文接收函", 论文接收函), ("论文电子版", 论文电子版)]:
        if upload:
            user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_paper", field)
            os.makedirs(user_dir, exist_ok=True)
            unique_filename = get_unique_filename(upload.filename)
            file_path = os.path.join(user_dir, unique_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(upload.file, buffer)
            file_urls[field] = f"/static/{current_user.id}/pre_entry_paper/{field}/{unique_filename}"
        else:
            file_urls[field] = None
    try:
        pub_date = datetime.strptime(发表日期, "%Y-%m-%d")
    except Exception:
        pub_date = None
    db_paper = models.PreEntryPaper(
        user_id=current_user.id,
        论文名称=论文名称,
        刊物名称=刊物名称,
        本人署名排序=本人署名排序,
        发表日期=pub_date,
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
        论文发表证书=file_urls["论文发表证书"],
        论文接收函=file_urls["论文接收函"],
        论文电子版=file_urls["论文电子版"],
        备注=备注
    )
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper

@router.put("/{id}", response_model=schemas.PreEntryPaper)
async def update_paper(
    id: int,
    论文名称: str = Form(...),
    刊物名称: str = Form(...),
    本人署名排序: str = Form(...),
    发表日期: str = Form(...),
    起始页号: str = Form(...),
    刊物级别: str = Form(...),
    是否共同第一: str = Form(...),
    通讯作者: str = Form(...),
    论文类型: str = Form(...),
    影响因子: str = Form(...),
    作者名单: str = Form(...),
    第一作者: str = Form(...),
    导师署名排序: str = Form(...),
    本校是否第一: str = Form(...),
    第一署名单位: str = Form(...),
    发表状态: str = Form(...),
    论文收录检索: str = Form(...),
    他引次数: str = Form(...),
    是否和学位论文相关: str = Form(...),
    出版号: str = Form(...),
    出版社: str = Form(...),
    总期号: str = Form(...),
    刊物编号: str = Form(...),
    备注: str = Form(None),
    论文发表证书: UploadFile = File(None),
    论文接收函: UploadFile = File(None),
    论文电子版: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_paper = db.query(models.PreEntryPaper).filter(
        models.PreEntryPaper.id == id,
        models.PreEntryPaper.user_id == current_user.id
    ).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    try:
        pub_date = datetime.strptime(发表日期, "%Y-%m-%d")
    except Exception:
        pub_date = None
    db_paper.论文名称 = 论文名称
    db_paper.刊物名称 = 刊物名称
    db_paper.本人署名排序 = 本人署名排序
    db_paper.发表日期 = pub_date
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
    for field, upload in [("论文发表证书", 论文发表证书), ("论文接收函", 论文接收函), ("论文电子版", 论文电子版)]:
        if upload:
            user_dir = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_paper", field)
            os.makedirs(user_dir, exist_ok=True)
            unique_filename = get_unique_filename(upload.filename)
            file_path = os.path.join(user_dir, unique_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(upload.file, buffer)
            setattr(db_paper, field, f"/static/{current_user.id}/pre_entry_paper/{field}/{unique_filename}")
    db.commit()
    db.refresh(db_paper)
    return db_paper

@router.delete("/{id}")
def delete_paper(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id, models.PreEntryPaper.user_id == current_user.id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    # 删除所有文件字段
    for field in ["论文发表证书", "论文接收函", "论文电子版"]:
        file_url = getattr(db_paper, field, None)
        if file_url:
            file_path = os.path.join(UPLOAD_ROOT, str(current_user.id), "pre_entry_paper", field, os.path.basename(file_url))
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
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

@router.get("/me", response_model=List[schemas.PreEntryPaper])
def get_my_papers(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.PreEntryPaper).filter(models.PreEntryPaper.user_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.PreEntryPaper)
def get_paper(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paper = db.query(models.PreEntryPaper).filter(models.PreEntryPaper.id == id, models.PreEntryPaper.user_id == current_user.id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper
