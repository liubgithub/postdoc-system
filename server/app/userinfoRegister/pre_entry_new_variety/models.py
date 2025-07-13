from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryNewVariety(Base):
    __tablename__ = "bs_pre_entry_new_variety"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    新品种名称 = Column(String(255))
    品种类型 = Column(String(128))
    审定时间 = Column(DateTime)
    审定编号 = Column(String(128))
    新品种证书文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
