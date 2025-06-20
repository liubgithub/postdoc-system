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

