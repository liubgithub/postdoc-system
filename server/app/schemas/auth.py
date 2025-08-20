from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class LoginInput(BaseModel):
    username: str
    password: str
    role: str = "user"  # 新增字段，默认 user
    email: str | None = None
    name: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str
    # role 字段已移除


class UserResponse(BaseModel):
    username: str
    role: str

    class Config:
        from_attributes = True


class SendEmailCodeInput(BaseModel):
    email: str
    scene: str = "register"  # 可扩展：register, reset_password 等


class VerifyEmailCodeInput(BaseModel):
    email: str
    code: str
    scene: str = "register"


class LoginRequest(BaseModel):
    username: str
    password: str


# 用户管理相关schema
class UserDetailResponse(BaseModel):
    id: int
    username: str
    name: Optional[str] = None
    role: str
    email: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None