from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryPaperBase(BaseModel):
    time: Optional[datetime] = None  
    论文名称: str
    刊物名称: str
    本人署名排序: Optional[str] = ""
    发表日期: Optional[datetime] = None
    起始页号: Optional[str] = ""
    刊物级别: Optional[str] = ""
    是否共同第一: Optional[str] = ""
    通讯作者: Optional[str] = ""
    论文类型: Optional[str] = ""
    影响因子: Optional[str] = ""
    作者名单: Optional[str] = ""
    第一作者: Optional[str] = ""
    导师署名排序: Optional[str] = ""
    本校是否第一: Optional[str] = ""
    第一署名单位: Optional[str] = ""
    发表状态: Optional[str] = ""
    论文收录检索: Optional[str] = ""
    他引次数: Optional[str] = ""
    是否和学位论文相关: Optional[str] = ""
    出版号: Optional[str] = ""
    出版社: Optional[str] = ""
    总期号: Optional[str] = ""
    刊物编号: Optional[str] = ""
    论文发表证书: Optional[str] = ""
    论文接收函: Optional[str] = ""
    论文电子版: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntryPaperCreate(PreEntryPaperBase):
    pass

class PreEntryPaperUpdate(PreEntryPaperBase):
    论文名称: Optional[str] = None
    刊物名称: Optional[str] = None

class PreEntryPaper(PreEntryPaperBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda dt: dt.strftime("%Y-%m-%d") if dt else None
        }
