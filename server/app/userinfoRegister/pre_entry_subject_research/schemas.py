from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntrySubjectResearchBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    课题名称: str
    课题来源: Optional[str] = ""
    开始时间: Optional[datetime] = None
    结束时间: Optional[datetime] = None
    课题负责人: Optional[str] = ""
    本人承担部分: Optional[str] = ""
    课题级别: Optional[str] = ""
    上传文件: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntrySubjectResearchCreate(PreEntrySubjectResearchBase):
    pass

class PreEntrySubjectResearchUpdate(PreEntrySubjectResearchBase):
    课题名称: Optional[str] = None

class PreEntrySubjectResearch(PreEntrySubjectResearchBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
