from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_current_user
from ..schemas.auth import Token, UserResponse, SendEmailCodeInput, VerifyEmailCodeInput, LoginRequest
from ..services.auth_service import AuthService
from ..services.email_service import EmailService
from ..services.verification_store import verification_service

router = APIRouter(prefix="/auth", tags=["认证"])

# 简单的单例服务实例（进程内）
email_service = EmailService()


@router.post("/login", response_model=Token, summary="用户登录", description="使用用户名和密码登录，获取 JWT Token")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth_service = AuthService()
    user = auth_service.authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth_service.create_access_token(user.username, user.role)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login_json", response_model=Token, summary="用户登录（JSON）", description="使用 JSON 提交用户名和密码登录")
def login_json(payload: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService()
    user = auth_service.authenticate_user(db, payload.username, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth_service.create_access_token(user.username, user.role)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse, summary="获取当前用户信息",
            description="通过 JWT Token 获取当前登录用户信息")
def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.post("/send_email_code", summary="发送邮箱验证码")
def send_email_code(data: SendEmailCodeInput):
    # 使用 email+scene 作为key
    key = f"{data.scene}:{data.email}"
    code = verification_service.issue_code(key)
    subject = "验证码"
    content = f"您的{data.scene}验证码为：{code}，5分钟内有效。如非本人操作请忽略。"
    email_service.send_text(data.email, subject, content)
    return {"msg": "验证码已发送"}


@router.post("/verify_email_code", summary="验证邮箱验证码")
def verify_email_code(data: VerifyEmailCodeInput):
    key = f"{data.scene}:{data.email}"
    ok = verification_service.verify_code(key, data.code)
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="验证码错误或已过期")
    # 标记为已验证，便于后续注册端校验
    verification_service.mark_verified(key)
    return {"msg": "验证通过"}