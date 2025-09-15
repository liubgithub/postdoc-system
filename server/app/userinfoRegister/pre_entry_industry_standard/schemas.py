from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime

class PreEntryIndustryStandardBase(BaseModel):
    time: Optional[datetime] = None
    标准名称: str
    标准编号: Optional[str] = ""
    发布日期: Optional[datetime] = None
    实施日期: Optional[datetime] = None
    归口单位: Optional[str] = ""
    起草单位: Optional[str] = ""
    适用范围: Optional[str] = ""
    上传文件: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntryIndustryStandardCreate(PreEntryIndustryStandardBase):
    pass

class PreEntryIndustryStandardUpdate(PreEntryIndustryStandardBase):
    标准名称: Optional[str] = None

class PreEntryIndustryStandard(PreEntryIndustryStandardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d") if v else None
        }
    )