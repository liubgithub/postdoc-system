from jose import jwt, JWTError
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..config import settings
from ..models.user import User


class AuthService:

    @staticmethod
    def get_password_hash(password: str) -> str:
        """密码哈希"""
        return bcrypt.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return bcrypt.verify(plain_password, hashed_password)

    def authenticate_user(self, db: Session, username: str, password: str):
        """用户认证"""
        user = db.query(User).filter(User.username == username).first()
        if user and self.verify_password(password, user.hashed_password):
            return user
        return None

    @staticmethod
    def create_access_token(username: str) -> str:
        """创建访问令牌"""
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"sub": username, "exp": expire}
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def decode_token(token: str):
        """解码令牌"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            username: str = payload.get("sub")
            return username
        except JWTError:
            return None