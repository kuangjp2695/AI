---
name: api-doc-generator
description: 根据 Express 路由和 Controller 代码自动生成 API 文档，支持 Markdown 和 OpenAPI 格式
---

# API 文档生成技能 (API Doc Generator)

## 何时使用（When）

当需要为以下情况生成 API 文档时使用此技能：
- 新 API 开发完成后需要补充文档
- API 变更后需要更新文档
- 项目初期需要完整的 API 文档
- 用户明确要求生成 API 文档时
- 前端开发者需要 API 接口说明

**不要在以下情况使用**：
- 内部私有方法（非 HTTP 接口）
- 中间件或工具函数
- 只是询问 API 设计思路

---

## 如何执行（How）

### 文档生成流程

#### 1. 分析路由定义
- 读取 `src/routes/` 目录下的路由文件
- 解析 HTTP 方法、路径、中间件
- 关联对应的 Controller 方法

#### 2. 分析 Controller 代码
- 解析请求参数（query, params, body）
- 解析响应格式和状态码
- 识别错误类型和对应的 HTTP 状态码
- 提取 JSDoc 注释作为描述

#### 3. 分析数据模型
- 读取 DTO/接口定义
- 识别字段类型、是否必填、默认值
- 识别枚举值和取值范围

#### 4. 生成文档

### 文档格式规范

#### Markdown 格式

```markdown
# API 文档

## 任务管理 API

### 获取任务列表

获取分页的任务列表，支持筛选和排序。

**接口地址**：`GET /api/tasks`

**请求参数**

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| page | query | number | 否 | 1 | 页码 |
| limit | query | number | 否 | 20 | 每页数量 |
| status | query | string | 否 | - | 任务状态筛选 |
| priority | query | string | 否 | - | 优先级筛选 |
| sortBy | query | string | 否 | createdAt | 排序字段 |
| sortOrder | query | string | 否 | desc | 排序方向 |

**响应示例** (200 OK)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "task-123",
        "title": "完成项目文档",
        "status": "in-progress",
        "priority": "high",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "success"
}
\```

**错误响应**

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | VALIDATION_ERROR | 参数校验失败 |
| 500 | INTERNAL_ERROR | 服务器内部错误 |
```

### OpenAPI/Swagger 格式 (JSON)

生成符合 OpenAPI 3.0 规范的 JSON 文档。

### 文档结构

```
docs/
├── api/
│   ├── README.md          # API 文档总览
│   ├── tasks.md           # 任务管理 API
│   ├── users.md           # 用户管理 API
│   └── openapi.json       # OpenAPI 规范文件
└── README.md              # 项目文档入口
```

---

## 产出什么（What）

产出完整的 API 文档，包含：
1. 每个 API 端点的详细说明
2. 请求参数说明（路径、查询、请求体）
3. 响应格式和示例
4. 错误码说明
5. 数据模型定义
6. 使用示例和最佳实践

### 文档质量标准

- **完整性**：所有公共 API 都有文档
- **准确性**：文档与实际代码一致
- **可读性**：示例清晰，说明易懂
- **可维护性**：结构化组织，便于更新

---

## 参考文件

- `.trae/rules/backend/api-design.md` - API 设计规范
- `src/routes/` - 路由定义
- `src/controllers/` - Controller 代码
- `src/types/` - 类型定义
- `src/validators/` - 参数校验定义
