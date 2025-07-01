from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryPatentBase(BaseModel):
    # user_id: int
    # achievement_id: Optional[int] = None
    专利权人: Optional[str] = None
    专利成果编码: Optional[str] = None
    专利成果名称: Optional[str] = None
    专利类型: Optional[str] = None
    提交时间: Optional[datetime] = None
    批准日期: Optional[datetime] = None
    授权公告日期: Optional[datetime] = None
    申请编号: Optional[str] = None
    专利证书编号: Optional[str] = None
    专利终止日期: Optional[datetime] = None
    授权公告号: Optional[str] = None
    作者排名: Optional[str] = None
    专利证书文文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntryPatentCreate(PreEntryPatentBase):
    pass

class PreEntryPatentUpdate(PreEntryPatentBase):
    pass

class PreEntryPatent(PreEntryPatentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
