# server/app/enterWorkstation/enterRelation/routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import EnterRelation
from .schemas import EnterRelationBase, EnterRelationInDBBase
from app.models.user import User

router = APIRouter(
    prefix="/enterRelation",
    tags=["进站相关科研情况"]
)

@router.post("/", response_model=EnterRelationInDBBase)
def upsert_enter_relation(
    data: EnterRelationBase,
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(EnterRelation).filter_by(user_id=current_user.id).first()
    if record:
        update_data = data.dict(exclude_unset=True)
        for key,value in update_data.items():
            setattr(record,key,value)
        db.commit()
        db.refresh(record)
        return record
    else:
        record = EnterRelation(user_id = current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record


@router.get("/", response_model=EnterRelationInDBBase)
def get_relation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_relation = db.query(EnterRelation).filter_by(user_id=current_user.id).first()
    if not db_relation:
        return None
    return db_relation


@router.delete("/")
def delete_relation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_relation = db.query(EnterRelation).filter_by(user_id=current_user.id).first()
    if not db_relation:
        raise HTTPException(status_code=404, detail="未找到相关科研情况")
    db.delete(db_relation)
    db.commit()
    return {"msg": "deleted"}