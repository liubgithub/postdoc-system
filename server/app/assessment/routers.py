from fastapi import APIRouter

from .assessmentInfo.routers import router as assInfo

router = APIRouter()

router.include_router(assInfo)