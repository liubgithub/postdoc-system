from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PreEntryProjectBase(BaseModel):
    time: Optional[datetime] = None
    项目编号: Optional[str] = ""
    项目名称: str
    项目类型: Optional[str] = ""
    是否和学位论文相关: Optional[str] = ""
    项目标题: Optional[str] = ""
    立项日期: Optional[datetime] = None
    项目层次: Optional[str] = ""
    是否结项: Optional[str] = ""
    验收或鉴定日期: Optional[datetime] = None
    项目执行状态: Optional[str] = ""
    本人角色: Optional[str] = ""
    参与者总数: Optional[str] = ""
    参与者名单: Optional[str] = ""
    承担任务: Optional[str] = ""
    项目经费说明: Optional[str] = ""
    上传项目成果文件: Optional[str] = ""
    备注: Optional[str] = ""

class PreEntryProjectCreate(PreEntryProjectBase):
    pass

class PreEntryProjectUpdate(PreEntryProjectBase):
    项目名称: Optional[str] = None

class PreEntryProject(PreEntryProjectBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda dt: dt.strftime("%Y-%m-%d") if dt else None
        }
