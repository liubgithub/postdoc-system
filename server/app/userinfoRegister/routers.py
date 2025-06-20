from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from .models import Info, EducationExperience, WorkExperience
from .schemas import InfoIn

router = APIRouter(prefix="/info", tags=["个人信息登记"])

@router.post("/submit")
def submit_info(data: InfoIn, db: Session = Depends(get_db)):
    user = Info(
        name=data.name,
        gender=data.gender,
        birth_year=data.birth_year,
        nationality=data.nationality,
        political_status=data.political_status,
        phone=data.phone,
        religion=data.religion,
        id_number=data.id_number,
        is_religious_staff=data.is_religious_staff,
        research_direction=data.research_direction,
        other=data.other,
    )
    db.add(user)
    db.flush()  # 获取 user.id

    for edu in data.education_experience:
        db.add(EducationExperience(
            user_id=user.id,
            start_end=edu.start_end,
            school_major=edu.school_major,
            supervisor=edu.supervisor
        ))
    for work in data.work_experience:
        db.add(WorkExperience(
            user_id=user.id,
            start_end=work.start_end,
            company_position=work.company_position
        ))
    db.commit()
    return {"msg": "success"} 