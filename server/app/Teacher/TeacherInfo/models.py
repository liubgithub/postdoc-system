from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from datetime import datetime

class TeacherInfo(Base):
    __tablename__ = 'teacher_info'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    gender = Column(String(50))
    birth_year = Column(Integer)
    nationality = Column(String(100))
    political_status = Column(String(100))
    phone = Column(String(50))
    work_id = Column(String(100))
    unit = Column(String(50))
    ID_card = Column(String(50))
    email = Column(String(100))
    college = Column(String(255))
    title_position = Column(String(100))
    res_direction = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
