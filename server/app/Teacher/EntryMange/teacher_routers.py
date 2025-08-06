from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.userinfoRegister.bs_user_profile.models import Info
from app.assessment.assessmentInfo.models import Student
from app.postdocProcess.models import PostdocWorkflow, ProcessStatus
from typing import List
from datetime import datetime
from pydantic import BaseModel

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
        
        # 获取workflow状态
        workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == student.user_id).first()
        
        # 根据workflow状态确定显示状态
        if workflow:
            workflow_status = workflow.entry_application
            if workflow_status == ProcessStatus.NOT_SUBMITTED.value:
                status = "未提交"
                node = "学生"
                currentApproval = "学生未提交申请"
                steps = [
                    {"status": "未开始", "role": "学生申请", "time": ""},
                    {"status": "等待中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            elif workflow_status == ProcessStatus.SUPERVISOR_PENDING.value:
                status = "审核中"
                node = "合作导师"
                currentApproval = "合作导师审核（待处理）"
                steps = [
                    {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            elif workflow_status == ProcessStatus.SUPERVISOR_REJECTED.value:
                status = "审核通过"
                node = "合作导师"
                currentApproval = "合作导师审核（已驳回）"
                steps = [
                    {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                    {"status": "已拒绝", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            elif workflow_status == ProcessStatus.COLLEGE_PENDING.value:
                status = "审核通过"
                node = "学院管理员"
                currentApproval = "学院管理员审核（待处理）"
                steps = [
                    {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                    {"status": "进行中", "role": "学院审核", "time": ""}
                ]
            elif workflow_status == ProcessStatus.COLLEGE_REJECTED.value:
                status = "审核通过"
                node = "学院管理员"
                currentApproval = "学院管理员审核（已驳回）"
                steps = [
                    {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已拒绝", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
                ]
            elif workflow_status == ProcessStatus.COMPLETED.value:
                status = "审核通过"
                node = "学院管理员"
                currentApproval = "审核结束（已通过）"
                steps = [
                    {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已完成", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
                ]
            else:
                status = "审核中"
                node = "合作导师"
                currentApproval = "合作导师审核（待处理）"
                steps = [
                    {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
        else:
            # 没有workflow记录，显示默认状态
            status = "未提交"
            node = "学生"
            currentApproval = "学生未提交申请"
            steps = [
                {"status": "未开始", "role": "学生申请", "time": ""},
                {"status": "等待中", "role": "导师审核", "time": ""},
                {"status": "等待中", "role": "学院审核", "time": ""}
            ]
        
        result.append({
            "id": student.id,
            "studentId": student.stu_num,
            "name": user_profile.name if user_profile else student.stu_name,
            "college": student.college,
            "major": student.subject,
            "applyTime": student.created_at.strftime("%Y-%m-%d") if student.created_at else "",
            "status": status,
            "node": node,
            "currentApproval": currentApproval,
            "steps": steps,
            "user_id": student.user_id,
            "subject": student.subject,
            "cotutor": student.cotutor,
            "workflow_status": workflow.entry_application if workflow else "未提交",
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
    
    # 获取workflow状态
    workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == user_id).first()
    
    # 根据workflow状态确定显示状态
    if workflow:
        workflow_status = workflow.entry_application
        if workflow_status == ProcessStatus.NOT_SUBMITTED.value:
            status = "未提交"
            node = "学生"
            currentApproval = "学生未提交申请"
            steps = [
                {"status": "未开始", "role": "学生申请", "time": ""},
                {"status": "等待中", "role": "导师审核", "time": ""},
                {"status": "等待中", "role": "学院审核", "time": ""}
            ]
        elif workflow_status == ProcessStatus.SUPERVISOR_PENDING.value:
            status = "审核中"
            node = "合作导师"
            currentApproval = "合作导师审核（待处理）"
            steps = [
                {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                {"status": "进行中", "role": "导师审核", "time": ""},
                {"status": "等待中", "role": "学院审核", "time": ""}
            ]
        elif workflow_status == ProcessStatus.SUPERVISOR_REJECTED.value:
            status = "审核通过"
            node = "合作导师"
            currentApproval = "合作导师审核（已驳回）"
            steps = [
                {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                {"status": "已拒绝", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                {"status": "等待中", "role": "学院审核", "time": ""}
            ]
        elif workflow_status == ProcessStatus.COLLEGE_PENDING.value:
            status = "审核通过"
            node = "学院"
            currentApproval = "学院审核（待处理）"
            steps = [
                {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                {"status": "已完成", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                {"status": "进行中", "role": "学院审核", "time": ""}
            ]
        elif workflow_status == ProcessStatus.COLLEGE_REJECTED.value:
            status = "审核通过"
            node = "学院"
            currentApproval = "学院审核（已驳回）"
            steps = [
                {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                {"status": "已完成", "role": "导师审核", "time": ""},
                {"status": "已拒绝", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
            ]
        elif workflow_status == ProcessStatus.COMPLETED.value:
            status = "审核通过"
            node = "学院"
            currentApproval = "审核结束（已通过）"
            steps = [
                {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                {"status": "已完成", "role": "导师审核", "time": ""},
                {"status": "已完成", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
            ]
        else:
            status = "审核中"
            node = "合作导师"
            currentApproval = "合作导师审核（待处理）"
            steps = [
                {"status": "已完成", "role": "学生申请", "time": student.created_at.strftime("%Y-%m-%d %H:%M") if student.created_at else ""},
                {"status": "进行中", "role": "导师审核", "time": ""},
                {"status": "等待中", "role": "学院审核", "time": ""}
            ]
    else:
        # 没有workflow记录，显示默认状态
        status = "未提交"
        node = "学生"
        currentApproval = "学生未提交申请"
        steps = [
            {"status": "未开始", "role": "学生申请", "time": ""},
            {"status": "等待中", "role": "导师审核", "time": ""},
            {"status": "等待中", "role": "学院审核", "time": ""}
        ]
    
    return {
        "id": student.id,
        "studentId": student.stu_num,
        "name": user_profile.name if user_profile else student.stu_name,
        "college": student.college,
        "major": student.subject,
        "applyTime": student.created_at.strftime("%Y-%m-%d") if student.created_at else "",
        "status": status,
        "node": node,
        "currentApproval": currentApproval,
        "steps": steps,
        "user_id": student.user_id,
        "subject": student.subject,
        "cotutor": student.cotutor,
        "workflow_status": workflow.entry_application if workflow else "未提交",
        "temp_info": {
            "stu_num": student.stu_num,
            "stu_name": student.stu_name,
            "college": student.college,
            "subject": student.subject,
            "cotutor": student.cotutor
        }
    }

class ApproveRequest(BaseModel):
    approved: bool
    comment: str = ""

@router.put("/student/{user_id}/approve")
def approve_student(
    user_id: int,
    request: ApproveRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """导师审核学生申请"""
    print(f"审核请求 - 用户: {current_user.username}, 用户ID: {user_id}, 审核结果: {request.approved}")  # 调试信息
    
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 根据user_id获取学生信息
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")
    
    # 获取或创建工作流程记录
    workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == user_id).first()
    if not workflow:
        workflow = PostdocWorkflow(student_id=user_id)
        db.add(workflow)
        db.commit()
        db.refresh(workflow)
    
    # 根据审核结果更新workflow状态
    if request.approved:
        # 导师通过，更新为学院未审核状态
        workflow.entry_application = ProcessStatus.COLLEGE_PENDING.value
        status_message = "审核通过，已提交学院审核"
    else:
        # 导师驳回
        workflow.entry_application = ProcessStatus.SUPERVISOR_REJECTED.value
        status_message = "审核驳回"
    
    workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(workflow)
    
    return {
        "message": status_message,
        "approved": request.approved,
        "user_id": user_id,
        "student_name": student.stu_name,
        "workflow_status": workflow.entry_application,
        "updated_at": workflow.updated_at
    } 