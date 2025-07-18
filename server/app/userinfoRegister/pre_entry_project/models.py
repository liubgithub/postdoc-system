from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class PreEntryProject(Base):
    __tablename__ = "bs_pre_entry_project"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    项目编号 = Column(String(255), default="")
    项目名称 = Column(String(255), nullable=False)
    项目类型 = Column(String(255), default="")
    是否和学位论文相关 = Column(String(255), default="")
    项目标题 = Column(String(255), default="")
    立项日期 = Column(DateTime, nullable=True)
    项目层次 = Column(String(255), default="")
    是否结项 = Column(String(255), default="")
    验收或鉴定日期 = Column(DateTime, nullable=True)
    项目执行状态 = Column(String(255), default="")
    本人角色 = Column(String(255), default="")
    参与者总数 = Column(String(255), default="")
    参与者名单 = Column(String(255), default="")
    承担任务 = Column(String(255), default="")
    项目经费说明 = Column(Text, default="")
    上传项目成果文件 = Column(String(255), default="")
    备注 = Column(Text, default="")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    achievement_type = Column(Integer, default=0)
