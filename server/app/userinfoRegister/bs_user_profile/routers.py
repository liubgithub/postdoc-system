from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import Info, EducationExperience, WorkExperience
from .schemas import InfoIn, InfoOut, EducationExperienceOut, WorkExperienceOut
from typing import List

router = APIRouter(prefix="/info", tags=["个人信息登记"])

# 新增或更新（upsert）
@router.post("/submit", response_model=InfoOut)
def submit_info(data: InfoIn, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    exist = db.query(Info).filter(Info.user_id == current_user.id).first()
    if exist:
        # 更新
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
        exist.otherachievements = data.otherachievements
        db.query(EducationExperience).filter(EducationExperience.user_id == exist.id).delete()
        db.query(WorkExperience).filter(WorkExperience.user_id == exist.id).delete()
        db.flush() 
        for edu in data.education_experience:
            db.add(EducationExperience(
                user_id=exist.id,
                start_end=edu.start_end,
                school_major=edu.school_major,
                supervisor=edu.supervisor
            ))
        for work in data.work_experience:
            db.add(WorkExperience(
                user_id=exist.id,
                start_end=work.start_end,
                company_position=work.company_position
            ))
        db.commit()
        db.refresh(exist)
        return get_info(db=db, current_user=current_user)
    else:
        # 新增
        user_info = Info(
            user_id=current_user.id,
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
            otherachievements=data.otherachievements
        )
        db.add(user_info)
        db.flush()
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
        db.refresh(user_info)
        return get_info(db=db, current_user=current_user)

# 查询当前用户信息
@router.get("/me", response_model=InfoOut)
def get_info(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    info = db.query(Info).filter(Info.user_id == current_user.id).first()
    if not info:
        raise HTTPException(status_code=404, detail="No info found for user")
    education = db.query(EducationExperience).filter(EducationExperience.user_id == info.id).all()
    work = db.query(WorkExperience).filter(WorkExperience.user_id == info.id).all()
    return InfoOut(
        id=info.id,
        user_id=info.user_id,
        name=info.name,
        gender=info.gender,
        birth_year=info.birth_year,
        nationality=info.nationality,
        political_status=info.political_status,
        phone=info.phone,
        religion=info.religion,
        id_number=info.id_number,
        is_religious_staff=info.is_religious_staff,
        research_direction=info.research_direction,
        other=info.other,
        otherachievements=info.otherachievements,
        education_experience=[EducationExperienceOut.from_orm(e) for e in education],
        work_experience=[WorkExperienceOut.from_orm(w) for w in work]
    )

# 修改当前用户信息
@router.put("/me", response_model=InfoOut)
def update_info(data: InfoIn, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    info = db.query(Info).filter(Info.user_id == current_user.id).first()
    if not info:
        raise HTTPException(status_code=404, detail="No info found for user")
    info.name = data.name
    info.gender = data.gender
    info.birth_year = data.birth_year
    info.nationality = data.nationality
    info.political_status = data.political_status
    info.phone = data.phone
    info.religion = data.religion
    info.id_number = data.id_number
    info.is_religious_staff = data.is_religious_staff
    info.research_direction = data.research_direction
    info.other = data.other
    info.otherachievements = data.otherachievements
    db.query(EducationExperience).filter(EducationExperience.user_id == info.id).delete()
    db.query(WorkExperience).filter(WorkExperience.user_id == info.id).delete()
    db.flush()
    for edu in data.education_experience:
        db.add(EducationExperience(
            user_id=info.id,
            start_end=edu.start_end,
            school_major=edu.school_major,
            supervisor=edu.supervisor
        ))
    for work in data.work_experience:
        db.add(WorkExperience(
            user_id=info.id,
            start_end=work.start_end,
            company_position=work.company_position
        ))
    db.commit()
    db.refresh(info)
    return get_info(db=db, current_user=current_user)

# 删除当前用户信息
@router.delete("/me")
def delete_info(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    info = db.query(Info).filter(Info.user_id == current_user.id).first()
    if not info:
        raise HTTPException(status_code=404, detail="No info found for user")
    db.query(EducationExperience).filter(EducationExperience.user_id == info.id).delete()
    db.query(WorkExperience).filter(WorkExperience.user_id == info.id).delete()
    db.delete(info)
    db.commit()
    return {"msg": "deleted"} 