from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryConference(Base):
    __tablename__ = "bs_pre_entry_conference"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    会议名称 = Column(String(255))
    会议级别 = Column(String(128))
    会议时间 = Column(DateTime)
    会议地点 = Column(String(255))
    报告类型 = Column(String(128))
    报告题目 = Column(String(255))
    会议证书文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
