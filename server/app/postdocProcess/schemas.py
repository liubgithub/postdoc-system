from pydantic import BaseModel,ConfigDict
from datetime import datetime
from typing import List

# 基础工作流程模型
class WorkflowBase(BaseModel):
    student_id: int
    entry_application: str
    entry_assessment: str
    entry_agreement: str
    midterm_assessment: str
    annual_assessment: str
    extension_assessment: str
    leave_assessment: str

# 创建工作流程请求模型
class WorkflowCreate(WorkflowBase):
    pass

# 工作流程响应模型
class WorkflowResponse(WorkflowBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# 待处理任务项模型
class PendingTaskItem(BaseModel):
    process_type: str
    description: str
    current_status: str

# 待处理任务项(带学生信息)模型
class PendingTaskWithStudent(PendingTaskItem):
    student_id: int
    student_name: str

# 学生待处理任务响应模型
class StudentPendingTasksResponse(BaseModel):
    role: str = "student"
    pending_count: int
    pending_processes: List[PendingTaskItem]

# 教师/管理员待处理任务响应模型
class StaffPendingTasksResponse(BaseModel):
    role: str
    pending_count: int
    pending_workflows: List[PendingTaskWithStudent]

# 状态更新响应模型
class StatusUpdateResponse(BaseModel):
    message: str
    process_type: str
    previous_status: str
    new_status: str
    target_student_id: int
    updated_by: str
    updated_at: datetime

# 增强的工作流程响应，包含学生信息
class WorkflowWithStudentInfo(BaseModel):
    id: int
    student_id: int
    student_name: str
    entry_application: str
    entry_assessment: str
    entry_agreement: str
    midterm_assessment: str
    annual_assessment: str
    extension_assessment: str
    leave_assessment: str
    created_at: datetime
    updated_at: datetime

# 多个工作流程响应模型
class MultipleWorkflowResponse(BaseModel):
    workflows: List[WorkflowWithStudentInfo]