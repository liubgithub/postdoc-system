from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class ExtenBaseInfoIn(BaseModel):
    name: Optional[str] = None
    nationality: Optional[str] = None
    gender: Optional[str] = None
    birthDate: Optional[date] = None
    researchDirection: Optional[str] = None
    entryDate: Optional[date] = None
    doctoralSupervisor: Optional[str] = None
    postdocSupervisor: Optional[str] = None
    agreementDate: Optional[date] = None
    hasExtensionBefore: bool = False
    extensionTimes: int = 0
    extensionFunding: Optional[str] = None
    extensionDuration: List[str] = []
    applicationContent: Optional[str] = None

class ExtenBaseInfoOut(ExtenBaseInfoIn):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
