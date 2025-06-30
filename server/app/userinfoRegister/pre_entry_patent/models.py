from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryPatent(Base):
    __tablename__ = "bs_pre_entry_patent"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    专利权人 = Column(String(255))
    专利成果编码 = Column(String(128))
    专利成果名称 = Column(String(255))
    专利类型 = Column(String(128))
    提交时间 = Column(DateTime)
    批准日期 = Column(DateTime)
    授权公告日期 = Column(DateTime)
    申请编号 = Column(String(128))
    专利证书编号 = Column(String(128))
    专利终止日期 = Column(DateTime)
    授权公告号 = Column(String(128))
    作者排名 = Column(String(128))
    专利证书文文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
