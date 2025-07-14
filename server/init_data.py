#!/usr/bin/env python3
"""
数据初始化脚本 - 用于学习和测试
Creates initial admin user and some test data for the postdoc management system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database_local import SessionLocal, Base, engine
from app.models.user_local import User
from app.services.auth_service_local import AuthService

def init_database():
    """初始化数据库和基础数据"""
    print("🔄 初始化数据库...")
    
    # 创建数据库表
    Base.metadata.create_all(bind=engine)
    print("✅ 数据库表创建完成")
    
    # 创建数据库会话
    db = SessionLocal()
    auth_service = AuthService()
    
    try:
        # 检查是否已有管理员
        admin_exists = db.query(User).filter(User.role == "admin").first()
        if admin_exists:
            print("⚠️  管理员账户已存在")
        else:
            # 创建管理员账户
            admin_user = User(
                username="admin",
                hashed_password=auth_service.get_password_hash("admin123"),
                role="admin",
                email="admin@postdoc.system"
            )
            db.add(admin_user)
            print("✅ 管理员账户创建完成 (用户名: admin, 密码: admin123)")
        
        # 创建一些示例普通用户
        test_users = [
            {"username": "博士后张三", "password": "zhang123", "email": "zhang@example.com"},
            {"username": "博士后李四", "password": "li123", "email": "li@example.com"},
            {"username": "导师王五", "password": "wang123", "email": "wang@example.com"}
        ]
        
        for user_data in test_users:
            if not db.query(User).filter(User.username == user_data["username"]).first():
                user = User(
                    username=user_data["username"],
                    hashed_password=auth_service.get_password_hash(user_data["password"]),
                    role="user",
                    email=user_data["email"]
                )
                db.add(user)
                print(f"✅ 测试用户创建完成: {user_data['username']}")
        
        db.commit()
        print("\n🎉 数据库初始化完成!")
        print("\n📋 账户信息:")
        print("管理员: admin / admin123")
        print("测试用户: 博士后张三 / zhang123")
        print("测试用户: 博士后李四 / li123") 
        print("测试用户: 导师王五 / wang123")
        print("\n🌐 API文档地址: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"❌ 初始化失败: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()