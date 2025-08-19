from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResStatusIn(BaseModel):
    subNamePlan:str
    subDescription: str
    subType: str

class ResStatusOut(ResStatusIn):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True