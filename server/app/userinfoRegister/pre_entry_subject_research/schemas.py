from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntrySubjectResearchBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    课题名称: Optional[str] = None
    课题类型: Optional[str] = None
    课题级别: Optional[str] = None
    课题开始时间: Optional[datetime] = None
    课题结束时间: Optional[datetime] = None
    课题经费: Optional[str] = None
    课题负责人: Optional[str] = None
    课题证书文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntrySubjectResearchCreate(PreEntrySubjectResearchBase):
    pass

class PreEntrySubjectResearchUpdate(PreEntrySubjectResearchBase):
    pass

class PreEntrySubjectResearch(PreEntrySubjectResearchBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
