from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text

class EnterWorkstation(Base):
    __tablename__ = 'bs_enter_workstation'
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(255), nullable=False)
    postname = Column(String(255), nullable=False)
    posttask = Column(String(255), nullable=False)
    postqualification = Column(String(255), nullable=False)
    cotutor = Column(String(255), nullable=False)
    allitutor = Column(String(255), nullable=False)
    remark = Column(String(255), nullable=False)
   