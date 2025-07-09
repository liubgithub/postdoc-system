from fastapi import APIRouter

from .enterapply.routers import router as enter_apply


router = APIRouter()

router.include_router(enter_apply)