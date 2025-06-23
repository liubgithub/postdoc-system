from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_admin_user
from ..schemas.auth import LoginInput
from ..services.user_service import UserService
from ..models.user import User

router = APIRouter(prefix="/users", tags=["用户管理"])

@router.post("/register", summary="注册用户", description="注册新用户（默认角色为普通用户）")
def register(data: LoginInput, user_service: UserService = Depends()):
    user_service.create_user(data)
    return {"msg": "注册成功"}

@router.delete("/{username}", summary="删除用户", description="仅管理员可删除普通用户，不能删除管理员")
def delete_user(
    username: str,
    current_user: User = Depends(get_admin_user),
    user_service: UserService = Depends()
):
    return user_service.delete_user(username, current_user)