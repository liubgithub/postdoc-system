from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntrySubjectResearchBase(BaseModel):
    # user_id: int
    # achievement_id: Optional[int] = None
    课题名称: Optional[str] = None
    课题来源: Optional[str] = None
    开始时间: Optional[datetime] = None
    结束时间: Optional[datetime] = None
    课题负责人: Optional[str] = None
    本人承担部分: Optional[str] = None
    课题级别: Optional[str] = None
    上传文件: Optional[str] = None
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
