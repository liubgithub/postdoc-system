from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryCompetitionAward(Base):
    __tablename__ = "bs_pre_entry_competition_award"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    获奖名称 = Column(String(255))
    获奖级别 = Column(String(128))
    获奖时间 = Column(DateTime)
    获奖排名 = Column(String(128))
    获奖证书文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
