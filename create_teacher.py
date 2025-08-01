#!/usr/bin/env python3
"""
创建导师用户
"""

import requests
import json

def create_teacher_user():
    """创建导师用户"""
    # 注册导师用户
    register_data = {
        "username": "teacher",
        "password": "123456",
        "role": "teacher"  # 指定角色为teacher
    }
    
    try:
        # 注册用户
        response = requests.post(
            "http://localhost:8000/users/register",
            json=register_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("导师用户注册成功")
            
            # 登录获取token
            login_data = {
                "username": "teacher",
                "password": "123456",
                "grant_type": "",
                "scope": "",
                "client_id": "",
                "client_secret": ""
            }
            
            login_response = requests.post(
                "http://localhost:8000/auth/login",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if login_response.status_code == 200:
                token_data = login_response.json()
                token = token_data.get("access_token")
                print(f"登录成功，token: {token[:50]}...")
                
                # 检查用户信息
                me_response = requests.get(
                    "http://localhost:8000/auth/me",
                    headers={"Authorization": f"Bearer {token}"}
                )
                
                if me_response.status_code == 200:
                    user_info = me_response.json()
                    print(f"用户信息: {user_info}")
                    
                    # 测试导师API
                    teacher_response = requests.get(
                        "http://localhost:8000/entryMange/teacher/students",
                        headers={"Authorization": f"Bearer {token}"}
                    )
                    
                    if teacher_response.status_code == 200:
                        print("导师API测试成功")
                        students = teacher_response.json()
                        print(f"找到 {len(students)} 个学生")
                    else:
                        print(f"导师API测试失败: {teacher_response.status_code}")
                        print(f"错误信息: {teacher_response.text}")
                else:
                    print(f"获取用户信息失败: {me_response.status_code}")
            else:
                print(f"登录失败: {login_response.status_code}")
                print(f"错误信息: {login_response.text}")
        else:
            print(f"注册失败: {response.status_code}")
            print(f"错误信息: {response.text}")
            
    except Exception as e:
        print(f"错误: {e}")

if __name__ == "__main__":
    create_teacher_user() 