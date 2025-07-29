from fastapi import APIRouter

from .assessmentInfo.routers import router as assInfo
from .process_status import router as process_status

router = APIRouter()

router.include_router(assInfo)
router.include_router(process_status)