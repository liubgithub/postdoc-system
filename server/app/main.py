# main.py (在项目根目录)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routers import auth, users
from app.userinfoRegister import routers as info_routers

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="博士后管理系统API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 注册路由
app.include_router(auth.router)
app.include_router(users.router)

# 个人信息登记路由
app.include_router(info_routers.router)

@app.get("/", summary="服务状态")
def root():
    return {"message": "Postdoc API is running"}