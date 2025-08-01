from app.database import Base
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class PostdoctoralExtension(Base):
    __tablename__ = 'bs_postdoctoral_extension'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    research_progress = Column(Text, nullable=False)  # 主持或参与科研项目情况
    academic_achievements = Column(Text, nullable=False)  # 发表学术成果情况
    patents = Column(Text, nullable=False)  # 授权专利、科技成果转让情况
    consultation_reports = Column(Text, nullable=False)  # 咨询报告采纳与批示情况
    research_brief = Column(Text, nullable=False)  # 科研工作简述
    extension_plan = Column(Text, nullable=False)  # 延期工作内容，预期研究成果
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User')