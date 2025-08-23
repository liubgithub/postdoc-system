import os
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Dict, Optional, Union, List
from datetime import datetime
import shutil
import base64
import base64
from pathlib import Path
from .models import uploadSign
from .schemas import AttachmentIn, AttachmentOut
import base64
from .models import uploadSign
from .schemas import AttachmentIn, AttachmentOut
from app.database import get_db
from app.dependencies import get_current_user
from app.postdocProcess.models import SupervisorStudent
from app.models.user import User

router = APIRouter(prefix="/uploadSign", tags=["上传签名"])

# 定义服务器上传目录
UPLOAD_ROOT = os.getenv("UPLOAD_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../upload_sign')))

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
    student_id = current_user.id

    # 创建完整的服务器路径
    base_dir = os.path.join(UPLOAD_ROOT,str(supervisor_id) , sign_type , str(student_id))
    try:
        os.makedirs(base_dir, exist_ok=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建目录失败: {str(e)}")

    file_path = os.path.join(base_dir, "sign.png")

    # 保存图片
    if image_base64.startswith('data:image'):
        header, base64_data = image_base64.split(',', 1)
    else:
        base64_data = image_base64

    # 补全Base64长度（如果需要）
    padding = len(base64_data) % 4
    if padding:
        base64_data += '=' * (4 - padding)

    try:
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(base64_data))
    except Exception as e:
        print(f"文件写入失败: {file_path}, 错误: {e}")
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

@router.get('/get_image_base64')
def get_image_base64(
    sign_type: str = Query(...),
    student_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query_student_id = student_id if student_id is not None else current_user.id

    relation = db.query(SupervisorStudent).filter(
        SupervisorStudent.student_id == query_student_id
    ).first()
    if not relation:
        raise HTTPException(status_code=404, detail="未找到该学生的导师关系")
    supervisor_id = relation.supervisor_id

    # 这里用 query_student_id
    file_path = os.path.join(UPLOAD_ROOT, str(supervisor_id), sign_type, str(query_student_id), "sign.png")
    print(file_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="图片不存在")

    with open(file_path, "rb") as f:
        img_bytes = f.read()
        base64_str = base64.b64encode(img_bytes).decode('utf-8')
        data_url = f"data:image/png;base64,{base64_str}"
        return JSONResponse(content={"image_base64": data_url})