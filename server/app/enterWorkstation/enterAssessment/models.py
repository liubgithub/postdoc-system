from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class EnterAssessment(Base):
    __tablename__ = 'bs_enter_assessment'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    project_name = Column(String(255), nullable=False)  # 研究项目名称
    project_source = Column(String(255), nullable=False)  # 项目来源
    project_type = Column(String(255), nullable=False)  # 项目性质
    approval_time = Column(String(255), nullable=False)  # 批准时间
    project_fee = Column(String(255), nullable=False)  # 项目经费
    project_task = Column(Text, nullable=False)  # 研究项目任务
    project_thought = Column(Text, nullable=False)  # 申请者对研究项目思路
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User')
