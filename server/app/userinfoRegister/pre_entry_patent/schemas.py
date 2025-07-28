from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryPatentBase(BaseModel):
    time: Optional[datetime] = None
    专利权人: Optional[str] = ""
    专利成果编码: Optional[str] = ""
    专利成果名称: str
    专利类型: Optional[str] = ""
    提交时间: Optional[datetime] = None
    批准日期: Optional[datetime] = None
    授权公告日期: Optional[datetime] = None
    申请编号: Optional[str] = ""
    专利证书编号: Optional[str] = ""
    专利终止日期: Optional[datetime] = None
    授权公告号: Optional[str] = ""
    作者排名: Optional[str] = ""
    专利证书文文件: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntryPatentCreate(PreEntryPatentBase):
    pass

class PreEntryPatentUpdate(PreEntryPatentBase):
    专利成果名称: Optional[str] = None

class PreEntryPatent(PreEntryPatentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda dt: dt.strftime("%Y-%m-%d") if dt else None
        }
