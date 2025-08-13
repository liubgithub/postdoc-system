import os
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Dict, Optional, Union, List
from datetime import datetime
import shutil
import base64
from pathlib import Path
from .models import uploadSign
from .schemas import AttachmentIn, AttachmentOut
from app.database import get_db
from app.dependencies import get_current_user
from app.postdocProcess.models import SupervisorStudent
from app.models.user import User

router = APIRouter(prefix="/uploadSign", tags=["上传签名"])

# 定义服务器上传目录
SERVER_UPLOAD_DIR = "/home/dyy/upload_sign"

def check_supervisor_student_relationship(supervisor_id: int, student_id: int, db: Session) -> bool:
    """检查导师和学生的关系"""
    relationship = db.query(SupervisorStudent).filter(
        SupervisorStudent.supervisor_id == supervisor_id,
        SupervisorStudent.student_id == student_id
    ).first()
    return relationship is not None

@router.post('/upload_image', response_model=AttachmentOut)
def upload_image(
    sign_type: str = Form(...),
    student_id: int = Form(...),
    image_base64: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 查找该学生对应的老师
    relation = db.query(SupervisorStudent).filter(
        SupervisorStudent.student_id == current_user.id
    ).first()
    if not relation:
        raise HTTPException(status_code=403, detail="未找到该学生的导师关系")
    supervisor_id = relation.supervisor_id

    # 校验关系（可选，已查出老师）
    if student_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限上传该学生签名")

    # 创建完整的服务器路径
    base_dir = Path(SERVER_UPLOAD_DIR) / str(supervisor_id) / sign_type / str(student_id)
    try:
        base_dir.mkdir(parents=True, exist_ok=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建目录失败: {str(e)}")

    file_path = base_dir / "sign.png"

    # 保存图片
    if image_base64.startswith('data:image'):
        header, base64_data = image_base64.split(',', 1)
    else:
        base64_data = image_base64

    # 2. 补全Base64长度（如果需要）
    padding = len(base64_data) % 4
    if padding:
        base64_data += '=' * (4 - padding)

    # 3. 直接写入文件（已经是Base64编码的二进制数据）
    try:
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(base64_data))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"文件写入失败: {str(e)}")

    # 数据库记录
    new_sign = uploadSign(
        user_id=current_user.id,
        sign_type=sign_type,
        sign_name="sign.png",
        sign_road=str(file_path),
    )
    db.add(new_sign)
    db.commit()
    db.refresh(new_sign)

    return AttachmentOut(
        id=new_sign.id,
        user_id=new_sign.user_id,
        filename=new_sign.sign_name,
        filepath=new_sign.sign_road,
        filetype="png",
        created_at=new_sign.created_at,
        updated_at=new_sign.updated_at,
        attachments=[]
    )

@router.get('/get_image')
def get_image(
    sign_type: str = Query(...),
    student_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 查找该学生对应的老师
    relation = db.query(SupervisorStudent).filter(
        SupervisorStudent.student_id == student_id
    ).first()
    if not relation:
        raise HTTPException(status_code=404, detail="未找到该学生的导师关系")
    supervisor_id = relation.supervisor_id

    # 构建完整路径
    file_path = Path(SERVER_UPLOAD_DIR) / str(supervisor_id) / sign_type / str(student_id) / "sign.png"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="图片不存在")
    
    return FileResponse(str(file_path), media_type="image/png")