from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Optional, Union
from datetime import datetime
from app.database import get_db
from app.dependencies import get_current_user
from .models import PostdocWorkflow, ProcessStatus , SupervisorStudent
from .schemas import (
    WorkflowResponse, 
    StatusUpdateResponse, 
    WorkflowWithStudentInfo, 
    MultipleWorkflowResponse,
    PendingTaskItem,
    PendingTaskWithStudent,
    StudentPendingTasksResponse,
    StaffPendingTasksResponse
)
from app.models.user import User
from app.assessment.assessmentInfo.models import Student
from app.enterWorkstation.enterapply.models import EnterWorkstation
router = APIRouter(prefix="/workflow", tags=["workflow"])



def check_supervisor_student_relationship(supervisor_id: int, student_id: int, db: Session) -> bool:
    """检查导师和学生的关系"""
    relationship = db.query(SupervisorStudent).filter(
        SupervisorStudent.supervisor_id == supervisor_id,
        SupervisorStudent.student_id == student_id
    ).first()
    return relationship is not None

@router.get("/status", response_model=Union[WorkflowResponse, MultipleWorkflowResponse])
async def get_workflow_status(
    student_id: Optional[int] = Query(None, description="学生ID(仅管理员使用)"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取工作流程状态"""
    # 确定要查询的学生ID
    if current_user.role == "user":
        # 学生用户：使用自己的ID，忽略student_id参数
        target_student_id = current_user.id
        
        workflow = db.query(PostdocWorkflow).filter(
            PostdocWorkflow.student_id == target_student_id
        ).first()
        
        if not workflow:
            # 如果不存在，创建新的工作流程记录
            workflow = PostdocWorkflow(
                student_id=target_student_id
            )
            db.add(workflow)
            db.commit()
            db.refresh(workflow)
        
        return workflow
        
    elif current_user.role == "teacher":
        # 导师：查看指定学生的工作流程
        if student_id is not None:
            # 如果指定了学生ID，检查该学生是否申请过该导师
            # 通过EnterWorkstation表的cotutor字段来检查
            postdoc = db.query(EnterWorkstation).filter(
                EnterWorkstation.user_id == student_id,
                EnterWorkstation.cotutor == current_user.username
            ).first()
            
            if not postdoc:
                raise HTTPException(status_code=403, detail="只能查看申请过自己的学生")
            
            # 查询指定学生的工作流程
            workflow = db.query(PostdocWorkflow).filter(
                PostdocWorkflow.student_id == student_id
            ).first()
            
            if not workflow:
                # 如果不存在，创建新的工作流程记录
                workflow = PostdocWorkflow(student_id=student_id)
                db.add(workflow)
                db.commit()
                db.refresh(workflow)
            
            return workflow
        else:
            # 如果没有指定学生ID，返回所有申请过该导师的学生的工作流程
            # 通过EnterWorkstation表的cotutor字段来查找
            postdocs = db.query(EnterWorkstation).filter(
                EnterWorkstation.cotutor == current_user.username
            ).all()
            student_ids = [postdoc.user_id for postdoc in postdocs]
            
            if not student_ids:
                return {"workflows": []}
            
            # 查询所有学生的工作流程，包含学生信息
            workflows_with_students = (
                db.query(PostdocWorkflow, User)
                .outerjoin(User, PostdocWorkflow.student_id == User.id)
                .filter(PostdocWorkflow.student_id.in_(student_ids))
                .all()
            )
            
            result_workflows = []
            existing_student_ids = []
            
            for workflow, student in workflows_with_students:
                existing_student_ids.append(workflow.student_id)
                workflow_dict = {
                    "id": workflow.id,
                    "student_id": workflow.student_id,
                    "student_name": student.username if student else "未知",
                    "entry_application": workflow.entry_application,
                    "entry_assessment": workflow.entry_assessment,
                    "entry_agreement": workflow.entry_agreement,
                    "midterm_assessment": workflow.midterm_assessment,
                    "annual_assessment": workflow.annual_assessment,
                    "extension_assessment": workflow.extension_assessment,
                    "leave_assessment": workflow.leave_assessment,
                    "created_at": workflow.created_at,
                    "updated_at": workflow.updated_at
                }
                result_workflows.append(workflow_dict)
            
            # 为没有工作流程的学生创建记录
            missing_student_ids = [sid for sid in student_ids if sid not in existing_student_ids]
            for student_id in missing_student_ids:
                student = db.query(User).filter(User.id == student_id).first()
                new_workflow = PostdocWorkflow(student_id=student_id)
                db.add(new_workflow)
                db.commit()
                db.refresh(new_workflow)
                
                workflow_dict = {
                    "id": new_workflow.id,
                    "student_id": new_workflow.student_id,
                    "student_name": student.username if student else "未知",
                    "entry_application": new_workflow.entry_application,
                    "entry_assessment": new_workflow.entry_assessment,
                    "entry_agreement": new_workflow.entry_agreement,
                    "midterm_assessment": new_workflow.midterm_assessment,
                    "annual_assessment": new_workflow.annual_assessment,
                    "extension_assessment": new_workflow.extension_assessment,
                    "leave_assessment": new_workflow.leave_assessment,
                    "created_at": new_workflow.created_at,
                    "updated_at": new_workflow.updated_at
                }
                result_workflows.append(workflow_dict)
            
            return {"workflows": result_workflows}
        
    elif current_user.role == "admin":
        # 管理员：必须提供student_id，可以查看指定学生
        if student_id is None:
            raise HTTPException(status_code=400, detail="管理员必须提供学生ID")
        
        workflow = db.query(PostdocWorkflow).filter(
            PostdocWorkflow.student_id == student_id
        ).first()
        
        if not workflow:
            workflow = PostdocWorkflow(student_id=student_id)
            db.add(workflow)
            db.commit()
            db.refresh(workflow)
        
        return workflow
        
    else:
        raise HTTPException(status_code=403, detail="无效的用户角色")

@router.put("/update/{process_type}", response_model=StatusUpdateResponse)
async def update_workflow_status(
    process_type: str,
    new_status: ProcessStatus,
    student_id: Optional[int] = Query(None, description="学生ID(仅老师和管理员使用)"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新工作流程状态
    
    process_type可选值:
    - entry_application: 进站申请
    - entry_assessment: 进站考核
    - entry_agreement: 进站协议
    - midterm_assessment: 中期考核
    - annual_assessment: 年度考核
    - extension_assessment: 延期考核
    - leave_assessment: 出站考核
    
    权限说明:
    - 学生(user): 只能提交自己的申请，将状态从"未提交"改为"导师未审核"
    - 导师(teacher): 只能审核学生申请，将"导师未审核"改为"导师驳回"或"学院未审核"
    - 管理员(admin): 只能最终审核，将"学院未审核"改为"学院驳回"或"结束"
    """
    # 验证process_type是否合法
    valid_process_types = [
        "entry_application", "entry_assessment", "entry_agreement",
        "midterm_assessment", "annual_assessment", "extension_assessment",
        "leave_assessment"
    ]
    if process_type not in valid_process_types:
        raise HTTPException(status_code=400, detail="无效的流程类型")

    # 根据用户角色确定操作目标和权限
    if current_user.role == "user":
        # 学生用户：只能操作自己的工作流程
        target_student_id = current_user.id
        if student_id is not None and student_id != current_user.id:
            raise HTTPException(status_code=403, detail="学生只能修改自己的工作流程")
        
        # 学生只能提交申请（未提交 -> 导师未审核）
        if new_status not in [ProcessStatus.SUPERVISOR_PENDING]:
            raise HTTPException(status_code=403, detail="学生只能提交申请，不能进行其他状态操作")
            
    elif current_user.role == "teacher":
        # 导师用户：必须指定学生ID，只能操作自己的学生
        if student_id is None:
            raise HTTPException(status_code=400, detail="导师必须指定要审核的学生ID")
        
        # 检查是否是该导师的学生
        if not check_supervisor_student_relationship(current_user.id, student_id, db):
            raise HTTPException(status_code=403, detail="只能审核属于自己的学生")
            
        target_student_id = student_id
        
        # 导师只能进行审核操作（导师未审核 -> 导师驳回/学院未审核）
        if new_status not in [ProcessStatus.SUPERVISOR_REJECTED, ProcessStatus.COLLEGE_PENDING]:
            raise HTTPException(status_code=403, detail="导师只能驳回申请或提交学院审核")
            
    elif current_user.role == "admin":
        # 管理员用户：必须指定学生ID，可以操作所有学生
        if student_id is None:
            raise HTTPException(status_code=400, detail="管理员必须指定要审核的学生ID")
        target_student_id = student_id
        
        # 管理员只能进行最终审核（学院未审核 -> 学院驳回/结束）
        if new_status not in [ProcessStatus.COLLEGE_REJECTED, ProcessStatus.COMPLETED]:
            raise HTTPException(status_code=403, detail="管理员只能驳回申请或完成审核")
            
    else:
        raise HTTPException(status_code=403, detail="无效的用户角色")

    # 获取工作流程
    workflow = db.query(PostdocWorkflow).filter(
        PostdocWorkflow.student_id == target_student_id
    ).first()
    
    if not workflow:
        if current_user.role == "user":
            # 学生首次操作时自动创建工作流程
            workflow = PostdocWorkflow(student_id=target_student_id)
            db.add(workflow)
            db.commit()
            db.refresh(workflow)
        else:
            raise HTTPException(status_code=404, detail="该学生没有工作流程记录")

    # 获取当前状态
    current_status = getattr(workflow, process_type)
    
    # 详细的状态转换验证
    validation_result = validate_status_transition(
        current_status, new_status, current_user.role, process_type
    )
    
    if not validation_result["valid"]:
        raise HTTPException(status_code=400, detail=validation_result["message"])
    
    # 更新状态
    setattr(workflow, process_type, new_status.value)
    workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(workflow)
    
    return {
        "message": "状态更新成功",
        "process_type": process_type,
        "previous_status": current_status,
        "new_status": new_status.value,
        "target_student_id": target_student_id,
        "updated_by": current_user.role,
        "updated_at": workflow.updated_at
    }

@router.get("/my-pending-tasks", response_model=Union[StudentPendingTasksResponse, StaffPendingTasksResponse])
async def get_pending_tasks(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取当前用户待处理的任务和处理中的状态"""
    # 定义要检查的所有流程类型
    process_types = {
        "entry_application": "进站申请",
        "entry_assessment": "进站考核",
        "entry_agreement": "进站协议",
        "midterm_assessment": "中期考核",
        "annual_assessment": "年度考核",
        "extension_assessment": "延期考核",
        "leave_assessment": "出站考核"
    }
    
    if current_user.role == "user":
        # 学生查看自己的所有处理中的流程
        workflow = db.query(PostdocWorkflow).filter(
            PostdocWorkflow.student_id == current_user.id
        ).first()
        
        if not workflow:
            return {
                "role": "student",
                "pending_count": 0,
                "pending_processes": []
            }
            
        pending_processes = []
        for field, description in process_types.items():
            status = getattr(workflow, field)
            if status not in ["未提交", "结束"]:  # 只显示处理中的状态
                pending_processes.append({
                    "process_type": field,
                    "description": description,
                    "current_status": status
                })
                
        return {
            "role": "student",
            "pending_count": len(pending_processes),
            "pending_processes": pending_processes
        }
        
    elif current_user.role == "teacher":
        # 导师查看自己学生的待审核任务
        pending_workflows = []
        
        # 先获取该导师的所有学生
        supervisor_students = db.query(SupervisorStudent).filter(
            SupervisorStudent.supervisor_id == current_user.id
        ).all()
        student_ids = [relation.student_id for relation in supervisor_students]
        
        # 如果没有学生，直接返回空列表
        if not student_ids:
            return {
                "role": "teacher",
                "pending_count": 0,
                "pending_workflows": []
            }
        
        # 查询属于该导师的学生的待审核任务
        for field, description in process_types.items():
            workflows = db.query(PostdocWorkflow).filter(
                getattr(PostdocWorkflow, field) == ProcessStatus.SUPERVISOR_PENDING.value,
                PostdocWorkflow.student_id.in_(student_ids)
            ).all()
            
            for workflow in workflows:
                # 获取学生信息
                
                student = db.query(User).filter(User.id == workflow.student_id).first()
                pending_workflows.append({
                    "student_id": workflow.student_id,
                    "student_name": student.username if student else "未知",
                    "process_type": field,
                    "description": description,
                    "current_status": ProcessStatus.SUPERVISOR_PENDING.value
                })
                
        return {
            "role": "teacher",
            "pending_count": len(pending_workflows),
            "pending_workflows": pending_workflows
        }
                
    elif current_user.role == "admin":
        # 管理员查看所有待审核的任务
        pending_workflows = []
        for field, description in process_types.items():
            workflows = db.query(PostdocWorkflow).filter(
                getattr(PostdocWorkflow, field) == ProcessStatus.COLLEGE_PENDING.value
            ).all()
            for workflow in workflows:
                student = db.query(User).filter(User.id == workflow.student_id).first()
                pending_workflows.append({
                    "student_id": workflow.student_id,
                    "student_name": student.username if student else "未知",
                    "process_type": field,
                    "description": description,
                    "current_status": ProcessStatus.COLLEGE_PENDING.value
                })
                
        return {
            "role": "admin",
            "pending_count": len(pending_workflows),
            "pending_workflows": pending_workflows
        }
                
    else:
        raise HTTPException(status_code=403, detail="无效的用户角色")

# 保持其他函数不变
def validate_status_transition(current_status: str, new_status: ProcessStatus, role: str, process_type: str) -> dict:
    """详细验证状态转换是否合法"""
    try:
        current_enum = ProcessStatus(current_status)
    except ValueError:
        # 如果当前状态无效，默认为未提交
        current_enum = ProcessStatus.NOT_SUBMITTED
    
    # 定义每个角色的具体权限
    role_permissions = {
        "user": {
            "allowed_current_states": [
                ProcessStatus.NOT_SUBMITTED,
                ProcessStatus.SUPERVISOR_REJECTED, 
                ProcessStatus.COLLEGE_REJECTED
            ],
            "allowed_new_states": [ProcessStatus.SUPERVISOR_PENDING],
            "description": "学生只能提交申请"
        },
        "teacher": {
            "allowed_current_states": [ProcessStatus.SUPERVISOR_PENDING],
            "allowed_new_states": [
                ProcessStatus.SUPERVISOR_REJECTED,
                ProcessStatus.COLLEGE_PENDING
            ],
            "description": "导师只能审核待审核的申请"
        },
        "admin": {
            "allowed_current_states": [ProcessStatus.COLLEGE_PENDING],
            "allowed_new_states": [
                ProcessStatus.COLLEGE_REJECTED,
                ProcessStatus.COMPLETED
            ],
            "description": "管理员只能进行最终审核"
        }
    }
    
    if role not in role_permissions:
        return {
            "valid": False,
            "message": f"未知的用户角色: {role}"
        }
    
    permission = role_permissions[role]
    
    # 检查当前状态是否允许该角色操作
    if current_enum not in permission["allowed_current_states"]:
        return {
            "valid": False,
            "message": f"{permission['description']}。当前状态'{current_status}'不允许{role}操作"
        }
    
    # 检查目标状态是否是该角色允许设置的
    if new_status not in permission["allowed_new_states"]:
        return {
            "valid": False,
            "message": f"{permission['description']}。不能设置状态为'{new_status.value}'"
        }
    
    return {
        "valid": True,
        "message": "状态转换合法"
    }

def is_valid_status_transition(current_status: str, new_status: ProcessStatus, role: str) -> bool:
    """验证状态转换是否合法"""
    # 先将字符串状态转换为枚举进行比较
    try:
        current_enum = ProcessStatus(current_status)
    except ValueError:
        return False
    
    # 定义状态转换规则
    transitions = {
        # 学生角色：只能提交申请
        "user": {
            ProcessStatus.NOT_SUBMITTED: [ProcessStatus.SUPERVISOR_PENDING],
            ProcessStatus.SUPERVISOR_REJECTED: [ProcessStatus.SUPERVISOR_PENDING],  # 驳回后可重新提交
            ProcessStatus.COLLEGE_REJECTED: [ProcessStatus.SUPERVISOR_PENDING]      # 驳回后可重新提交
        },
        # 导师角色：审核学生提交的申请
        "teacher": {
            ProcessStatus.SUPERVISOR_PENDING: [
                ProcessStatus.SUPERVISOR_REJECTED,  # 导师驳回
                ProcessStatus.COLLEGE_PENDING       # 导师通过，提交学院审核
            ]
        },
        # 管理员角色：最终审核
        "admin": {
            ProcessStatus.COLLEGE_PENDING: [
                ProcessStatus.COLLEGE_REJECTED,     # 学院驳回
                ProcessStatus.COMPLETED             # 学院通过，完成流程
            ]
        }
    }
    
    # 检查用户角色是否有权限进行状态转换
    if role not in transitions:
        return False
        
    # 检查当前状态是否可以转换到新状态
    allowed_transitions = transitions.get(role, {}).get(current_enum, [])
    return new_status in allowed_transitions


    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
