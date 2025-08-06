# Process Types API 使用说明

## 概述

这个功能允许根据用户ID动态获取对应的process_types，替代了之前硬编码的"进站申请"等流程类型。

## 新增的API接口

### 1. 获取当前用户的process_types

**接口**: `GET /api/enterWorkstation/my-process-types`

**功能**: 获取当前登录用户的process_types

**权限**: 所有已登录用户

**响应示例**:
```json
{
  "user_id": 1,
  "process_types": {
    "entry_application": "进站申请",
    "entry_assessment": "进站考核",
    "entry_agreement": "进站协议",
    "midterm_assessment": "中期考核",
    "annual_assessment": "年度考核",
    "extension_assessment": "延期考核",
    "leave_assessment": "出站考核"
  }
}
```

### 2. 根据用户ID获取process_types

**接口**: `GET /api/enterWorkstation/process-types/{user_id}`

**功能**: 根据指定用户ID获取对应的process_types

**权限**: 管理员、导师（只能查看自己的学生）、用户本人

**参数**:
- `user_id`: 用户ID (路径参数)

**响应示例**:
```json
{
  "user_id": 1,
  "process_types": {
    "entry_application": "进站申请",
    "entry_assessment": "进站考核",
    "entry_agreement": "进站协议",
    "midterm_assessment": "中期考核",
    "annual_assessment": "年度考核",
    "extension_assessment": "延期考核",
    "leave_assessment": "出站考核"
  }
}
```

## 客户端使用示例

### 1. 导入API函数

```typescript
import { getMyProcessTypes, getProcessTypesByUserId } from '@/api/enterWorkstation'
```

### 2. 获取当前用户的process_types

```typescript
const fetchMyProcessTypes = async () => {
  try {
    const response = await getMyProcessTypes()
    if (response.data) {
      console.log('我的process_types:', response.data.process_types)
      // 将process_types转换为菜单格式
      const menuList = Object.entries(response.data.process_types).map(([key, label]) => ({
        label: label as string,
        key: key
      }))
      return menuList
    }
  } catch (error) {
    console.error('获取process_types失败:', error)
  }
}
```

### 3. 根据用户ID获取process_types

```typescript
const fetchUserProcessTypes = async (userId: number) => {
  try {
    const response = await getProcessTypesByUserId(userId)
    if (response.data) {
      console.log(`用户${userId}的process_types:`, response.data.process_types)
      return response.data.process_types
    }
  } catch (error) {
    console.error('获取用户process_types失败:', error)
  }
}
```

## 在页面中使用

### 动态菜单示例

```typescript
export default defineComponent({
  setup() {
    const menuList = ref([])
    const activeMenu = ref('entry_application')
    
    const fetchProcessTypes = async () => {
      try {
        const response = await getMyProcessTypes()
        if (response.data && response.data.process_types) {
          // 将process_types转换为菜单格式
          const dynamicMenuList = Object.entries(response.data.process_types).map(([key, label]) => ({
            label: label as string,
            key: key
          }))
          menuList.value = dynamicMenuList
        }
      } catch (error) {
        console.error('获取process_types失败:', error)
      }
    }
    
    onMounted(() => {
      fetchProcessTypes()
    })
    
    return () => (
      <ElMenu onSelect={(key) => activeMenu.value = key}>
        {menuList.value.map(item => (
          <ElMenuItem index={item.key}>
            {item.label}
          </ElMenuItem>
        ))}
      </ElMenu>
    )
  }
})
```

## 权限控制

- **学生用户**: 可以查看自己的所有process_types
- **导师用户**: 可以查看自己的所有process_types，也可以查看自己学生的process_types
- **管理员用户**: 可以查看所有用户的process_types

## 错误处理

- 如果用户不存在，返回空的process_types对象
- 如果权限不足，返回403错误
- 如果导师尝试查看非自己学生的process_types，返回403错误
- 如果token无效，返回401错误

## 测试

可以使用 `/Example` 页面来测试这些API接口的功能。 