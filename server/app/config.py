import urllib.parse
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 数据库配置
    DB_USER: str = "lhsd"
    DB_PASSWORD: str = "LHsd123@"
    DB_HOST: str = "pgm-bp1n6ip293s5y7fxco.pg.rds.aliyuncs.com"
    DB_PORT: str = "5432"
    DB_NAME: str = "postdoc"

    # JWT配置
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 应用配置
    APP_NAME: str = "Postdoc API"
    APP_VERSION: str = "1.0.0"

    # 环境配置
    ENVIRONMENT: str = "development"  # development, production

    @property
    def DATABASE_URL(self) -> str:
        password = urllib.parse.quote_plus(self.DB_PASSWORD)
        return f"postgresql+psycopg2://{self.DB_USER}:{password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"


settings = Settings()