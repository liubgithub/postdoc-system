from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from .models import TeacherInfo
from .schemas import TeacherInfoIn, TeacherInfoOut


router = APIRouter(prefix='/teacherinfo',tags=['导师信息'])


@router.post("/", response_model=TeacherInfoOut)
async def create_teacher_info(
    teacher_info: TeacherInfoIn,
    db: Session = Depends(get_db)
):
    """
    管理员创建老师信息
    """
    try:
        # 创建新的老师信息记录
        db_teacher_info = TeacherInfo(
            name=teacher_info.name,
            gender=teacher_info.gender,
            birth_year=teacher_info.birth_year,
            nationality=teacher_info.nationality,
            political_status=teacher_info.political_status,
            phone=teacher_info.phone,
            work_id=teacher_info.work_id,
            unit=teacher_info.unit,
            ID_card=teacher_info.ID_card,
            email=teacher_info.email,
            college=teacher_info.college,
            title_position=teacher_info.title_position,
            res_direction=teacher_info.res_direction
        )
        
        db.add(db_teacher_info)
        db.commit()
        db.refresh(db_teacher_info)
        
        return db_teacher_info
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"创建老师信息失败: {str(e)}")


@router.get("/{teacher_id}", response_model=TeacherInfoOut)
async def get_teacher_info(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    """
    根据老师ID获取老师信息
    """
    teacher_info = db.query(TeacherInfo).filter(TeacherInfo.id == teacher_id).first()
    if not teacher_info:
        raise HTTPException(status_code=404, detail="未找到老师信息")
    return teacher_info


@router.get("/", response_model=list[TeacherInfoOut])
async def get_all_teacher_info(
    db: Session = Depends(get_db),
    skip: int = Query(0, description="跳过记录数"),
    limit: int = Query(100, description="限制返回记录数")
):
    """
    获取所有老师信息列表
    """
    teacher_info_list = db.query(TeacherInfo).offset(skip).limit(limit).all()
    return teacher_info_list


@router.put("/{teacher_id}", response_model=TeacherInfoOut)
async def update_teacher_info(
    teacher_id: int,
    teacher_info: TeacherInfoIn,
    db: Session = Depends(get_db)
):
    """
    更新老师信息
    """
    try:
        # 查找现有的老师信息
        db_teacher_info = db.query(TeacherInfo).filter(TeacherInfo.id == teacher_id).first()
        if not db_teacher_info:
            raise HTTPException(status_code=404, detail="未找到老师信息")
        
        # 更新老师信息
        db_teacher_info.name = teacher_info.name
        db_teacher_info.gender = teacher_info.gender
        db_teacher_info.birth_year = teacher_info.birth_year
        db_teacher_info.nationality = teacher_info.nationality
        db_teacher_info.political_status = teacher_info.political_status
        db_teacher_info.phone = teacher_info.phone
        db_teacher_info.work_id = teacher_info.work_id
        db_teacher_info.unit = teacher_info.unit
        db_teacher_info.ID_card = teacher_info.ID_card
        db_teacher_info.email = teacher_info.email
        db_teacher_info.college = teacher_info.college
        db_teacher_info.title_position = teacher_info.title_position
        db_teacher_info.res_direction = teacher_info.res_direction
        
        db.commit()
        db.refresh(db_teacher_info)
        
        return db_teacher_info
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"更新老师信息失败: {str(e)}")


@router.delete("/{teacher_id}")
async def delete_teacher_info(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    """
    删除老师信息
    """
    try:
        # 查找现有的老师信息
        db_teacher_info = db.query(TeacherInfo).filter(TeacherInfo.id == teacher_id).first()
        if not db_teacher_info:
            raise HTTPException(status_code=404, detail="未找到老师信息")
        
        # 删除老师信息
        db.delete(db_teacher_info)
        db.commit()
        
        return {"message": "老师信息删除成功"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"删除老师信息失败: {str(e)}")

