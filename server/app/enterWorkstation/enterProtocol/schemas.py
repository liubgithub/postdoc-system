from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EnterProtocolIn(BaseModel):
    stuId: str
    name: str
    cotutor: str
    entryYear: str
    college: str
    subject: str
    phone: str
    email: str


class EnterProtocolOut(EnterProtocolIn):
    id: int
    user_id:int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True