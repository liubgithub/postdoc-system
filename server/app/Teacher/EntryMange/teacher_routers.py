from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.userinfoRegister.bs_user_profile.models import Info
from app.assessment.assessmentInfo.models import Student
from typing import List
from datetime import datetime

router = APIRouter(prefix="/entryMange/teacher", tags=["合作导师管理"])

@router.get("/students", response_model=List[dict])
def get_teacher_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """导师获取学生信息列表"""
    print(f"当前用户: {current_user.username}, 角色: {current_user.role}")  # 调试信息
    
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 获取所有学生信息，关联用户信息
    students = db.query(Student).join(Info, Student.user_id == Info.user_id).all()
    print(f"找到 {len(students)} 个学生记录")  # 调试信息
    
    result = []
    for student in students:
        # 获取用户详细信息
        user_profile = db.query(Info).filter(Info.user_id == student.user_id).first()
        
        # 构建流程状态
        steps = [
            {"status": "发起", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
            {"status": "审核中", "role": "导师审核", "time": ""},
            {"status": "审核中", "role": "学院审核", "time": ""}
        ]
        
        result.append({
            "id": student.id,
            "studentId": student.stu_num,
            "name": user_profile.name if user_profile else student.stu_name,
            "college": student.college,
            "major": student.subject,
            "applyTime": student.created_at.strftime("%Y-%m-%d") if student.created_at else "",
            "status": "审核中",
            "node": "合作导师",
            "currentApproval": "合作导师审核（待处理）",
            "steps": steps,
            "user_id": student.user_id,
            "subject": student.subject,
            "cotutor": student.cotutor,
            "temp_info": {
                "stu_num": student.stu_num,
                "stu_name": student.stu_name,
                "college": student.college,
                "subject": student.subject,
                "cotutor": student.cotutor
            }
        })
    
    return result

@router.get("/student/{user_id}", response_model=dict)
def get_student_detail(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """导师获取特定学生的详细信息"""
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 根据user_id获取学生信息
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")
    
    # 获取用户详细信息
    user_profile = db.query(Info).filter(Info.user_id == user_id).first()
    
    # 构建流程状态
    steps = [
        {"status": "发起", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
        {"status": "审核中", "role": "导师审核", "time": ""},
        {"status": "审核中", "role": "学院审核", "time": ""}
    ]
    
    return {
        "id": student.id,
        "studentId": student.stu_num,
        "name": user_profile.name if user_profile else student.stu_name,
        "college": student.college,
        "major": student.subject,
        "applyTime": student.created_at.strftime("%Y-%m-%d") if student.created_at else "",
        "status": "审核中",
        "node": "合作导师",
        "currentApproval": "合作导师审核（待处理）",
        "steps": steps,
        "user_id": student.user_id,
        "subject": student.subject,
        "cotutor": student.cotutor,
        "temp_info": {
            "stu_num": student.stu_num,
            "stu_name": student.stu_name,
            "college": student.college,
            "subject": student.subject,
            "cotutor": student.cotutor
        }
    }

@router.put("/student/{user_id}/approve")
def approve_student(
    user_id: int,
    approved: bool,
    comment: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """导师审核学生申请"""
    print(f"审核请求 - 用户: {current_user.username}, 用户ID: {user_id}, 审核结果: {approved}")  # 调试信息
    
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 根据user_id获取学生信息
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")
    
    # 这里可以添加审核状态字段，暂时简单处理
    # 实际项目中应该有专门的审核状态表
    return {
        "message": "审核完成", 
        "approved": approved,
        "user_id": user_id,
        "student_name": student.stu_name
    } 