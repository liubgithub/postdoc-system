from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class BsPreEntryBook(Base):
    __tablename__ = "bs_pre_entry_book"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    著作中文名 = Column(String(255))
    出版社 = Column(String(255))
    第几作者 = Column(String(32))
    出版日期 = Column(DateTime)
    著作编号 = Column(String(128))
    著作类别 = Column(String(128))
    作者名单 = Column(String(255))
    著作字数 = Column(String(64))
    出版号 = Column(String(128))
    ISBN = Column(String(128))
    作者排名 = Column(String(128))
    上传文件 = Column(String(255))
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
