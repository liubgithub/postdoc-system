from app.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Date, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

class ExtenBaseInfo(Base):
    __tablename__ = 'extension_info'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    nationality = Column(String(100), nullable=False)
    gender = Column(String(50), nullable=False)
    birthDate = Column(Date, nullable=False)
    researchDirection = Column(String(255), nullable=False)
    entryDate = Column(Date, nullable=False)
    doctoralSupervisor = Column(String(100), nullable=False)
    postdocSupervisor = Column(String(100), nullable=False)
    agreementDate = Column(Date, nullable=False)
    hasExtensionBefore = Column(Boolean, nullable=False, default=False)  
    extensionTimes = Column(Integer, nullable=False, default=0)  
    extensionFunding = Column(String(255), nullable=True) 
    extensionDuration = Column(JSON, nullable=True, default=list) 
    applicationContent = Column(Text, nullable=True)  
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship('User')