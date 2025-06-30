from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryConference(Base):
    __tablename__ = "bs_pre_entry_conference"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    会议编号 = Column(String(128))
    会议名称 = Column(String(255))
    会议英文名 = Column(String(255))
    主办单位 = Column(String(255))
    会议举办形式 = Column(String(128))
    会议等级 = Column(String(128))
    国家或地区 = Column(String(128))
    是否境外 = Column(String(32))
    会议起始日 = Column(DateTime)
    会议终止日 = Column(DateTime)
    举办单位 = Column(String(255))
    会议人数 = Column(String(32))
    联系人电话 = Column(String(64))
    会议地点 = Column(String(255))
    会议报告 = Column(String(255))
    会议报告全文 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
