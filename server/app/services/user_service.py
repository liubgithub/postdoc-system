from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status, Depends
from ..models.user import User
from ..schemas.auth import LoginInput, UserUpdateRequest
from .auth_service import AuthService
from ..dependencies import get_db
from typing import List


class UserService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
        self.auth_service = AuthService()

    def create_user(self, user_data: LoginInput) -> User:
        """创建用户"""
        # 检查用户名是否已存在
        if self.db.query(User).filter(User.username == user_data.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已存在"
            )

        # 创建新用户
        hashed_password = self.auth_service.get_password_hash(user_data.password)
        user = User(
            username=user_data.username,
            hashed_password=hashed_password,
            role=user_data.role or "user",  # 支持 teacher 角色
            name=user_data.name,
            email=user_data.email,
        )

        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="创建用户失败"
            )

    def get_all_users(self) -> List[User]:
        """获取所有用户"""
        return self.db.query(User).all()

    def get_user_by_username(self, username: str) -> User:
        """根据用户名获取用户"""
        user = self.db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        return user

    def update_user(self, username: str, update_data: UserUpdateRequest, current_user: User) -> User:
        """更新用户信息"""
        # 查找目标用户
        target_user = self.db.query(User).filter(User.username == username).first()
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )

        # 不能修改管理员角色（除非是超级管理员）
        if update_data.role and update_data.role == "admin" and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="只有管理员可以设置管理员角色"
            )

        # 不能修改自己的角色
        if target_user.username == current_user.username and update_data.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="不能修改自己的角色"
            )

        # 更新用户信息
        if update_data.name is not None:
            target_user.name = update_data.name
        if update_data.role is not None:
            target_user.role = update_data.role
        if update_data.email is not None:
            target_user.email = update_data.email

        try:
            self.db.commit()
            self.db.refresh(target_user)
            return target_user
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="更新用户失败"
            )

    def delete_user(self, username: str, current_user: User) -> dict:
        """删除用户"""
        # 查找目标用户
        target_user = self.db.query(User).filter(User.username == username).first()
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
            self.db.delete(target_user)
            self.db.commit()
            return {"msg": f"用户 {username} 删除成功"}
        except Exception:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="删除用户失败"
            )