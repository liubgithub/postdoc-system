from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryCompetitionAwardBase(BaseModel):
    # user_id: int
    # achievement_id: Optional[int] = None
    竞赛名称: Optional[str] = None
    获奖类别: Optional[str] = None
    获奖等级: Optional[str] = None
    获奖时间: Optional[datetime] = None
    本人署名: Optional[str] = None
    获奖级别: Optional[str] = None
    颁奖单位: Optional[str] = None
    第一完成单位: Optional[str] = None
    完成单位排名: Optional[str] = None
    是否和学位论文相关: Optional[str] = None
    奖项名称: Optional[str] = None
    作者名单: Optional[str] = None
    上传获奖证书文件: Optional[str] = None
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
