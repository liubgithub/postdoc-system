from app.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey,Text,DateTime
from datetime import datetime
from sqlalchemy.orm import relationship

class ResStatus(Base):
    __tablename__ = 'res_status'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    subNamePlan = Column(Text, nullable=False)
    subDescription = Column(Text, nullable=False)
    subType = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User')
