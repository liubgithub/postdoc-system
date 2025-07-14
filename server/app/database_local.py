from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config_local import settings

# 创建数据库引擎 - 使用SQLite for 本地开发
engine = create_engine(
    settings.DATABASE_URL,
    # SQLite specific settings
    connect_args={"check_same_thread": False}  # SQLite需要这个参数
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