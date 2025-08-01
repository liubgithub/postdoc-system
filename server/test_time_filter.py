#!/usr/bin/env python3
"""
时间过滤功能测试脚本
重构版本：所有表的time字段都是DateTime类型
"""

import requests
import json
from datetime import datetime

# 配置
BASE_URL = "http://localhost:8000"
TEST_USERNAME = "test_user"
TEST_PASSWORD = "test_password"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin_password"

def login(username, password):
    """用户登录"""
    url = f"{BASE_URL}/auth/login"
    data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print(f"登录失败: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"登录请求失败: {e}")
        return None

def test_get_data_after_time(token, target_time):
    """测试获取指定时间后的数据"""
    url = f"{BASE_URL}/userinfoRegister/time-filter/get-data-after-time"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"target_time": target_time}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            print("✅ 获取数据成功")
            print(f"用户ID: {data['user_id']}")
            print(f"目标时间: {data['target_time']}")
            print(f"总数据条数: {data['total_count']}")
            
            # 显示每个表的数据统计
            for table_name, table_data in data['tables'].items():
                print(f"  {table_data['display_name']}: {table_data['count']} 条")
                if table_data.get('error'):
                    print(f"    错误: {table_data['error']}")
        else:
            print(f"❌ 获取数据失败: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ 请求失败: {e}")

def test_admin_get_user_data(admin_token, user_id, target_time):
    """测试管理员获取指定用户数据"""
    url = f"{BASE_URL}/userinfoRegister/time-filter/get-data-by-user/{user_id}"
    headers = {"Authorization": f"Bearer {admin_token}"}
    params = {"target_time": target_time}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            print("✅ 管理员获取数据成功")
            print(f"目标用户ID: {data['user_id']}")
            print(f"目标时间: {data['target_time']}")
            print(f"总数据条数: {data['total_count']}")
            
            # 显示每个表的数据统计
            for table_name, table_data in data['tables'].items():
                print(f"  {table_data['display_name']}: {table_data['count']} 条")
                if table_data.get('error'):
                    print(f"    错误: {table_data['error']}")
        else:
            print(f"❌ 管理员获取数据失败: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ 请求失败: {e}")

def main():
    """主测试函数"""
    print("🚀 开始测试时间过滤功能")
    print("=" * 50)
    
    # 测试时间
    test_time = "2024-01-01T00:00:00"
    
    # 1. 测试普通用户登录
    print("1. 测试普通用户登录...")
    user_token = login(TEST_USERNAME, TEST_PASSWORD)
    if user_token:
        print("✅ 普通用户登录成功")
        
        # 2. 测试获取当前用户数据
        print("\n2. 测试获取当前用户数据...")
        test_get_data_after_time(user_token, test_time)
    else:
        print("❌ 普通用户登录失败")
    
    print("\n" + "=" * 50)
    
    # 3. 测试管理员登录
    print("3. 测试管理员登录...")
    admin_token = login(ADMIN_USERNAME, ADMIN_PASSWORD)
    if admin_token:
        print("✅ 管理员登录成功")
        
        # 4. 测试管理员获取指定用户数据
        print("\n4. 测试管理员获取指定用户数据...")
        test_admin_get_user_data(admin_token, 1, test_time)
    else:
        print("❌ 管理员登录失败")
    
    print("\n" + "=" * 50)
    print("🏁 测试完成")

if __name__ == "__main__":
    main() 