import os
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Dict, Optional, Union, List
from datetime import datetime
import shutil
from pathlib import Path
from models import uploadSign
from schemas import AttachmentIn, AttachmentOut
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/uploadSign", tags=["上传签名"])

router.post('/', response_model=AttachmentOut)
def upload_sign(
      db: Session = Depends(get_db), 
      current_user: User = Depends(get_current_user)
):
    