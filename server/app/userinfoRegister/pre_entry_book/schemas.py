from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class PreEntryBookBase(BaseModel):
    # user_id: int
    # achievement_id: Optional[int] = None
    time: Optional[datetime] = None 
    著作中文名: Optional[str] = None
    出版社: Optional[str] = None
    第几作者: Optional[str] = None
    出版日期: Optional[datetime] = None
    著作编号: Optional[str] = None
    著作类别: Optional[str] = None
    作者名单: Optional[str] = None
    著作字数: Optional[str] = None
    出版号: Optional[str] = None
    isbn: Optional[str] = None
    作者排名: Optional[str] = None
    上传文件: Optional[str] = None
    备注: Optional[str] = None

class PreEntryBookCreate(PreEntryBookBase):
    pass

class PreEntryBookUpdate(PreEntryBookBase):
    pass

class PreEntryBook(PreEntryBookBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d") if v else None
        }
    )
       
