from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntrySubjectResearch(Base):
    __tablename__ = "bs_pre_entry_subject_research"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    time = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    课题名称 = Column(String(255))
    课题来源 = Column(String(255))
    开始时间 = Column(DateTime)
    结束时间 = Column(DateTime)
    课题负责人 = Column(String(128))
    本人承担部分 = Column(String(255))
    课题级别 = Column(String(128))
    上传文件 = Column(String(255))  # 文件路径
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
