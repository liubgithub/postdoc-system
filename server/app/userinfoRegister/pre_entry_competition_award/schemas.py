from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryCompetitionAwardBase(BaseModel):
    time: Optional[int] = 0  # 0: 入站前, 1: 在站
    竞赛名称: str
    获奖类别: Optional[str] = ""
    获奖等级: Optional[str] = ""
    获奖时间: Optional[datetime] = None
    本人署名: Optional[str] = ""
    获奖级别: Optional[str] = ""
    颁奖单位: Optional[str] = ""
    第一完成单位: Optional[str] = ""
    完成单位排名: Optional[str] = ""
    是否和学位论文相关: Optional[str] = ""
    奖项名称: Optional[str] = ""
    作者名单: Optional[str] = ""
    上传获奖证书文件: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntryCompetitionAwardCreate(PreEntryCompetitionAwardBase):
    pass

class PreEntryCompetitionAwardUpdate(PreEntryCompetitionAwardBase):
    竞赛名称: Optional[str] = None

class PreEntryCompetitionAward(PreEntryCompetitionAwardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
