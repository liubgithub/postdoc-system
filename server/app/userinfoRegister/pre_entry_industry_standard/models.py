from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryIndustryStandard(Base):
    __tablename__ = "bs_pre_entry_industry_standard"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    标准名称 = Column(String(255))
    标准类型 = Column(String(128))
    标准级别 = Column(String(128))
    发布时间 = Column(DateTime)
    标准编号 = Column(String(128))
    标准证书文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 