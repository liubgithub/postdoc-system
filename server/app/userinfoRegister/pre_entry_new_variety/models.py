from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class BsPreEntryNewVariety(Base):
    __tablename__ = "bs_pre_entry_new_variety"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    署名排序 = Column(String(128))
    本校是否第一完成单位 = Column(String(32))
    公示年份 = Column(DateTime)
    第一完成单位 = Column(String(255))
    动植物名称 = Column(String(255))
    品种名称 = Column(String(255))
    选育单位 = Column(String(255))
    公告号 = Column(String(128))
    审定编号 = Column(String(128))
    审定单位 = Column(String(255))
    作者名单 = Column(String(255))
    上传新品种证明文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
