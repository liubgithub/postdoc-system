from pydantic import BaseModel,ConfigDict
from typing import Optional, List
from datetime import datetime

class AttachmentIn(BaseModel):
    id: int
    filename: str
    filepath: str
    filetype: str
    created_at: datetime

    class Config:
        from_attributes = True

class AttachmentOut(AttachmentIn):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    attachments: List[AttachmentIn] = []

    model_config = ConfigDict(from_attributes=True)