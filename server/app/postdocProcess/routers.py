from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Optional
from datetime import datetime
from app.database import get_db
from app.dependencies import get_current_user
from .models import PostdocWorkflow, ProcessStatus
from .schemas import WorkflowResponse

router = APIRouter(prefix="/workflow", tags=["workflow"])

@router.get("/status", response_model=WorkflowResponse)
async def get_workflow_status(
    student_id: Optional[int] = Query(None, description="学生ID(仅老师和管理员使用)"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取工作流程状态"""
    # 确定要查询的学生ID
    if current_user.role == "user":
        # 学生用户：使用自己的ID，忽略student_id参数
        target_student_id = current_user.id
    elif current_user.role in ["teacher", "admin"]:
        # 老师和管理员：必须提供student_id
        if student_id is None:
            raise HTTPException(status_code=400, detail="老师和管理员必须提供学生ID")
        target_student_id = student_id
    else:
        raise HTTPException(status_code=403, detail="无效的用户角色")
    
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

@router.put("/update/{process_type}")
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
    """
    # 验证process_type是否合法
    valid_process_types = [
        "entry_application", "entry_assessment", "entry_agreement",
        "midterm_assessment", "annual_assessment", "extension_assessment",
        "leave_assessment"
    ]
    if process_type not in valid_process_types:
        raise HTTPException(status_code=400, detail="无效的流程类型")

    # 确定要操作的学生ID
    if current_user.role == "user":
        # 学生用户：使用自己的ID，忽略student_id参数
        target_student_id = current_user.id
    elif current_user.role in ["teacher", "admin"]:
        # 老师和管理员：必须提供student_id
        if student_id is None:
            raise HTTPException(status_code=400, detail="老师和管理员必须提供学生ID")
        target_student_id = student_id
    else:
        raise HTTPException(status_code=403, detail="无效的用户角色")

    # 获取工作流程
    workflow = db.query(PostdocWorkflow).filter(
        PostdocWorkflow.student_id == target_student_id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="该学生没有工作流程记录")

    # 获取当前状态
    current_status = getattr(workflow, process_type)
    
    # 验证状态转换是否合法
    if not is_valid_status_transition(current_status, new_status, current_user.role):
        raise HTTPException(status_code=400, detail="用户角色无权进行此状态转换")
    
    # 更新状态
    setattr(workflow, process_type, new_status.value)  # 使用枚举的值
    workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(workflow)
    
    return {
        "message": "状态更新成功",
        "process_type": process_type,
        "new_status": new_status.value,
        "target_student_id": target_student_id
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
        "user": {
            ProcessStatus.NOT_SUBMITTED: [ProcessStatus.SUPERVISOR_PENDING]
        },
        "teacher": {
            ProcessStatus.SUPERVISOR_PENDING: [
                ProcessStatus.SUPERVISOR_REJECTED,
                ProcessStatus.COLLEGE_PENDING
            ]
        },
        "admin": {
            ProcessStatus.COLLEGE_PENDING: [
                ProcessStatus.COLLEGE_REJECTED,
                ProcessStatus.COMPLETED
            ]
        }
    }
    
    # 检查用户角色是否有权限进行状态转换
    if role not in transitions:
        return False
        
    # 检查当前状态是否可以转换到新状态
    allowed_transitions = transitions.get(role, {}).get(current_enum, [])
    return new_status in allowed_transitions