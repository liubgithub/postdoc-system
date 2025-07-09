from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class EnterWorkstation(Base):
    __tablename__ = 'bs_enter_workstation'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    postname = Column(String(255), nullable=False)
    posttask = Column(String(255), nullable=False)
    postqualification = Column(String(255), nullable=False)
    cotutor = Column(String(255), nullable=False)
    allitutor = Column(String(255), nullable=False)
    remark = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User')
   