from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntrySubjectResearch(Base):
    __tablename__ = "bs_pre_entry_subject_research"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    课题名称 = Column(String(255))
    课题类型 = Column(String(128))
    课题级别 = Column(String(128))
    课题开始时间 = Column(DateTime)
    课题结束时间 = Column(DateTime)
    课题经费 = Column(String(128))
    课题负责人 = Column(String(128))
    课题证书文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
