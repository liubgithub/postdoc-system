# 博士后管理系统

## 📁 项目目录结构

```
server/
├── app/                          # 🏠 应用主目录
│   ├── __init__.py              # Python包标识文件
│   ├── main.py                  # 🚀 应用入口点
│   ├── config.py                # ⚙️ 配置管理
│   ├── database.py              # 🗄️ 数据库连接配置
│   ├── dependencies.py          # 🔗 依赖注入管理
│   │
│   ├── routers/                 # 🛣️ 路由模块目录
│   │   ├── __init__.py
│   │   ├── auth.py             # 🔐 认证相关路由
│   │   └── users.py            # 👥 用户管理路由
│   │
│   ├── models/                  # 🎯 数据模型目录
│   │   ├── __init__.py
│   │   └── user.py             # 👤 用户数据模型
│   │
│   ├── schemas/                 # 📋 数据验证模式目录
│   │   ├── __init__.py
│   │   └── auth.py             # 🔒 认证相关数据模式
│   │
│   └── services/                # 🔧 业务逻辑服务目录
│       ├── __init__.py
│       ├── auth_service.py     # 🔑 认证服务
│       └── user_service.py     # 👨‍💼 用户管理服务
│
├── alembic/                     # 📊 数据库迁移目录
│   ├── versions/               # 🗂️ 迁移版本文件
│   └── env.py                  # 🌍 Alembic环境配置
│
├── alembic.ini                  # ⚙️ Alembic配置文件
└── README.md                   # 📖 项目说明文档
```

## 📚 目录详细说明

### 🏠 `/app` - 应用主目录
项目的核心代码目录，包含所有业务逻辑和应用组件。

#### 📄 核心文件

| 文件 | 职责 | 主要内容                         |
|------|------|------------------------------|
| `main.py` | 应用入口点 | FastAPI应用实例创建、路由注册、中间件配置     |
| `config.py` | 配置管理 | 数据库连接、JWT密钥、应用设置等配置项         |
| `database.py` | 数据库配置 | SQLAlchemy引擎、数据库会话管理、数据库Base类 |
| `dependencies.py` | 依赖注入 | 数据库会话、用户认证、权限验证等依赖函数         |

### 🛣️ `/app/routers` - 路由模块
负责HTTP请求的路由分发和响应处理，按功能模块组织。

| 文件 | 功能模块 | API端点 | 说明 |
|------|----------|---------|------|
| `auth.py` | 认证模块 | `/auth/login`<br>`/auth/me` | 用户登录、获取当前用户信息 |
| `users.py` | 用户管理 | `/users/register`<br>`/users/{username}` | 用户注册、删除用户 |

**路由文件职责：**
- 定义API端点和HTTP方法
- 请求参数验证和响应格式化
- 调用相应的服务层处理业务逻辑
- 错误处理和状态码返回

### 🎯 `/app/models` - 数据模型
定义数据库表结构和ORM模型，使用SQLAlchemy。

| 文件 | 模型 | 数据表 | 字段 |
|------|------|--------|------|
| `user.py` | User | users | id, username, hashed_password, role |

**模型文件职责：**
- 定义数据库表结构
- 设置字段类型、约束和关系
- 提供ORM查询接口
- 数据库迁移的基础

### 📋 `/app/schemas` - 数据验证模式
使用Pydantic定义API请求/响应的数据结构和验证规则。

| 文件 | 模式类 | 用途 |
|------|--------|------|
| `auth.py` | `LoginInput`<br>`Token`<br>`UserResponse` | 登录请求、令牌响应、用户信息响应 |

**模式文件职责：**
- API请求参数验证
- 响应数据序列化
- 数据类型转换和格式化
- 自动生成API文档

### 🔧 `/app/services` - 业务逻辑服务
封装核心业务逻辑，独立于HTTP层，便于测试和复用。

| 文件 | 服务类 | 主要功能 |
|------|--------|----------|
| `auth_service.py` | `AuthService` | 密码哈希、用户认证、JWT令牌管理 |
| `user_service.py` | `UserService` | 用户创建、删除、权限验证 |

**服务层职责：**
- 核心业务逻辑实现
- 数据库操作封装
- 业务规则验证
- 异常处理和错误消息

### 📊 `/alembic` - 数据库迁移
使用Alembic管理数据库版本和结构变更。

| 文件/目录 | 职责 |
|-----------|------|
| `versions/` | 存储数据库迁移脚本 |
| `env.py` | Alembic运行环境配置 |
| `alembic.ini` | Alembic工具配置文件 |


### 🎯 分层架构

| 层级 | 职责 | 不应包含 |
|------|------|----------|
| **路由层** | HTTP处理、参数验证、响应格式化 | 业务逻辑、数据库操作 |
| **服务层** | 业务逻辑、权限控制、事务管理 | HTTP相关代码、具体数据库查询 |
| **模型层** | 数据结构、基础CRUD操作 | 复杂业务逻辑、HTTP处理 |

### 🔄 数据流向
```
HTTP请求 → 路由层 → 服务层 → 模型层 → 数据库
                    ↓
HTTP响应 ← 路由层 ← 服务层 ← 模型层 ← 数据库
```

## 🚀 快速开始

### 📋 环境要求
- Python 3.8+
- PostgreSQL 数据库

### 🔧 安装依赖
```bash
pip install -r requirements.txt
conda install -r requirements.txt
```

### 🗄️ 数据库迁移
```bash
# 初始化Alembic（仅第一次）
alembic init alembic

# 创建迁移文件
alembic revision --autogenerate -m "Initial migration"

# 执行迁移
alembic upgrade head
```

### 🏃‍♂️ 启动应用
```bash
uvicorn app.main:app --reload
```

访问 `http://localhost:8000/docs` 查看API文档。


## 🧪 开发指南

### ➕ 添加新功能
1. **创建数据模型** - 在 `models/` 中定义
2. **定义数据模式** - 在 `schemas/` 中创建
3. **实现业务逻辑** - 在 `services/` 中编写
4. **创建路由接口** - 在 `routers/` 中定义
5. **注册路由** - 在 `main.py` 中添加