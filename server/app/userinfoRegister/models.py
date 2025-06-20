from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Info(Base):
    __tablename__ = 'bs_user_profile'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    gender = Column(String(50))
    birth_year = Column(Integer)
    nationality = Column(String(100))
    political_status = Column(String(100))
    phone = Column(String(50))
    religion = Column(String(100))
    id_number = Column(String(50))
    is_religious_staff = Column(Boolean, default=False)
    research_direction = Column(String(255))
    other = Column(Text)
    education_experience = relationship("EducationExperience", back_populates="user", cascade="all, delete-orphan")
    work_experience = relationship("WorkExperience", back_populates="user", cascade="all, delete-orphan")

class EducationExperience(Base):
    __tablename__ = 'bs_education_experience'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('bs_user_profile.id', ondelete='CASCADE'), nullable=False)
    start_end = Column(String(50), nullable=False)
    school_major = Column(String(255), nullable=False)
    supervisor = Column(String(255))
    user = relationship("Info", back_populates="education_experience")

class WorkExperience(Base):
    __tablename__ = 'bs_work_experience'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('bs_user_profile.id', ondelete='CASCADE'), nullable=False)
    start_end = Column(String(50), nullable=False)
    company_position = Column(String(255), nullable=False)
    user = relationship("Info", back_populates="work_experience") 