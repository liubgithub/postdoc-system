from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .models import ResStatus
from .schemas import ResStatusIn, ResStatusOut
from app.database import get_db
from app.models.user import User
from app.dependencies import get_current_user
from typing import List, Optional

router = APIRouter(prefix="/researchStatus",tags=["博士后项目研究情况"])

@router.post("/", response_model=ResStatusOut)
def upset_research_status(
    data: ResStatusIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(ResStatus).filter_by(user_id = current_user.id,subType=data.subType).first()
    if record:
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(record,key,value)
        db.commit()
        db.refresh(record)
        return record
    else:
        record = ResStatus(user_id=current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

@router.get("/",response_model=List[ResStatusOut])
def get_research_statuses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    subType: Optional[str] = None
):
    query = db.query(ResStatus).filter_by(user_id = current_user.id)
    if subType:
        query = query.filter_by(subType=subType)
    return query.all()