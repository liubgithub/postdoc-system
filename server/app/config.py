import urllib.parse
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 数据库配置
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postDOCS316..."
    DB_HOST: str = "localhost"
    DB_PORT: str = "10092"
    DB_NAME: str = "postgres"

    # JWT配置
    SECRET_KEY: str = ""
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