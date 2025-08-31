from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime, date

# 首先定义考勤子模型
class Attendance(BaseModel):
    sick: str = Field("", description="病假天数")
    personal: str = Field("", description="事假天数")
    absenteeism: str = Field("", description="旷工天数")
    leave: str = Field("", description="休假天数")
    other: str = Field("", description="其他缺勤天数")
    
    class Config:
        schema_extra = {
            "example": {
                "sick": "2",
                "personal": "1",
                "absenteeism": "0",
                "leave": "3",
                "other": "0"
            }
        }

# 然后定义主模型
class AnnulAssessmentIn(BaseModel):
    unit: Optional[str] = None
    station: Optional[str] = None
    fillDate: Optional[date] = None
    name: Optional[str] = None
    gender: Optional[str] = None
    political: Optional[str] = None
    tutor: Optional[str] = None
    entryDate: Optional[date] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    selfEval: Optional[str] = None
    mainWork: Optional[str] = None
    papers: Optional[str] = None
    attendance: Attendance = Field(default_factory=Attendance)  # 使用上面定义的考勤模型
    unitComment: Optional[str] = None
    unitSignDate: Optional[date] = None
    assessedComment: Optional[str] = None
    assessedSignDate: Optional[date] = None
    schoolComment: Optional[str] = None
    schoolSignDate: Optional[date] = None
    remark: Optional[str] = None
    
class AnnulAssessmentOut(AnnulAssessmentIn):
    id:int
    user_id:int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True