from fastapi import APIRouter

from .enterapply.routers import router as enter_apply
from .enterRelation.routers import router as enter_Relation
from .enterAssessment.routers import router as enter_assessment
from .enterProtocol.routers import router as enter_protocol

router = APIRouter()

router.include_router(enter_apply)
router.include_router(enter_Relation)
router.include_router(enter_assessment)
router.include_router(enter_protocol)