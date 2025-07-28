# server/app/enterWorkstation/enterRelation/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EnterRelationBase(BaseModel):
    base_work: Optional[str] = None
    necessity_analysis: Optional[str] = None
    resplan_expected: Optional[str] = None
    results: Optional[str] = None
    other_achievements: Optional[str] = None
    academic_pursuits: Optional[str] = None


class EnterRelationInDBBase(EnterRelationBase):
    user_id:int
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
