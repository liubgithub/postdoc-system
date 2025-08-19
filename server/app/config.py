import urllib.parse
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 数据库配置
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postDOCS316..."
    # DB_HOST: str = "localhost"
    DB_HOST: str = "47.96.11.84"
    DB_PORT: str = "10092"
    DB_NAME: str = "postgres"

    # JWT配置
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300

    # 应用配置
    APP_NAME: str = "Postdoc API"
    APP_VERSION: str = "1.0.0"

    # 环境配置
    ENVIRONMENT: str = "development"  # development, production

    # 邮件配置（用于发送QQ邮箱验证码）
    EMAIL_HOST: str = "smtp.qq.com"
    EMAIL_PORT: int = 465
    EMAIL_USE_SSL: bool = True
    EMAIL_USERNAME: str = "1142983070@qq.com"
    EMAIL_PASSWORD: str = "camfxrmdmgxrihic"  # QQ邮箱授权码
    EMAIL_FROM: str = "1142983070@qq.com"       # 默认使用 EMAIL_USERNAME

    # （可选）Redis 配置：如将来需要切换到 Redis，可在此添加相关配置

    @property
    def DATABASE_URL(self) -> str:
        password = urllib.parse.quote_plus(self.DB_PASSWORD)
        return f"postgresql+psycopg2://{self.DB_USER}:{password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"


settings = Settings()