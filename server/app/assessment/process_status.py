from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel
from app.dependencies import get_current_user

router = APIRouter()

class ProcessStep(BaseModel):
    process: str
    status: str
    description: str = ""

@router.get("/process/status", summary="获取流程状态")
async def get_process_status(current_user = Depends(get_current_user)):
    """
    获取当前用户的流程状态
    """
    # 这里可以根据用户ID从数据库获取实际的流程状态
    # 目前返回示例数据
    process_steps = [
        {"process": "进站申请", "status": "申请已提交", "description": "申请已提交"},
        {"process": "进站申请", "status": "合作导师已审核", "description": "合作导师已审核"},
        {"process": "进站申请", "status": "分管领导已审核", "description": "分管领导已审核"},
        {"process": "进站考核", "status": "", "description": ""},
        {"process": "进站协议", "status": "", "description": ""},
        {"process": "中期考核", "status": "", "description": ""},
        {"process": "年度考核", "status": "", "description": ""},
        {"process": "延期考核", "status": "", "description": ""},
        {"process": "出站考核", "status": "", "description": ""}
    ]
    
    return {"data": process_steps} 