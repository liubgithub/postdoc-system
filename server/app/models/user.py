from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user")

    # email = Column(String(100), unique=True, nullable=True)
    # created_at = Column(DateTime, default=datetime.utcnow)
    # is_active = Column(Boolean, default=True)