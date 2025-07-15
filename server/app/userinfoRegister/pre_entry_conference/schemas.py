from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryConferenceBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    会议名称: Optional[str] = None
    会议等级: Optional[str] = None
    会议时间: Optional[datetime] = None
    会议地点: Optional[str] = None
    报告类型: Optional[str] = None
    报告题目: Optional[str] = None
    会议证书文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntryConferenceCreate(PreEntryConferenceBase):
    pass

class PreEntryConferenceUpdate(PreEntryConferenceBase):
    pass

class PreEntryConference(PreEntryConferenceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
