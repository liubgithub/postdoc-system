from fastapi import APIRouter

from .assessmentInfo.routers import router as assInfo
from .inAssessment.annulAssessment.routers import router as annulAss
from .inAssessment.extenAssessment.routers import router as extenAss
from .inAssessment.extenBaseinfo.routers import router as extenBase

router = APIRouter()

router.include_router(assInfo)
router.include_router(annulAss)
router.include_router(extenAss)
router.include_router(extenBase)
