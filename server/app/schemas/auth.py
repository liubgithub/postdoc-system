from pydantic import BaseModel


class LoginInput(BaseModel):
    username: str
    password: str
    role: str = "user"  # 新增字段，默认 user


class Token(BaseModel):
    access_token: str
    token_type: str
    # role 字段已移除


class UserResponse(BaseModel):
    username: str
    role: str

    class Config:
        from_attributes = True