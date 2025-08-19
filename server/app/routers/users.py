from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_admin_user
from ..schemas.auth import LoginInput, VerifyEmailCodeInput
from ..services.user_service import UserService
from ..models.user import User
from ..services.verification_store import verification_service

router = APIRouter(prefix="/users", tags=["用户管理"])

@router.post("/register", summary="注册用户", description="注册新用户（默认角色为普通用户），需要已通过邮箱验证码验证")
def register(data: LoginInput, user_service: UserService = Depends()):
    # 若提供了 email，则要求验证码先通过 /auth/verify_email_code 验证
    # 这里示例：允许无 email 的旧流程；若有 email，强制校验
    if data.email:
        key = f"register:{data.email}"
        if not verification_service.is_verified(key):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先完成邮箱验证码验证")

    user = user_service.create_user(data)
    return {"msg": "注册成功", "username": user.username}

@router.delete("/{username}", summary="删除用户", description="仅管理员可删除普通用户，不能删除管理员")
def delete_user(
    username: str,
    current_user: User = Depends(get_admin_user),
    user_service: UserService = Depends()
):
    return user_service.delete_user(username, current_user)