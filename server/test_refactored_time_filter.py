#!/usr/bin/env python3
"""
重构后的时间过滤功能测试脚本
所有表的time字段都是DateTime类型
"""

import requests
import json
from datetime import datetime

# 配置
BASE_URL = "http://localhost:8000"

def test_time_filter_api():
    """测试时间过滤API"""
    print("🚀 测试重构后的时间过滤功能")
    print("=" * 50)
    
    # 测试时间
    test_time = "2024-01-01T00:00:00"
    
    # 测试端点
    endpoints = [
        {
            "name": "获取当前用户数据",
            "url": f"{BASE_URL}/userinfoRegister/time-filter/get-data-after-time",
            "method": "GET",
            "params": {"target_time": test_time}
        },
        {
            "name": "管理员获取指定用户数据",
            "url": f"{BASE_URL}/userinfoRegister/time-filter/get-data-by-user/1",
            "method": "GET", 
            "params": {"target_time": test_time}
        }
    ]
    
    for endpoint in endpoints:
        print(f"\n测试: {endpoint['name']}")
        print(f"URL: {endpoint['url']}")
        print(f"参数: {endpoint['params']}")
        
        try:
            # 注意：这里需要有效的token才能测试
            # 实际使用时需要先登录获取token
            response = requests.get(
                endpoint['url'], 
                params=endpoint['params'],
                headers={"Authorization": "Bearer YOUR_TOKEN_HERE"}
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ 请求成功")
                print(f"用户ID: {data.get('user_id')}")
                print(f"目标时间: {data.get('target_time')}")
                print(f"总数据条数: {data.get('total_count')}")
                
                # 显示每个表的数据统计
                tables = data.get('tables', {})
                for table_name, table_data in tables.items():
                    print(f"  {table_data.get('display_name')}: {table_data.get('count')} 条")
                    if table_data.get('error'):
                        print(f"    错误: {table_data['error']}")
            else:
                print(f"❌ 请求失败: {response.status_code}")
                print(f"响应: {response.text}")
                
        except Exception as e:
            print(f"❌ 请求异常: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 测试完成")
    print("\n注意：")
    print("1. 所有表的time字段现在都是DateTime类型")
    print("2. 统一使用 time > target_time 的查询逻辑")
    print("3. 需要有效的JWT token才能进行实际测试")

if __name__ == "__main__":
    test_time_filter_api() 