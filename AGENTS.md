# 任务管理系统 - AI 协作规范

> 本文档定义了 AI 助手在本项目中的工作规范、代码标准和协作流程。
> 适用于所有 AI 编码助手（TRAE IDE Agent、Claude、Cursor 等）。

---

## 1. 项目概览

**项目名称**：任务管理系统 (Task Management System)

**技术栈**：
- 后端：Node.js + TypeScript + Express
- 数据验证：Zod
- 日志：Winston
- 测试：Jest + ts-jest
- 代码质量：ESLint + Prettier

**核心功能**：
- 任务的 CRUD 操作
- 任务状态管理（待办/进行中/已完成/已取消）
- 任务优先级管理
- 任务标签分类
- 任务搜索和筛选

---

## 2. 编码规范

### 2.1 TypeScript 规范

- **严格模式**：始终启用 `strict: true`
- **类型优先**：优先使用类型注解，避免 `any` 类型
- **接口定义**：使用 `interface` 定义对象形状，`type` 用于联合类型和工具类型
- **函数返回类型**：始终显式声明函数返回类型
- **错误处理**：使用自定义错误类，不直接 throw Error 字符串

### 2.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getUserById`, `taskList` |
| 类/接口 | PascalCase | `TaskService`, `ITaskRepository` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| 类型别名 | PascalCase，前缀 T | `TTaskStatus`, `TPriority` |
| 枚举 | PascalCase | `TaskStatus`, `PriorityLevel` |
| 文件 | kebab-case | `task-controller.ts`, `task.model.ts` |

### 2.3 代码组织

```
src/
├── controllers/   # 请求处理层，参数校验，返回响应
├── services/      # 业务逻辑层，核心业务处理
├── models/        # 数据模型层，数据结构定义
├── routes/        # 路由定义层，API 路径映射
├── middleware/    # 中间件层，通用横切关注点
├── utils/         # 工具函数层，通用辅助方法
└── types/         # 类型定义层，全局类型声明
```

**分层原则**：
- Controller 只做参数校验和响应格式化
- Service 层包含所有业务逻辑
- 不允许 Controller 直接调用 Model
- 依赖方向：Controller → Service → Model

---

## 3. 提交规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type 类型**：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关
- `ci`: CI/CD 相关

---

## 4. 测试规范

- **单元测试**：每个 Service 必须有对应的单元测试，覆盖率 ≥ 80%
- **测试命名**：`describe('功能描述', () => { it('预期行为', () => {}) })`
- **测试文件**：与源文件同名，后缀 `.test.ts`，放在 `tests/` 目录对应位置
- **AAA 模式**：Arrange → Act → Assert

---

## 5. API 设计规范

### 5.1 RESTful 规范

- 使用名词复数：`/tasks`, `/users`
- 动作通过 HTTP 方法表达：GET/POST/PUT/PATCH/DELETE
- 分页使用 query 参数：`?page=1&limit=20`
- 筛选使用 query 参数：`?status=completed&priority=high`

### 5.2 响应格式

**成功响应**：
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

**失败响应**：
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数校验失败",
    "details": []
  }
}
```

---

## 6. 安全规范

- 所有用户输入必须经过 Zod 校验
- 敏感信息（密码、密钥）不得出现在日志中
- API 必须设置合理的速率限制
- 使用 helmet 设置安全头
- CORS 配置必须限制允许的域名

---

## 7. 性能规范

- 数据库查询必须使用索引
- 避免 N+1 查询问题
- 大列表必须分页
- 使用缓存优化热点数据
- 异步操作必须正确处理错误

---

## 8. 文档规范

- 公共 API 必须有 JSDoc 注释
- 复杂业务逻辑必须有行内注释说明原因
- README 必须包含：项目介绍、快速开始、API 文档
- 重大变更必须更新 CHANGELOG.md

---

## 9. AI 协作指南

### 9.1 代码生成

1. 生成代码前先理解现有代码结构和模式
2. 遵循项目已有的编码风格和命名约定
3. 生成的代码必须包含必要的类型注解
4. 复杂逻辑必须包含注释说明

### 9.2 代码审查

1. 检查代码是否符合本规范
2. 检查是否有明显的 bug 或逻辑错误
3. 检查是否有性能问题
4. 检查是否有安全漏洞
5. 检查测试覆盖率是否达标

### 9.3 重构

1. 重构前确保有完整的测试覆盖
2. 小步重构，每次重构只做一件事
3. 重构后运行测试确保功能不变
4. 重构应保持对外接口兼容

---

## 10. 项目特定规则

### 10.1 任务状态流转

```
pending → in-progress → completed
    ↓         ↓
cancelled ←──┘
```

- 不允许从 `completed` 直接回到 `pending`
- 取消的任务不能重新激活
- 状态变更必须记录变更时间和操作人

### 10.2 优先级定义

- `low`: 低优先级，不影响核心功能
- `medium`: 中优先级，常规任务
- `high`: 高优先级，需要尽快处理
- `urgent`: 紧急优先级，阻塞其他工作

---

*最后更新：2026-11-05*
