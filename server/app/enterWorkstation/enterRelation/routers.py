# server/app/enterWorkstation/enterRelation/routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from . import models, schemas
from app.models.user import User

router = APIRouter(
    prefix="/enterRelation",
    tags=["进站相关科研情况"]
)

@router.post("/", response_model=schemas.EnterRelation)
def create_relation(
    relation: schemas.EnterRelationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_relation = models.EnterRelation(user_id=current_user.id, **relation.dict())
    db.add(db_relation)
    db.commit()
    db.refresh(db_relation)
    return db_relation

@router.get("/", response_model=schemas.EnterRelation)
def get_relation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_relation = db.query(models.EnterRelation).filter_by(user_id=current_user.id).first()
    if not db_relation:
        raise HTTPException(status_code=404, detail="未找到相关科研情况")
    return db_relation

@router.put("/", response_model=schemas.EnterRelation)
def update_relation(
    relation: schemas.EnterRelationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_relation = db.query(models.EnterRelation).filter_by(user_id=current_user.id).first()
    if not db_relation:
        raise HTTPException(status_code=404, detail="未找到相关科研情况")
    for key, value in relation.dict(exclude_unset=True).items():
        setattr(db_relation, key, value)
    db.commit()
    db.refresh(db_relation)
    return db_relation

@router.delete("/")
def delete_relation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_relation = db.query(models.EnterRelation).filter_by(user_id=current_user.id).first()
    if not db_relation:
        raise HTTPException(status_code=404, detail="未找到相关科研情况")
    db.delete(db_relation)
    db.commit()
    return {"msg": "deleted"}