from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.userinfoRegister.bs_user_profile.models import Info
from app.enterWorkstation.enterapply.models import EnterWorkstation
from app.enterWorkstation.enterAssessment.models import EnterAssessment
from app.postdocProcess.models import PostdocWorkflow, ProcessStatus, SupervisorStudent
from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/entryMange/teacher", tags=["合作导师管理学生进站申请和进站考核"])

def get_workflow_status_info(workflow: PostdocWorkflow, postdoc: EnterWorkstation) -> Dict[str, Any]:
    """根据工作流状态获取状态信息"""
    if workflow:
        workflow_status = workflow.entry_application
        if workflow_status == "未提交":
            return {
                "status": "未提交",
                "node": "学生",
                "currentApproval": "学生未提交申请",
                "steps": [
                    {"status": "未开始", "role": "学生申请", "time": ""},
                    {"status": "等待中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "导师未审核":
            return {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "导师驳回":
            return {
                "status": "审核不通过",
                "node": "合作导师",
                "currentApproval": "合作导师审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已拒绝", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "学院未审核":
            return {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                    {"status": "进行中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "学院驳回":
            return {
                "status": "审核不通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已拒绝", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
                ]
            }
        elif workflow_status == "已审核":
            return {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "审核结束（已通过）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已完成", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
                ]
            }
        else:
            return {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
    else:
        # 没有workflow记录，显示默认状态
        return {
            "status": "未提交",
            "node": "学生",
            "currentApproval": "学生未提交申请",
            "steps": [
                {"status": "未开始", "role": "学生申请", "time": ""},
                {"status": "等待中", "role": "导师审核", "time": ""},
                {"status": "等待中", "role": "学院审核", "time": ""}
            ]
        }

def build_student_response(postdoc: EnterWorkstation, user_profile: Info, workflow: PostdocWorkflow, business_type: str = "进站申请", assessment_data: EnterAssessment = None) -> Dict[str, Any]:
    """构建学生响应数据"""
    if business_type == "进站申请":
        status_info = get_workflow_status_info(workflow, postdoc)
        
        return {
            "id": postdoc.id,
            "studentId": postdoc.user_id,  # 从bs_enter_workstation表获取user_id
            "name": user_profile.name if user_profile else "",  # 从bs_user_profile表获取name
            "applyTime": postdoc.created_at.strftime("%Y-%m-%d") if postdoc.created_at else "",  # 从bs_enter_workstation表获取created_at
            "user_id": postdoc.user_id,  # 从bs_enter_workstation表获取user_id
            "cotutor": postdoc.cotutor,  # 从bs_enter_workstation表获取cotutor
            "allitutor": postdoc.allitutor,  # 从bs_enter_workstation表获取allitutor
            "workflow_status": workflow.entry_application if workflow else "未提交",
            "business_type": business_type,
            **status_info  # 展开状态信息
        }
    else:  # 进站考核
        # 获取进站考核状态
        assessment_status = workflow.entry_assessment if workflow else "未提交"
        
        # 构建进站考核的状态信息
        if assessment_status == "未提交":
            status_info = {
                "status": "未提交",
                "node": "学生",
                "currentApproval": "学生未提交进站考核",
                "steps": [
                    {"status": "未开始", "role": "学生申请", "time": ""},
                    {"status": "等待中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "导师未审核":
            status_info = {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "导师驳回":
            status_info = {
                "status": "审核不通过",
                "node": "合作导师",
                "currentApproval": "合作导师审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已拒绝", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "学院未审核":
            status_info = {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "进行中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "学院驳回":
            status_info = {
                "status": "审核不通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已拒绝", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "已审核":
            status_info = {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "审核结束（已通过）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已完成", "role": "学院审核", "time": ""}
                ]
            }
        else:
            status_info = {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        
        # 获取进站考核的提交时间
        assessment_time = ""
        if assessment_data and assessment_data.created_at:
            assessment_time = assessment_data.created_at.strftime("%Y-%m-%d")
        elif postdoc.created_at:
            assessment_time = postdoc.created_at.strftime("%Y-%m-%d")
        
        return {
            "id": postdoc.id,
            "studentId": postdoc.user_id,
            "name": user_profile.name if user_profile else "",
            "applyTime": assessment_time,
            "user_id": postdoc.user_id,
            "cotutor": postdoc.cotutor,
            "allitutor": postdoc.allitutor,
            "workflow_status": assessment_status,
            "business_type": business_type,
            **status_info
        }

@router.get(
    "/students", 
    response_model=List[dict],
    summary="获取学生进站申请和进站考核列表",
    description="导师获取所有申请自己的学生进站申请信息，以及有师生关系的学生进站考核信息，包含学生基本信息、申请状态和流程进度"
)
def get_teacher_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    导师获取学生信息列表
    
    获取所有申请该导师的学生进站申请信息，以及有师生关系的学生进站考核信息，包括：
    - 学生基本信息（姓名、学号等）
    - 业务类型（进站申请/进站考核）
    - 申请状态（未提交、审核中、审核通过、审核不通过）
    - 流程步骤和当前节点
    - 申请时间和审核时间
    """
    print(f"当前用户: {current_user.username}, 角色: {current_user.role}")  # 调试信息
    
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 获取导师的姓名（从users表的username字段获取）
    teacher_name = current_user.username
    
    result = []
    
    # 1. 获取申请该导师的博士后信息（进站申请）
    # 匹配逻辑：博士后填写的cotutor字段与导师的username字段匹配
    postdocs = db.query(EnterWorkstation).join(Info, EnterWorkstation.user_id == Info.user_id).filter(
        EnterWorkstation.cotutor == teacher_name
    ).all()
    print(f"找到 {len(postdocs)} 个申请该导师的博士后记录")  # 调试信息
    
    for postdoc in postdocs:
        student_id = postdoc.user_id
        
        # 获取用户详细信息
        user_profile = db.query(Info).filter(Info.user_id == student_id).first()
        
        # 获取workflow状态
        workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == student_id).first()
        
        # 检查进站申请状态：不是未提交就说明有进站申请数据
        if workflow and workflow.entry_application and workflow.entry_application != "未提交":
            # 构建进站申请响应数据
            result.append(build_student_response(postdoc, user_profile, workflow, "进站申请"))
            print(f"添加进站申请记录: 学生ID {student_id}, 状态: {workflow.entry_application}")
        else:
            print(f"跳过学生 {student_id}: 进站申请状态为未提交或无workflow记录")
    
    # 2. 获取与该导师有师生关系的学生（进站考核）
    # 通过SupervisorStudent表查找师生关系
    supervisor_students = db.query(SupervisorStudent).filter(
        SupervisorStudent.supervisor_id == current_user.id
    ).all()
    print(f"找到 {len(supervisor_students)} 个师生关系记录")  # 调试信息
    
    for supervisor_student in supervisor_students:
        student_id = supervisor_student.student_id
        
        # 获取学生的进站申请信息（用于获取基本信息）
        postdoc = db.query(EnterWorkstation).filter(EnterWorkstation.user_id == student_id).first()
        if not postdoc:
            print(f"跳过学生 {student_id}: 没有进站申请记录")
            continue
        
        # 获取用户详细信息
        user_profile = db.query(Info).filter(Info.user_id == student_id).first()
        
        # 获取workflow状态
        workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == student_id).first()
        
        # 检查进站考核状态：不是未提交就说明有进站考核数据
        if workflow and workflow.entry_assessment and workflow.entry_assessment != "未提交":
            # 获取进站考核数据
            assessment_data = db.query(EnterAssessment).filter(EnterAssessment.user_id == student_id).first()
            # 构建进站考核响应数据
            result.append(build_student_response(postdoc, user_profile, workflow, "进站考核", assessment_data))
            print(f"添加进站考核记录: 学生ID {student_id}, 状态: {workflow.entry_assessment}")
        else:
            print(f"跳过学生 {student_id}: 进站考核状态为未提交或无workflow记录")
    

    
    print(f"总共返回 {len(result)} 条记录")
    return result

@router.get(
    "/student/{user_id}", 
    response_model=dict,
    summary="通过id查看学生进站申请或进站考核的信息",
    description="导师获取指定学生的详细进站申请或进站考核信息，需要根据业务类型参数确定查看内容"
)
def get_student_detail(
    user_id: int,
    business_type: str = "进站申请",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    导师获取特定学生的详细信息
    
    获取指定学生的完整进站申请或进站考核信息，包括：
    - 学生基本信息
    - 申请详细信息
    - 当前审核状态
    - 流程步骤详情
    """
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 根据user_id获取博士后信息
    postdoc = db.query(EnterWorkstation).filter(EnterWorkstation.user_id == user_id).first()
    if not postdoc:
        raise HTTPException(status_code=404, detail="博士后不存在")
    
    # 获取用户详细信息
    user_profile = db.query(Info).filter(Info.user_id == user_id).first()
    
    # 获取workflow状态
    workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == user_id).first()
    
    # 根据业务类型进行不同的验证
    if business_type == "进站申请":
        # 验证博士后是否申请了该导师
        teacher_name = current_user.username
        
        if postdoc.cotutor != teacher_name:
            raise HTTPException(status_code=403, detail="该博士后没有申请您作为导师")
    elif business_type == "进站考核":
        # 验证是否有师生关系
        existing_relationship = db.query(SupervisorStudent).filter(
            SupervisorStudent.supervisor_id == current_user.id,
            SupervisorStudent.student_id == user_id
        ).first()
        
        if not existing_relationship:
            raise HTTPException(status_code=403, detail="该学生与您没有师生关系，无法查看进站考核信息")
    else:
        raise HTTPException(status_code=400, detail="无效的业务类型")
    
    # 根据workflow状态确定显示状态
    return build_student_response(postdoc, user_profile, workflow, business_type)

class ApproveRequest(BaseModel):
    approved: bool
    comment: str = ""
    business_type: str = "进站申请"  # 业务类型：进站申请 或 进站考核

@router.put(
    "/student/{user_id}/approve",
    summary="审核学生进站申请或进站考核",
    description="导师审核学生的进站申请或进站考核，可以选择通过或驳回，并添加审核意见"
)
def approve_student(
    user_id: int,
    request: ApproveRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    导师审核学生申请
    
    审核指定学生的进站申请或进站考核：
    - 通过：申请进入学院审核阶段
    - 驳回：申请被拒绝，学生需要重新提交
    - 可以添加审核意见说明
    """
    print(f"审核请求 - 用户: {current_user.username}, 用户ID: {user_id}, 业务类型: {request.business_type}, 审核结果: {request.approved}")  # 调试信息
    
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 根据user_id获取博士后信息
    postdoc = db.query(EnterWorkstation).filter(EnterWorkstation.user_id == user_id).first()
    if not postdoc:
        raise HTTPException(status_code=404, detail="博士后不存在")
    
    # 获取用户详细信息
    user_profile = db.query(Info).filter(Info.user_id == user_id).first()
    
    # 获取或创建工作流程记录
    workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == user_id).first()
    if not workflow:
        workflow = PostdocWorkflow(student_id=user_id)
        db.add(workflow)
        db.commit()
        db.refresh(workflow)
    
    # 根据业务类型进行不同的验证和处理
    if request.business_type == "进站申请":
        # 验证博士后是否申请了该导师
        teacher_name = current_user.username
        
        if postdoc.cotutor != teacher_name:
            raise HTTPException(status_code=403, detail="该博士后没有申请您作为导师")
        
        # 根据审核结果更新workflow状态
        if request.approved:
            # 导师通过，更新为学院未审核状态
            workflow.entry_application = "学院未审核"
            status_message = "进站申请审核通过，已提交学院审核"
            
            # 创建师生关系记录到SupervisorStudent表
            existing_relationship = db.query(SupervisorStudent).filter(
                SupervisorStudent.supervisor_id == current_user.id,
                SupervisorStudent.student_id == user_id
            ).first()
            
            if not existing_relationship:
                supervisor_student = SupervisorStudent(
                    supervisor_id=current_user.id,
                    student_id=user_id
                )
                db.add(supervisor_student)
                print(f"创建师生关系: 导师ID {current_user.id}, 学生ID {user_id}")
        else:
            # 导师驳回
            workflow.entry_application = "导师驳回"
            status_message = "进站申请审核驳回"
            
            # 如果驳回，删除师生关系记录（如果存在）
            existing_relationship = db.query(SupervisorStudent).filter(
                SupervisorStudent.supervisor_id == current_user.id,
                SupervisorStudent.student_id == user_id
            ).first()
            
            if existing_relationship:
                db.delete(existing_relationship)
                print(f"删除师生关系: 导师ID {current_user.id}, 学生ID {user_id}")
        
        workflow_status = workflow.entry_application
        
    elif request.business_type == "进站考核":
        # 验证是否有师生关系
        existing_relationship = db.query(SupervisorStudent).filter(
            SupervisorStudent.supervisor_id == current_user.id,
            SupervisorStudent.student_id == user_id
        ).first()
        
        if not existing_relationship:
            raise HTTPException(status_code=403, detail="该学生与您没有师生关系，无法审核进站考核")
        
        # 根据审核结果更新workflow状态
        if request.approved:
            # 导师通过，更新为学院未审核状态
            workflow.entry_assessment = "学院未审核"
            status_message = "进站考核审核通过，已提交学院审核"
        else:
            # 导师驳回
            workflow.entry_assessment = "导师驳回"
            status_message = "进站考核审核驳回"
        
        workflow_status = workflow.entry_assessment
        
    else:
        raise HTTPException(status_code=400, detail="无效的业务类型")
    
    workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(workflow)
    
    return {
        "message": status_message,
        "approved": request.approved,
        "business_type": request.business_type,
        "user_id": user_id,
        "student_name": user_profile.name if user_profile else "",
        "workflow_status": workflow_status,
        "updated_at": workflow.updated_at
    } 