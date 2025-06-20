from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from .models import EnterWorkstation
from .schemas import EnterWorkstationIn

router = APIRouter(prefix="/enterWorkstation", tags=["进站申请"])

@router.post("/apply")
def enter_workstation(data: EnterWorkstationIn, db: Session = Depends(get_db)):
    enter_workstation = EnterWorkstation(
        subject=data.subject,
        postname=data.postname,
        posttask=data.posttask,
        postqualification=data.postqualification,
        cotutor=data.cotutor,
        allitutor=data.allitutor,
        remark=data.remark,
    )

    db.add(enter_workstation)
    db.flush() 

    db.commit()
    return {"msg": "success"}