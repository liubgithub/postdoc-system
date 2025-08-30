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
        
