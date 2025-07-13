from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryProjectBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    项目名称: Optional[str] = None
    项目类型: Optional[str] = None
    项目级别: Optional[str] = None
    项目开始时间: Optional[datetime] = None
    项目结束时间: Optional[datetime] = None
    项目经费: Optional[str] = None
    项目负责人: Optional[str] = None
    项目证书文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntryProjectCreate(PreEntryProjectBase):
    pass

class PreEntryProjectUpdate(PreEntryProjectBase):
    pass

class PreEntryProject(PreEntryProjectBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
