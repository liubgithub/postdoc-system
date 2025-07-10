from app.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, SmallInteger
from sqlalchemy.orm import relationship
from datetime import datetime

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    stu_num = Column(String(100), nullable=False)
    stu_name = Column(String(100), nullable=False)
    cotutor = Column(String(100))
    college = Column(String(100))
    subject = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User')
    applications = relationship('AssessmentApplication', back_populates='student', cascade='all, delete-orphan')

class AssessmentApplication(Base):
    __tablename__ = 'assessment_applications'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    apply_time = Column(DateTime)
    process_status = Column(SmallInteger, default=0, index=True)
    node_name = Column(String(50))
    assessment_res = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship('Student', back_populates='applications')
