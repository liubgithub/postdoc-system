from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Optional, Union
from app.database import get_db
from app.dependencies import get_current_user
from .models import EnterWorkstation
from .schemas import EnterWorkstationIn, EnterWorkstationOut
from app.models.user import User
from app.postdocProcess.models import PostdocWorkflow, SupervisorStudent, ProcessStatus
from app.postdocProcess.schemas import StudentPendingTasksResponse, StaffPendingTasksResponse

router = APIRouter(prefix="/enterWorkstation", tags=["进站申请"])

def check_supervisor_student_relationship(supervisor_id: int, student_id: int, db: Session) -> bool:
    """检查导师和学生的关系"""
    relationship = db.query(SupervisorStudent).filter(
        SupervisorStudent.supervisor_id == supervisor_id,
        SupervisorStudent.student_id == student_id
    ).first()
    return relationship is not None

def get_user_process_types(user_id: int, db: Session) -> Dict[str, str]:
    """根据用户ID获取对应的process_types"""
    # 定义所有流程类型
    all_process_types = {
        "entry_application": "进站申请",
        "entry_assessment": "进站考核", 
        "entry_agreement": "进站协议",
        "midterm_assessment": "中期考核",
        "annual_assessment": "年度考核",
        "extension_assessment": "延期考核",
        "leave_assessment": "出站考核"
    }
    
    # 获取用户信息
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {}
    
    # 根据用户角色返回不同的process_types
    if user.role == "user":
        # 学生用户：返回所有流程类型
        return all_process_types
    elif user.role == "teacher":
        # 导师用户：返回所有流程类型（可以审核所有流程）
        return all_process_types
    elif user.role == "admin":
        # 管理员用户：返回所有流程类型
        return all_process_types
    else:
        return {}

@router.get("/process-types/{user_id}")
async def get_process_types_by_user_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """根据用户ID获取对应的process_types"""
    # 权限检查：管理员、导师可以查看学生的process_types，用户只能查看自己的
    if current_user.role == "user" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="学生只能查看自己的process_types")
    
    # 如果是导师，检查是否是该学生的导师
    if current_user.role == "teacher":
        if not check_supervisor_student_relationship(current_user.id, user_id, db):
            raise HTTPException(status_code=403, detail="只能查看自己学生的process_types")
    
    process_types = get_user_process_types(user_id, db)
    return {
        "user_id": user_id,
        "process_types": process_types
    }

@router.get("/my-process-types")
async def get_my_process_types(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取当前用户的process_types"""
    process_types = get_user_process_types(current_user.id, db)
    return {
        "user_id": current_user.id,
        "process_types": process_types
    }

@router.post("/apply", response_model=EnterWorkstationOut)
def upsert_enter_workstation(
    data: EnterWorkstationIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """创建或更新进站申请记录（有则更新，无则创建）"""
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if record:
        # Update existing record
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(record, key, value)
        db.commit()
        db.refresh(record)
        return record
    else:
        # Create new record
        record = EnterWorkstation(user_id=current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

@router.get("/apply", response_model=EnterWorkstationOut | None)
def get_enter_workstation_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取当前用户的进站申请记录（无则返回null）"""
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if not record:
        return None
    return record

@router.delete("/apply")
def delete_enter_workstation_by_user_id(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除当前用户的进站申请记录"""
    record = db.query(EnterWorkstation).filter_by(user_id=current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到进站申请")
    db.delete(record)
    db.commit()
    return {"msg": "deleted"}