import urllib.parse
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 数据库配置 - 使用本地SQLite用于学习和测试
    DB_USER: str = "test"
    DB_PASSWORD: str = "test"
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_NAME: str = "postdoc_local.db"

    # JWT配置
    SECRET_KEY: str = "qzS7O-tPMxeWmm-LPh3CGA-JdoX8F1Ir1nHGv9WNFAk"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 应用配置
    APP_NAME: str = "Postdoc API - Local Development"
    APP_VERSION: str = "1.0.0"

    # 环境配置
    ENVIRONMENT: str = "development"  # development, production

    @property
    def DATABASE_URL(self) -> str:
        # 使用SQLite用于本地开发和学习
        return f"sqlite:///./{self.DB_NAME}"

    class Config:
        env_file = ".env"


settings = Settings()