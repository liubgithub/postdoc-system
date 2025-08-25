from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class TeacherInfoIn(BaseModel):
    name: str
    gender: str
    birth_year: Optional[int] = None
    nationality: str
    political_status: str
    phone: str
    work_id: str
    unit: str
    ID_card: str
    email: str
    college: str
    title_position: str
    res_direction: str

    
class TeacherInfoOut(TeacherInfoIn):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True