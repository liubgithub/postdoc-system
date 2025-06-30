from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryConferenceBase(BaseModel):
    user_id: int
    achievement_id: Optional[int] = None
    会议编号: Optional[str] = None
    会议名称: Optional[str] = None
    会议英文名: Optional[str] = None
    主办单位: Optional[str] = None
    会议举办形式: Optional[str] = None
    会议等级: Optional[str] = None
    国家或地区: Optional[str] = None
    是否境外: Optional[str] = None
    会议起始日: Optional[datetime] = None
    会议终止日: Optional[datetime] = None
    举办单位: Optional[str] = None
    会议人数: Optional[str] = None
    联系人电话: Optional[str] = None
    会议地点: Optional[str] = None
    会议报告: Optional[str] = None
    会议报告全文: Optional[str] = None
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
