from pydantic import BaseModel


class LoginInput(BaseModel):
    username: str
    password: str
    role: str = "user"  # 新增字段，默认 user
    email: str | None = None


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