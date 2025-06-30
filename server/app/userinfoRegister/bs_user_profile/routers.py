from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import Info, EducationExperience, WorkExperience
from .schemas import InfoIn

router = APIRouter(prefix="/info", tags=["个人信息登记"])

@router.post("/submit")
def submit_info(data: InfoIn, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # 检查该用户是否已有信息
    exist = db.query(Info).filter(Info.user_id == current_user.id).first()
    if exist:
        # 更新基本信息
        exist.name = data.name
        exist.gender = data.gender
        exist.birth_year = data.birth_year
        exist.nationality = data.nationality
        exist.political_status = data.political_status
        exist.phone = data.phone
        exist.religion = data.religion
        exist.id_number = data.id_number
        exist.is_religious_staff = data.is_religious_staff
        exist.research_direction = data.research_direction
        exist.other = data.other
        # 清空原有教育和工作经历
        db.query(EducationExperience).filter(EducationExperience.user_id == exist.id).delete()
        db.query(WorkExperience).filter(WorkExperience.user_id == exist.id).delete()
        db.flush()
        # 重新添加教育经历
        for edu in data.education_experience:
            db.add(EducationExperience(
                user_id=exist.id,
                start_end=edu.start_end,
                school_major=edu.school_major,
                supervisor=edu.supervisor
            ))
        # 重新添加工作经历
        for work in data.work_experience:
            db.add(WorkExperience(
                user_id=exist.id,
                start_end=work.start_end,
                company_position=work.company_position
            ))
        db.commit()
        return {"msg": "update success"}
    else:
        user_info = Info(
            user_id=current_user.id,  # 关联用户
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
        db.add(user_info)
        db.flush()  # 获取 user_info.id
        for edu in data.education_experience:
            db.add(EducationExperience(
                user_id=user_info.id,
                start_end=edu.start_end,
                school_major=edu.school_major,
                supervisor=edu.supervisor
            ))
        for work in data.work_experience:
            db.add(WorkExperience(
                user_id=user_info.id,
                start_end=work.start_end,
                company_position=work.company_position
            ))
        db.commit()
        return {"msg": "success"} 