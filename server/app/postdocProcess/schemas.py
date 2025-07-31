from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WorkflowBase(BaseModel):
    student_id: int
    entry_application: str
    entry_assessment: str
    entry_agreement: str
    midterm_assessment: str
    annual_assessment: str
    extension_assessment: str
    leave_assessment: str

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowResponse(WorkflowBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True