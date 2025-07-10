from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EnterWorkstationIn(BaseModel):
    subject: str
    postname: str
    posttask: str
    postqualification: Optional[str] = None
    cotutor: str
    allitutor: str
    remark: Optional[str] = None


class EnterWorkstationOut(EnterWorkstationIn):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

