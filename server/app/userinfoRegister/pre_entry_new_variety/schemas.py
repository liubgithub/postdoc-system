from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryNewVarietyBase(BaseModel):
    # user_id: int
    # achievement_id: Optional[int] = None
    署名排序: Optional[str] = None
    本校是否第一完成单位: Optional[str] = None
    公示年份: Optional[datetime] = None
    第一完成单位: Optional[str] = None
    动植物名称: Optional[str] = None
    品种名称: Optional[str] = None
    选育单位: Optional[str] = None
    公告号: Optional[str] = None
    审定编号: Optional[str] = None
    审定单位: Optional[str] = None
    作者名单: Optional[str] = None
    上传新品种证明文件: Optional[str] = None
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
