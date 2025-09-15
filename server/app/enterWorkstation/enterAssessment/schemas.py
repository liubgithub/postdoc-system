from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime, date


class EnterAssessmentIn(BaseModel):
    project_name: str  # 研究项目名称
    project_source: str  # 项目来源
    project_type: str  # 项目性质
    approval_time: date  # 批准时间
    project_fee: str  # 项目经费
    project_task: str  # 研究项目任务
    project_thought: str  # 申请者对研究项目思路


class EnterAssessmentOut(EnterAssessmentIn):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
