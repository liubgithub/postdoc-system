from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import EnterAssessment
from .schemas import EnterAssessmentIn, EnterAssessmentOut
from app.models.user import User

router = APIRouter(prefix="/enterAssessment", tags=["进站考核"])

@router.post("/assessment", response_model=EnterAssessmentOut)
def upsert_enter_assessment(
    data: EnterAssessmentIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """创建或更新进站评估记录（有则更新，无则创建）"""
    record = db.query(EnterAssessment).filter_by(user_id=current_user.id).first()
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
        record = EnterAssessment(user_id=current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

@router.get("/assessment", response_model=EnterAssessmentOut | None)
def get_enter_assessment_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取当前用户的进站评估记录"""
    record = db.query(EnterAssessment).filter_by(user_id=current_user.id).first()
    if not record:
        return None
    return record

@router.get("/assessment/{student_id}", response_model=EnterAssessmentOut | None)
def get_enter_assessment_by_student_id(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """导师获取指定学生的进站评估记录"""
    # 检查当前用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="需要导师权限")
    
    record = db.query(EnterAssessment).filter_by(user_id=student_id).first()
    if not record:
        return None
    return record

@router.delete("/assessment")
def delete_enter_assessment_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除当前用户的进站评估记录"""
    record = db.query(EnterAssessment).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站评估记录")
    db.delete(record)
    db.commit()
    return {"msg": "deleted"}
