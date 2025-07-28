from pydantic import BaseModel
from typing import List, Optional

class EducationExperienceIn(BaseModel):
    start_end: str
    school_major: str
    supervisor: Optional[str] = ""

class WorkExperienceIn(BaseModel):
    start_end: str
    company_position: str

class InfoIn(BaseModel):
    name: str
    gender: Optional[str] = ""
    birth_year: Optional[int] = None
    nationality: Optional[str] = ""
    political_status: Optional[str] = ""
    phone: Optional[str] = ""
    religion: Optional[str] = ""
    id_number: Optional[str] = ""
    is_religious_staff: Optional[bool] = False
    research_direction: Optional[str] = ""
    other: Optional[str] = ""
    otherachievements: Optional[str] = ""   
    education_experience: List[EducationExperienceIn]
    work_experience: List[WorkExperienceIn] 

class EducationExperienceOut(EducationExperienceIn):
    id: int

    class Config:
        from_attributes = True

class WorkExperienceOut(WorkExperienceIn):
    id: int

    class Config:
        from_attributes = True

class InfoOut(BaseModel):
    id: int
    user_id: int
    name: str
    gender: Optional[str]
    birth_year: Optional[int]
    nationality: Optional[str]
    political_status: Optional[str]
    phone: Optional[str]
    religion: Optional[str]
    id_number: Optional[str]
    is_religious_staff: Optional[bool]
    research_direction: Optional[str]
    other: Optional[str]
    education_experience: List[EducationExperienceOut]
    work_experience: List[WorkExperienceOut]
    otherachievements: Optional[str]

    class Config:
        from_attributes = True 