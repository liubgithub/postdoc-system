from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class PreEntryAchievementDetailBase(BaseModel):
    detail_json: Any

class PreEntryAchievementDetailCreate(PreEntryAchievementDetailBase):
    pass

class PreEntryAchievementDetail(PreEntryAchievementDetailBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PreEntryAchievementBase(BaseModel):
    user_id: int
    category: str
    count: int
    remark: Optional[str] = ""

class PreEntryAchievementCreate(PreEntryAchievementBase):
    details: Optional[List[PreEntryAchievementDetailCreate]] = []

class PreEntryAchievement(PreEntryAchievementBase):
    id: int
    created_at: datetime
    updated_at: datetime
    details: List[PreEntryAchievementDetail] = []

    class Config:
        from_attributes = True