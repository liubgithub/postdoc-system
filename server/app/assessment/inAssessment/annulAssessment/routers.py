from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import AnnulAssessment
from .schemas import AnnulAssessmentIn, AnnulAssessmentOut
from app.models.user import User

router = APIRouter(prefix='/annulAssessment', tags=['年度考核'])

@router.post('/',response_model=AnnulAssessmentOut)
def upsert_annul_assessment(
    data:AnnulAssessmentIn,
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):
    record = db.query(AnnulAssessment).filter_by(user_id = current_user.id).first()
    if record:
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(record,key,value)
        db.commit()
        db.refresh(record)
        return record
    else:
        record = AnnulAssessment(user_id = current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
    

@router.get('/', response_model=AnnulAssessmentOut | None)
def get_annul_assessment(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(AnnulAssessment).filter_by(user_id = current_user.id).first()
    if not record:
        return None
    return record

@router.get('/{student_id}', response_model=AnnulAssessmentOut | None)
def get_annul_assessment_by_student_id(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """导师获取指定学生的年度考核记录"""
    # 检查当前用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="需要导师权限")
    
    record = db.query(AnnulAssessment).filter_by(user_id=student_id).first()
    if not record:
        return None
    return record
        
