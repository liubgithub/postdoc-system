# main_local.py (本地开发版本)
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config_local import settings
from app.database_local import Base, engine
from app.routers import auth_local, users_local

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="博士后管理系统API - 本地学习版本"
)

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

# 注册路由
app.include_router(auth_local.router)
app.include_router(users_local.router)

@app.get("/", summary="服务状态")
def root():
    return {"message": "Postdoc API - Local Development is running"}

@app.get("/demo", summary="演示界面")
def demo():
    """提供系统演示界面"""
    return FileResponse('static/demo.html')