from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime

class ExtensionIn(BaseModel):
    research_progress: str  # 主持或参与科研项目情况
    academic_achievements: str  # 发表学术成果情况
    patents: str  # 授权专利、科技成果转让情况
    consultation_reports: str  # 咨询报告采纳与批示情况
    research_brief: str  # 科研工作简述
    extension_plan: str  # 延期工作内容，预期研究成果

class ExtensionOut(ExtensionIn):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)