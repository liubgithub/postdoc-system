from jose import jwt, JWTError
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..config import settings
from ..models.user import User


class AuthService:
    """
    认证服务类
    提供用户认证、密码加密、JWT令牌生成和验证等功能
    """

    @staticmethod
    def get_password_hash(password: str) -> str:
        """
        密码哈希加密
        
        Args:
            password (str): 明文密码
            
        Returns:
            str: 加密后的密码哈希值
        """
        return bcrypt.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        验证密码是否正确
        
        Args:
            plain_password (str): 用户输入的明文密码
            hashed_password (str): 数据库中存储的加密密码
            
        Returns:
            bool: 密码验证结果，True表示密码正确，False表示密码错误
        """
        return bcrypt.verify(plain_password, hashed_password)

    def authenticate_user(self, db: Session, username: str, password: str):
        """
        用户认证
        
        Args:
            db (Session): 数据库会话对象
            username (str): 用户名
            password (str): 用户输入的密码
            
        Returns:
            User: 认证成功返回用户对象，认证失败返回None
        """
        # 根据用户名查询用户
        user = db.query(User).filter(User.username == username).first()
        
        # 验证密码是否正确
        if user and self.verify_password(password, user.hashed_password):
            return user
        return None

    @staticmethod
    def create_access_token(username: str) -> str:
        """
        创建JWT访问令牌
        
        Args:
            username (str): 用户名，将作为令牌的主题(subject)
            
        Returns:
            str: 编码后的JWT令牌字符串
        """
        # 计算令牌过期时间
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # 构造令牌载荷数据
        to_encode = {"sub": username, "exp": expire}
        
        # 使用密钥和算法编码JWT令牌
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def decode_token(token: str):
        """
        解码并验证JWT令牌
        
        Args:
            token (str): JWT令牌字符串
            
        Returns:
            str: 解码成功返回用户名，解码失败返回None
        """
        try:
            # 解码JWT令牌，验证签名和过期时间
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            
            # 从载荷中提取用户名
            username: str = payload.get("sub")
            return username
            
        except JWTError:
            # 令牌无效、过期或签名错误时返回None
            return None