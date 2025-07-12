from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryIndustryStandardBase(BaseModel):
    achievement_type: Optional[int] = 0  # 0: 入站前, 1: 在站
    标准名称: Optional[str] = None
    标准类型: Optional[str] = None
    标准级别: Optional[str] = None
    发布时间: Optional[datetime] = None
    标准编号: Optional[str] = None
    标准证书文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntryIndustryStandardCreate(PreEntryIndustryStandardBase):
    pass

class PreEntryIndustryStandardUpdate(PreEntryIndustryStandardBase):
    pass

class PreEntryIndustryStandard(PreEntryIndustryStandardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 