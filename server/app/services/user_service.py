from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from ..models.user import User
from ..schemas.auth import LoginInput
from .auth_service import AuthService


class UserService:
    def __init__(self):
        self.auth_service = AuthService()

    def create_user(self, db: Session, user_data: LoginInput) -> User:
        """创建用户"""
        # 检查用户名是否已存在
        if db.query(User).filter(User.username == user_data.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已存在"
            )

        # 创建新用户
        hashed_password = self.auth_service.get_password_hash(user_data.password)
        user = User(
            username=user_data.username,
            hashed_password=hashed_password,
            role="user"
        )

        try:
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="创建用户失败"
            )

    def delete_user(self, db: Session, username: str, current_user: User) -> dict:
        """删除用户"""
        # 查找目标用户
        target_user = db.query(User).filter(User.username == username).first()
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )

        # 不能删除管理员
        if target_user.role == "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="不能删除管理员账户"
            )

        # 不能删除自己
        if target_user.username == current_user.username:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="不能删除自己的账户"
            )

        try:
            db.delete(target_user)
            db.commit()
            return {"msg": f"用户 {username} 删除成功"}
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="删除用户失败"
            )