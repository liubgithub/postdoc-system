from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryPaperBase(BaseModel):
    # user_id: int
    # achievement_id: Optional[int] = None
    论文名称: Optional[str] = None
    刊物名称: Optional[str] = None
    本人署名排序: Optional[str] = None
    发表日期: Optional[datetime] = None
    起始页号: Optional[str] = None
    刊物级别: Optional[str] = None
    是否共同第一: Optional[str] = None
    通讯作者: Optional[str] = None
    论文类型: Optional[str] = None
    影响因子: Optional[str] = None
    作者名单: Optional[str] = None
    第一作者: Optional[str] = None
    导师署名排序: Optional[str] = None
    本校是否第一: Optional[str] = None
    第一署名单位: Optional[str] = None
    发表状态: Optional[str] = None
    论文收录检索: Optional[str] = None
    他引次数: Optional[str] = None
    是否和学位论文相关: Optional[str] = None
    出版号: Optional[str] = None
    出版社: Optional[str] = None
    总期号: Optional[str] = None
    刊物编号: Optional[str] = None
    论文发表证书: Optional[str] = None
    论文接收函: Optional[str] = None
    论文电子版: Optional[str] = None
    备注: Optional[str] = None

class PreEntryPaperCreate(PreEntryPaperBase):
    pass

class PreEntryPaperUpdate(PreEntryPaperBase):
    pass

class PreEntryPaper(PreEntryPaperBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
