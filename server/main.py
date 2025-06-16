from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User
from schemas import Token
import auth

# 创建表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Postdoc API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 用于获取当前用户的 token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# 获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ 注册接口
from schemas import LoginInput

@app.post("/register", summary="注册用户", description="注册新用户（默认角色为普通用户）")
def register(data: LoginInput, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=422, detail="用户名已存在")
    user = User(
        username=data.username,
        hashed_password=auth.get_password_hash(data.password),
        role="user"  # 强制为普通用户
    )
    db.add(user)
    db.commit()
    return {"msg": "注册成功"}



# ✅ 登录接口（OAuth2 标准表单）
@app.post("/login", response_model=Token, summary="用户登录", description="使用用户名和密码登录，获取 JWT Token。")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    token = auth.create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}

# ✅ 获取当前用户
@app.get("/me", summary="获取当前用户信息", description="通过 JWT Token 获取当前登录用户的用户名。")
def get_me(token: str = Depends(oauth2_scheme)):
    username = auth.decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Token 无效")
    return {"username": username}

# ✅ 删除用户（需要认证）
@app.delete("/user/{username}", summary="删除用户", description="仅管理员可删除普通用户，不能删除管理员")
def delete_user(username: str, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    current_username = auth.decode_token(token)
    if not current_username:
        raise HTTPException(status_code=401, detail="无效的 Token")

    current_user = db.query(User).filter(User.username == current_username).first()
    if not current_user or current_user.role != "admin":
        raise HTTPException(status_code=403, detail="只有管理员才能删除用户")

    target_user = db.query(User).filter(User.username == username).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="用户不存在")

    if target_user.role == "admin":
        raise HTTPException(status_code=403, detail="不能删除管理员账户")

    db.delete(target_user)
    db.commit()
    return {"msg": f"用户 {username} 删除成功"}



