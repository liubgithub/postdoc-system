from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryNewVarietyBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    新品种名称: Optional[str] = None
    品种类型: Optional[str] = None
    审定时间: Optional[datetime] = None
    审定编号: Optional[str] = None
    新品种证书文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntryNewVarietyCreate(PreEntryNewVarietyBase):
    pass

class PreEntryNewVarietyUpdate(PreEntryNewVarietyBase):
    pass

class PreEntryNewVariety(PreEntryNewVarietyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
