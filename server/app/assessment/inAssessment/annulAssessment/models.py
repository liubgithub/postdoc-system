from app.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, SmallInteger,Date,JSON
from sqlalchemy.orm import relationship
from datetime import datetime

class AnnulAssessment(Base):
    __tablename__ = 'annul_assessment'
    id = Column(Integer, primary_key=True,index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    unit = Column(String(255), nullable=False)
    station = Column(String(255), nullable=False)
    fillDate = Column(Date, nullable=False)
    name = Column(String(100), nullable=False)
    gender = Column(String(50), nullable=False)
    political = Column(String(255), nullable=False)
    tutor = Column(String(255), nullable=False)
    entryDate = Column(Date)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    selfEval = Column(String(50), nullable=False)
    mainWork = Column(Text, nullable=False)
    papers = Column(Text, nullable=False)
    attendance = Column(JSON, nullable=False, server_default='{}')
    unitComment = Column(Text, nullable=False)
    unitGrade = Column(String(50), nullable=False)
    unitSignDate = Column(Date, nullable=False)
    assessedComment = Column(Text, nullable=False)
    assessedSignDate = Column(Date, nullable=False)
    schoolComment = Column(Text, nullable=False)
    schoolSignDate = Column(Date, nullable=False)
    remark = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user =  relationship('User')