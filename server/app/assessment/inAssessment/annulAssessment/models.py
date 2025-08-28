from app.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, SmallInteger,Date
from sqlalchemy.orm import relationship
from datetime import datetime

class AnnulAssessment(Base):
    __tablename__ = 'annul_assessment',
    id = Column(Integer,primary_key=True,index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    unit = Column(String(255))
    station =Column(String(255))
    fillDate = Column(Date)
    name = Column(String(100))
    gender = Column(String(50))
    political = Column(String(255))
    tutor = Column(String(255))
    entryDate = Column(Date)
    title = Column(String(255))
    summary = Column(Text)
    selfEval = Column(String(50))
    mainWork = Column(Text)
    papers = Column(Text)