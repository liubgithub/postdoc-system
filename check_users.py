#!/usr/bin/env python3
"""
检查数据库中的用户信息
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from server.app.database import SessionLocal
from server.app.models.user import User

def check_users():
    """检查数据库中的用户"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"数据库中共有 {len(users)} 个用户:")
        for user in users:
            print(f"  - ID: {user.id}, 用户名: {user.username}, 角色: {user.role}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users() 