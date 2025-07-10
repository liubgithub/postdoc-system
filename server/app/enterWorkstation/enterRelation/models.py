# server/app/enterWorkstation/enterRelation/models.py
from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime

class EnterRelation(Base):
    __tablename__ = 'related_scien_res'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    base_work = Column(Text, comment='前期工作基础')
    necessity_analysis = Column(Text, comment='选题的必要性分析')
    resplan_expected = Column(Text, comment='研究规划及预期成果')
    results = Column(Text, comment='成果情况')
    other_achievements = Column(Text, comment='其他代表性成果')
    academic_pursuits = Column(Text, comment='学术理想与追求')
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship('User')