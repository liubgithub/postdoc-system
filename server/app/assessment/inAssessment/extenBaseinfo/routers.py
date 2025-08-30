from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import ExtenBaseInfo
from .schemas import ExtenBaseInfoIn, ExtenBaseInfoOut
from app.models.user import User

router = APIRouter(prefix='/extensionInfo',tags=["延期基本信息"])

@router.post('/', response_model = ExtenBaseInfoOut)
def upsert_extension_baseinfo(
    data: ExtenBaseInfoIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(ExtenBaseInfo).filter_by(user_id = current_user.id).first()
    if record:
        # 更新现有记录
        update_data = data.dict(exclud_unset = True )
        for key, value in update_data.items():
            setattr(record, key, value)
        db.commit()
        db.refresh(record)
        return record
    else:
        record = ExtenBaseInfo(user_id = current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
    
@router.get('/', response_model = ExtenBaseInfoOut)
def get_extension_baseinfo(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(ExtenBaseInfo).filter_by(user_id = current_user.id).first()
    if not record:
        return None
    return record