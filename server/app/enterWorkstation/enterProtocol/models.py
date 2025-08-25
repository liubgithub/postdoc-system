from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class EnterProtocol(Base):
    __tablename__ = 'enter_procotol_info'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    stuId = Column(String(255), nullable=False)  # 学号
    name = Column(String(255), nullable=False)  # 姓名
    cotutor = Column(String(255), nullable=False)  # 导师
    entryYear = Column(String(255), nullable=False)  # 入站年份
    college = Column(String(255), nullable=False)  # 所在院系
    subject = Column(Text, nullable=False)  # 研究方向
    phone = Column(Text, nullable=False)  # 手机
    email = Column(Text, nullable=False)  # 邮箱
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User')


