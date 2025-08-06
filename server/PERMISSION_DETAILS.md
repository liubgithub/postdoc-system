# Process Types API 权限控制详细说明

## 权限控制逻辑

### 1. 获取当前用户的process_types
**接口**: `GET /api/enterWorkstation/my-process-types`

**权限**: 所有已登录用户都可以访问

**逻辑**: 
- 直接返回当前登录用户的process_types
- 不需要额外的权限检查

### 2. 根据用户ID获取process_types
**接口**: `GET /api/enterWorkstation/process-types/{user_id}`

**权限控制逻辑**:

#### 学生用户 (role = "user")
- ✅ **可以查看**: 自己的process_types
- ❌ **不能查看**: 其他用户的process_types
- **错误信息**: "学生只能查看自己的process_types"

#### 导师用户 (role = "teacher")
- ✅ **可以查看**: 自己的process_types
- ✅ **可以查看**: 自己学生的process_types
- ❌ **不能查看**: 非自己学生的process_types
- **验证逻辑**: 通过`check_supervisor_student_relationship()`函数检查导师-学生关系
- **错误信息**: "只能查看自己学生的process_types"

#### 管理员用户 (role = "admin")
- ✅ **可以查看**: 所有用户的process_types
- **无限制**: 管理员可以查看任何用户的process_types

## 数据库关系验证

### SupervisorStudent 表结构
```sql
CREATE TABLE supervisor_student (
    id INTEGER PRIMARY KEY,
    supervisor_id INTEGER NOT NULL,  -- 导师ID
    student_id INTEGER NOT NULL,     -- 学生ID
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 验证函数
```python
def check_supervisor_student_relationship(supervisor_id: int, student_id: int, db: Session) -> bool:
    """检查导师和学生的关系"""
    relationship = db.query(SupervisorStudent).filter(
        SupervisorStudent.supervisor_id == supervisor_id,
        SupervisorStudent.student_id == student_id
    ).first()
    return relationship is not None
```

## 测试场景

### 场景1: 学生查看自己的process_types
- **用户**: 学生 (ID: 1)
- **目标**: 查看自己的process_types
- **期望结果**: ✅ 成功 (200)
- **响应**: 返回该学生的process_types

### 场景2: 学生查看其他学生的process_types
- **用户**: 学生 (ID: 1)
- **目标**: 查看学生 (ID: 2) 的process_types
- **期望结果**: ❌ 失败 (403)
- **错误信息**: "学生只能查看自己的process_types"

### 场景3: 导师查看自己学生的process_types
- **用户**: 导师 (ID: 10)
- **目标**: 查看学生 (ID: 1) 的process_types
- **前提**: 存在导师-学生关系 (supervisor_id=10, student_id=1)
- **期望结果**: ✅ 成功 (200)
- **响应**: 返回该学生的process_types

### 场景4: 导师查看非自己学生的process_types
- **用户**: 导师 (ID: 10)
- **目标**: 查看学生 (ID: 999) 的process_types
- **前提**: 不存在导师-学生关系
- **期望结果**: ❌ 失败 (403)
- **错误信息**: "只能查看自己学生的process_types"

### 场景5: 管理员查看任何学生的process_types
- **用户**: 管理员 (ID: 100)
- **目标**: 查看任何学生的process_types
- **期望结果**: ✅ 成功 (200)
- **响应**: 返回该学生的process_types

## 错误处理

### 403 Forbidden 错误
- **学生查看其他学生**: "学生只能查看自己的process_types"
- **导师查看非自己学生**: "只能查看自己学生的process_types"

### 404 Not Found 错误
- **用户不存在**: 返回空的process_types对象

### 401 Unauthorized 错误
- **Token无效**: "无效的认证凭据"

## 使用示例

### 导师查看学生process_types
```typescript
// 导师查看学生ID为1的process_types
const response = await getProcessTypesByUserId(1)
if (response.data) {
    console.log('学生process_types:', response.data.process_types)
}
```

### 管理员查看任何用户process_types
```typescript
// 管理员查看用户ID为999的process_types
const response = await getProcessTypesByUserId(999)
if (response.data) {
    console.log('用户process_types:', response.data.process_types)
}
```

### 学生查看自己的process_types
```typescript
// 学生查看自己的process_types
const response = await getMyProcessTypes()
if (response.data) {
    console.log('我的process_types:', response.data.process_types)
}
```

## 安全考虑

1. **权限验证**: 每次API调用都会验证用户权限
2. **关系验证**: 导师只能查看自己学生的数据
3. **角色隔离**: 不同角色有不同的访问权限
4. **错误信息**: 不暴露敏感信息，只返回必要的错误提示 