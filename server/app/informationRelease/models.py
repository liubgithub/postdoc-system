from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class InformationRelease(Base):
     __tablename__ = 'information_manage'
    id = Column(Integer, primary_key=True, index=True)
    newsName = Column(String(255), nullable=False)
    belongT = Column(String(50), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)