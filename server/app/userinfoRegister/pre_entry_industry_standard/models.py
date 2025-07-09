from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryIndustryStandard(Base):
    __tablename__ = "bs_pre_entry_industry_standard"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    标准名称 = Column(String(255))
    标准编号 = Column(String(255))
    发布日期 = Column(DateTime)
    实施日期 = Column(DateTime)
    归口单位 = Column(String(255))
    起草单位 = Column(String(255))
    适用范围 = Column(String(255))
    上传文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 