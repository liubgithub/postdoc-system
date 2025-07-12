from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryCompetitionAwardBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    获奖名称: Optional[str] = None
    获奖级别: Optional[str] = None
    获奖时间: Optional[datetime] = None
    获奖排名: Optional[str] = None
    获奖证书文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntryCompetitionAwardCreate(PreEntryCompetitionAwardBase):
    pass

class PreEntryCompetitionAwardUpdate(PreEntryCompetitionAwardBase):
    pass

class PreEntryCompetitionAward(PreEntryCompetitionAwardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
