from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime, date

class InformationReleaseIn(BaseModel):
    newsName:str
    belongTo:str
    content:str

class InformationReleaseOut(InformationReleaseIn):
    id:int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)