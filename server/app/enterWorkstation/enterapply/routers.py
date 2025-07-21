from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import EnterWorkstation
from .schemas import EnterWorkstationIn, EnterWorkstationOut
from app.models.user import User

router = APIRouter(prefix="/enterWorkstation", tags=["进站申请"])

@router.post("/apply", response_model=EnterWorkstationOut)
def create_enter_workstation(
    data: EnterWorkstationIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """创建进站申请记录"""
    record = EnterWorkstation(user_id=current_user.id, **data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/apply", response_model=EnterWorkstationOut)
def get_enter_workstation_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取当前用户的进站申请记录"""
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站申请")
    return record

@router.put("/apply", response_model=EnterWorkstationOut)
def update_enter_workstation_by_user_id(
    data: EnterWorkstationIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新当前用户的进站申请记录"""
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站申请")
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/apply")
def delete_enter_workstation_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除当前用户的进站申请记录"""
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站申请")
    db.delete(record)
    db.commit()
    return {"msg": "deleted"}