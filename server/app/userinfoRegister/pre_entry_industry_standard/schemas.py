from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryIndustryStandardBase(BaseModel):
    标准名称: Optional[str] = None
    标准编号: Optional[str] = None
    发布日期: Optional[datetime] = None
    实施日期: Optional[datetime] = None
    归口单位: Optional[str] = None
    起草单位: Optional[str] = None
    适用范围: Optional[str] = None
    上传文件: Optional[str] = None
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