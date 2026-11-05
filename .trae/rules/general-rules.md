# 通用开发规则

> 适用于本项目所有开发工作的通用规则和最佳实践。

---

## 1. 代码质量

### 1.1 基本原则

- **可读性优先**：代码首先是写给人看的，其次才是给机器执行的
- **单一职责**：每个函数、类、模块只做一件事
- **最小惊讶**：代码行为应符合用户/开发者的直觉预期
- **DRY 原则**：不要重复自己，抽象公共逻辑

### 1.2 函数设计

- 函数参数不超过 3 个，超过时使用对象参数
- 函数体长度控制在 30 行以内
- 避免深层嵌套（超过 3 层需要重构）
- 使用早返回（early return）减少嵌套

```typescript
// 推荐：早返回
function processTask(task: Task): Result {
  if (!task) {
    return { success: false, error: '任务不存在' }
  }
  
  if (task.status === 'cancelled') {
    return { success: false, error: '任务已取消' }
  }
  
  // 核心逻辑
  return { success: true, data: task }
}

// 不推荐：深层嵌套
function processTask(task: Task): Result {
  if (task) {
    if (task.status !== 'cancelled') {
      // 核心逻辑
      return { success: true, data: task }
    } else {
      return { success: false, error: '任务已取消' }
    }
  } else {
    return { success: false, error: '任务不存在' }
  }
}
```

### 1.3 注释规范

- **为什么** > **做什么** > **怎么做**
- 公共 API 必须有 JSDoc 注释
- 复杂算法必须有算法说明和复杂度分析
- 业务规则注释需要说明业务背景和来源
- 不写"代码自解释"的废话注释

---

## 2. 版本控制

### 2.1 分支策略

- `main`: 主分支，始终保持可部署状态
- `develop`: 开发分支，集成最新功能
- `feature/*`: 功能分支，从 develop 切出
- `bugfix/*`: Bug 修复分支
- `hotfix/*`: 紧急修复分支，从 main 切出

### 2.2 提交信息

使用 Conventional Commits 规范：

```
feat(task): 添加任务优先级排序功能
fix(api): 修复任务列表分页参数校验问题
docs(readme): 更新快速开始指南
refactor(service): 重构任务创建逻辑
test(controller): 补充任务控制器单元测试
chore(deps): 升级 express 到 4.18.2
```

### 2.3 代码合并

- 合并前必须通过 CI 检查（lint + test + build）
- 至少一人 Code Review 通过
- 使用 Squash Merge 保持历史整洁
- 合并后删除源分支

---

## 3. 错误处理

### 3.1 错误分类

| 类型 | 场景 | HTTP 状态码 |
|------|------|------------|
| ValidationError | 参数校验失败 | 400 |
| UnauthorizedError | 未认证 | 401 |
| ForbiddenError | 无权限 | 403 |
| NotFoundError | 资源不存在 | 404 |
| ConflictError | 资源冲突 | 409 |
| BusinessError | 业务规则错误 | 422 |
| InternalError | 系统内部错误 | 500 |

### 3.2 错误处理原则

- 不要吞掉错误，至少要记录日志
- 异步操作必须有错误处理
- 向用户返回的错误信息要友好且安全
- 内部错误详情只记录到日志，不返回给前端

---

## 4. 性能考量

- 避免在循环中做复杂计算
- 合理使用缓存
- 大列表必须分页
- 数据库查询必须使用索引
- 避免 N+1 查询问题

---

## 5. 安全考量

- 永远不要信任用户输入
- 敏感数据加密存储
- 密钥和凭证不写入代码库
- 使用环境变量管理配置
- 防止 SQL 注入、XSS、CSRF 等常见攻击

---

## 6. 日志规范

### 6.1 日志级别

- `error`: 错误日志，系统故障、异常情况
- `warn`: 警告日志，潜在问题但不影响运行
- `info`: 信息日志，关键业务节点
- `debug`: 调试日志，开发调试用详细信息
- `verbose`: 详细日志，最详尽的调试信息

### 6.2 日志内容

每条日志应包含：
- 时间戳
- 日志级别
- 模块/上下文
- 消息内容
- 相关数据（可选）
- 错误堆栈（error 级别）

### 6.3 禁止事项

- 不记录密码、密钥等敏感信息
- 不记录完整的用户个人信息
- 不在循环中大量打日志
- 不使用 console.log 替代日志库

---

*适用于：本项目所有代码和文档*
