from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryConferenceBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    会议编号: Optional[str] = ""
    会议名称: str
    会议英文名: Optional[str] = ""
    主办单位: Optional[str] = ""
    会议举办形式: Optional[str] = ""
    会议等级: Optional[str] = ""
    国家或地区: Optional[str] = ""
    是否境外: Optional[str] = ""
    会议起始日: Optional[datetime] = None
    会议终止日: Optional[datetime] = None
    举办单位: Optional[str] = ""
    会议人数: Optional[str] = ""
    联系人电话: Optional[str] = ""
    会议地点: Optional[str] = ""
    会议报告: Optional[str] = ""
    会议报告全文: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntryConferenceCreate(PreEntryConferenceBase):
    pass

class PreEntryConferenceUpdate(PreEntryConferenceBase):
    会议名称: Optional[str] = None

class PreEntryConference(PreEntryConferenceBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
