from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class BsPreEntryAchievement(Base):
    __tablename__ = "bs_pre_entry_achievement"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    category = Column(String(64), index=True)
    count = Column(Integer, default=0)
    remark = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # 8个详细表的反向关系可选