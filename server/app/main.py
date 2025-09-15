# main.py (在项目根目录)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.config import settings
from app.database import Base, engine
from app.routers import auth, users
from app.userinfoRegister import routers as info_routers
from app.enterWorkstation import routers as enter_workstation
from app.assessment import routers as assment_info
from app.Teacher.EntryMange import teacher_routers
from app.Teacher.TeacherInfo import routers as teacher_info_routers
from app.postdocProcess import routers as postdocProcess
from app.uploadSign import routers as upload_sign
from app.resStatus import routers as res_status
from app.informationRelease import routers as information_release

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

# # 文件代理
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# UPLOAD_ROOT = os.path.join(BASE_DIR, '..', 'uploaded_files')
# app.mount(
#     "/static",
#     StaticFiles(directory=os.path.abspath(UPLOAD_ROOT)),
#     name="static"
# )

# 注册路由
app.include_router(auth.router)
app.include_router(users.router)

# 个人信息登记路由
app.include_router(info_routers.router)

# 博士后流程状态
app.include_router(postdocProcess.router)

# 进站申请
app.include_router(enter_workstation.router)

#考核基本信息
app.include_router(assment_info.router)

# 导师管理路由
app.include_router(teacher_routers.router)

# 导师信息路由
app.include_router(teacher_info_routers.router)

#服务器文件夹签名
app.include_router(upload_sign.router)

# 博士后项目研究情况
app.include_router(res_status.router)

# infomation release
app.include_router(information_release.router)

@app.get("/", summary="服务状态")
def root():
    return {"message": "Postdoc API is running"}