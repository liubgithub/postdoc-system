from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryNewVarietyBase(BaseModel):
    time: Optional[int] = 0  # 0: 入站前, 1: 在站
    署名排序: Optional[str] = ""
    本校是否第一完成单位: Optional[str] = ""
    公示年份: Optional[datetime] = None
    第一完成单位: Optional[str] = ""
    动植物名称: Optional[str] = ""
    品种名称: str
    选育单位: Optional[str] = ""
    公告号: Optional[str] = ""
    审定编号: Optional[str] = ""
    审定单位: Optional[str] = ""
    作者名单: Optional[str] = ""
    上传新品种证明文件: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntryNewVarietyCreate(PreEntryNewVarietyBase):
    pass

class PreEntryNewVarietyUpdate(PreEntryNewVarietyBase):
    品种名称: Optional[str] = None

class PreEntryNewVariety(PreEntryNewVarietyBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
