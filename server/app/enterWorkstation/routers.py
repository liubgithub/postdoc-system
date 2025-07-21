from fastapi import APIRouter

from .enterapply.routers import router as enter_apply
from .enterRelation.routers import router as enter_Relation

router = APIRouter()

router.include_router(enter_apply)
router.include_router(enter_Relation)