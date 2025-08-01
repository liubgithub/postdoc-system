from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import PostdoctoralExtension
from .schemas import ExtensionIn, ExtensionOut
from app.models.user import User

router = APIRouter(prefix="/extension", tags=["延期申请"])

@router.post("/", response_model=ExtensionOut)
def upsert_extension(
    data: ExtensionIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """创建或更新延期申请记录（有则更新，无则创建）"""
    record = db.query(PostdoctoralExtension).filter_by(user_id=current_user.id).first()
    if record:
        # 更新现有记录
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(record, key, value)
        db.commit()
        db.refresh(record)
        return record
    else:
        # 创建新记录
        record = PostdoctoralExtension(user_id=current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

@router.get("/", response_model=ExtensionOut | None)
def get_extension_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取当前用户的延期申请记录（无则返回null）"""
    record = db.query(PostdoctoralExtension).filter_by(user_id=current_user.id).first()
    return record

@router.delete("/")
def delete_extension_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除当前用户的延期申请记录"""
    record = db.query(PostdoctoralExtension).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到延期申请记录")
    db.delete(record)
    db.commit()
    return {"msg": "deleted"}