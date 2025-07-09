from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import EnterWorkstation
from .schemas import EnterWorkstationIn, EnterWorkstationOut
from app.models.user import User

router = APIRouter(prefix="/enterWorkstation", tags=["进站申请"])

@router.post("/apply")
def enter_workstation(
    data: EnterWorkstationIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if record:
        # 覆盖原有数据
        for key, value in data.model_dump().items():
            setattr(record, key, value)
    else:
        # 新建
        record = EnterWorkstation(user_id=current_user.id, **data.model_dump())
        db.add(record)
    db.commit()
    db.refresh(record)
    return {"msg": "success", "id": record.id}

@router.get("/apply", response_model=EnterWorkstationOut)
def get_my_enter_workstation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站申请")
    return record

@router.put("/apply")
def update_my_enter_workstation(
    data: EnterWorkstationIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站申请")
    for key, value in data.model_dump().items():
        setattr(record, key, value)
    db.commit()
    return {"msg": "updated"}