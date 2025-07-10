from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import Student
from .schemas import StudentIn, StudentOut
from app.models.user import User

router = APIRouter(prefix="/assessment/student", tags=["学生信息"])

@router.post("/", response_model=StudentOut)
def create_student(
    data: StudentIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = Student(user_id=current_user.id, **data.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.get("/", response_model=StudentOut)
def get_student_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = db.query(Student).filter_by(user_id=current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="未找到学生信息")
    return student

@router.put("/", response_model=StudentOut)
def update_student_by_user_id(
    data: StudentIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = db.query(Student).filter_by(user_id=current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="未找到学生信息")
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student

@router.delete("/")
def delete_student_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = db.query(Student).filter_by(user_id=current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="未找到学生信息")
    db.delete(student)
    db.commit()
    return {"msg": "deleted"}
