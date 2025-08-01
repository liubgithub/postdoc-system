# 时间过滤功能

这个模块提供了根据时间过滤获取 `bs_pre_entry_` 表数据的功能。

## 功能说明

### 1. 获取当前用户数据
- **端点**: `GET /userinfoRegister/time-filter/get-data-after-time`
- **参数**: 
  - `target_time`: 目标时间（ISO格式，如：2024-01-01T00:00:00）
- **权限**: 需要用户登录
- **功能**: 获取当前用户在指定时间之后的所有 `bs_pre_entry_` 表数据

### 2. 管理员获取指定用户数据
- **端点**: `GET /userinfoRegister/time-filter/get-data-by-user/{user_id}`
- **参数**: 
  - `user_id`: 目标用户ID
  - `target_time`: 目标时间（ISO格式）
- **权限**: 需要管理员权限
- **功能**: 管理员获取指定用户在指定时间之后的所有 `bs_pre_entry_` 表数据

## 支持的表格

系统会自动遍历以下9张表：

1. `bs_pre_entry_book` - 著作
2. `bs_pre_entry_competition_award` - 竞赛获奖
3. `bs_pre_entry_conference` - 会议
4. `bs_pre_entry_new_variety` - 新品种
5. `bs_pre_entry_paper` - 论文
6. `bs_pre_entry_patent` - 专利
7. `bs_pre_entry_project` - 项目
8. `bs_pre_entry_subject_research` - 课题研究
9. `bs_pre_entry_industry_standard` - 行业标准

## 时间字段处理

所有表的 `time` 字段都是 DateTime 类型，直接与目标时间进行比较，获取指定时间之后的数据。

## 返回数据格式

```json
{
  "user_id": 1,
  "target_time": "2024-01-01T00:00:00",
  "tables": {
    "bs_pre_entry_book": {
      "display_name": "著作",
      "count": 2,
      "data": [
        {
          "id": 1,
          "user_id": 1,
          "time": "2024-02-01T10:00:00",
          "著作中文名": "示例著作",
          // ... 其他字段
        }
      ]
    },
    // ... 其他表的数据
  },
  "total_count": 15
}
```

## 使用示例

### 1. 用户获取自己的数据
```bash
curl -X GET "http://localhost:8000/userinfoRegister/time-filter/get-data-after-time?target_time=2024-01-01T00:00:00" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. 管理员获取指定用户数据
```bash
curl -X GET "http://localhost:8000/userinfoRegister/time-filter/get-data-by-user/1?target_time=2024-01-01T00:00:00" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 错误处理

- 如果某个表查询出错，会在返回结果中包含错误信息
- 权限不足会返回 403 错误
- 无效的 token 会返回 401 错误

## 注意事项

1. 时间参数必须是有效的 ISO 格式
2. 所有表的 time 字段都是 DateTime 类型，统一处理
3. 返回的 DateTime 字段会被转换为 ISO 格式字符串
4. 管理员功能需要管理员权限 