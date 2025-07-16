from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryProject(Base):
    __tablename__ = "bs_pre_entry_project"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    项目编号 = Column(String(128))
    项目名称 = Column(String(255))
    项目类型 = Column(String(128))
    是否和学位论文相关 = Column(String(32))  # 可用Boolean或String，视实际情况
    项目标题 = Column(String(255))
    立项日期 = Column(DateTime)
    项目层次 = Column(String(128))
    是否结项 = Column(String(32))  # 可用Boolean或String
    验收或鉴定日期 = Column(DateTime)
    项目执行状态 = Column(String(128))
    本人角色 = Column(String(128))
    参与者总数 = Column(String(32))
    参与者名单 = Column(String(255))
    承担任务 = Column(String(255))
    项目经费说明 = Column(String(255))
    上传项目成果文件 = Column(String(255))  # 文件路径
    备注 = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
