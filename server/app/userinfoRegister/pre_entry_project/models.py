from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryProject(Base):
    __tablename__ = "bs_pre_entry_project"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    项目名称 = Column(String(255))
    项目类型 = Column(String(128))
    项目级别 = Column(String(128))
    项目开始时间 = Column(DateTime)
    项目结束时间 = Column(DateTime)
    项目经费 = Column(String(128))
    项目负责人 = Column(String(128))
    项目证书文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
