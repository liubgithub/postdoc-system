from pydantic import BaseModel
from typing import  Optional


class EnterWorkstationIn(BaseModel):
    subject: str
    postname: str
    posttask: str
    postqualification: Optional[str]
    cotutor: str
    allitutor: str
    remark: Optional[str]


class EnterWorkstationOut(EnterWorkstationIn):
    id: int
    user_id: int
    created_at: Optional[str]
    updated_at: Optional[str]

    class Config:
        orm_mode = True

