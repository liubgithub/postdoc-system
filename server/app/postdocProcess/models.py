from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.database import Base
from datetime import datetime
import enum

class ProcessStatus(str, enum.Enum):
    NOT_SUBMITTED = "未提交"
    SUPERVISOR_PENDING = "导师未审核"
    SUPERVISOR_REJECTED = "导师驳回"
    COLLEGE_PENDING = "学院未审核"
    COLLEGE_REJECTED = "学院驳回"
    COMPLETED = "已审核"
    
class PostdocWorkflow(Base):
    __tablename__ = "postdoc_workflow"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    entry_application = Column(String(50), nullable=False, default="未提交")
    entry_assessment = Column(String(50), nullable=False, default="未提交")
    entry_agreement = Column(String(50), nullable=False, default="未提交")
    midterm_assessment = Column(String(50), nullable=False, default="未提交")
    annual_assessment = Column(String(50), nullable=False, default="未提交")
    extension_assessment = Column(String(50), nullable=False, default="未提交")
    leave_assessment = Column(String(50), nullable=False, default="未提交")
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)