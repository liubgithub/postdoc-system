from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Optional, Union
from app.database import get_db
from app.dependencies import get_current_user
from .models import EnterProtocol
from .schemas import EnterProtocolIn, EnterProtocolOut
from app.models.user import User

router = APIRouter(prefix='/enterProtocol', tags=["进站协议信息"])

@router.post("/",response_model=EnterProtocolOut)
def upset_enter_protocol(
    data: EnterProtocolIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(EnterProtocol).filter_by(user_id=current_user.id).first()
    if record:
        # Update existing record
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(record, key, value)
        db.commit()
        db.refresh(record)
        return record
    else:
        # Create new record
        record = EnterProtocol(user_id=current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
    
@router.get("/",response_model=EnterProtocolOut | None)
def get_enter_workstation_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取当前用户的进站申请记录（无则返回null）"""
    record = db.query(EnterProtocol).filter_by(user_id=current_user.id).first()
    if not record:
        return None
    return record

@router.delete("/apply")
def delete_enter_workstation_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除当前用户的进站申请记录"""
    record = db.query(EnterProtocol).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站申请")
    db.delete(record)
    db.commit()
    return {"msg": "deleted"}