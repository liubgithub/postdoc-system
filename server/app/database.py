from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# 创建数据库引擎
engine = create_engine(
    settings.DATABASE_URL,
    # 可选：连接池配置
    pool_pre_ping=True,  # 检查连接是否有效
    pool_recycle=300,    # 连接回收时间
)

# 创建会话工厂
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 创建基础模型类
Base = declarative_base()

# 数据库会话依赖（不变）
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()