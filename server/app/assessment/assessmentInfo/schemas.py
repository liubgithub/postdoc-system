from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StudentIn(BaseModel):
    stu_num: str
    stu_name: str
    cotutor: Optional[str] = None
    college: Optional[str] = None
    subject: Optional[str] = None

class StudentOut(StudentIn):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AssessmentApplicationIn(BaseModel):
    user_id: int
    apply_time: Optional[datetime] = None
    process_status: Optional[int] = 0
    node_name: Optional[str] = None
    assessment_res: Optional[str] = None

class AssessmentApplicationOut(AssessmentApplicationIn):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
