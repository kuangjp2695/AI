# 后端开发规范

> Express + TypeScript 后端开发的架构规范和最佳实践。

---

## 1. 分层架构

### 1.1 架构分层

```
┌─────────────────────────────┐
│     Routes (路由层)          │  定义 API 路径，参数映射
├─────────────────────────────┤
│  Controllers (控制层)        │  请求处理，参数校验，响应格式化
├─────────────────────────────┤
│   Services (服务层)          │  业务逻辑，核心处理
├─────────────────────────────┤
│   Models/Repository (数据层) │  数据模型，数据访问
└─────────────────────────────┘
```

### 1.2 分层规则

- **单向依赖**：上层依赖下层，下层不依赖上层
- **接口隔离**：每层之间通过接口通信
- **职责单一**：每层只做自己的事

### 1.3 禁止事项

- Controller 中不能有业务逻辑
- Service 中不能处理 HTTP 请求/响应
- 不能跨层直接调用（Controller → Model）
- 循环依赖

---

## 2. 路由层 (Routes)

### 2.1 路由定义

- 每个资源一个路由文件
- 使用 RESTful 命名规范
- 路由参数使用 `:paramName` 格式
- 中间件在路由中挂载

```typescript
// src/routes/task.routes.ts
import { Router } from 'express'
import { taskController } from '../controllers/task.controller'
import { validateRequest } from '../middleware/validate-request'
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator'

const router = Router()

router.get('/', taskController.getTasks)
router.get('/:id', taskController.getTaskById)
router.post('/', validateRequest(createTaskSchema), taskController.createTask)
router.put('/:id', validateRequest(updateTaskSchema), taskController.updateTask)
router.delete('/:id', taskController.deleteTask)
router.patch('/:id/status', taskController.updateTaskStatus)

export const taskRoutes = router
```

### 2.2 URL 命名规范

- 使用名词复数：`/tasks`, `/users`
- 嵌套资源：`/tasks/:taskId/comments`
- 动作用子资源：`/tasks/:id/status`
- 搜索用 query 参数

---

## 3. 控制层 (Controllers)

### 3.1 职责

- 解析请求参数（query, params, body）
- 调用 Service 层处理业务
- 格式化响应数据
- 处理异常并返回合适的 HTTP 状态码

### 3.2 代码规范

- Controller 方法要薄，不超过 20 行
- 参数校验交给中间件或 validator
- 统一使用响应格式化函数
- 错误使用 try/catch 捕获并转换

```typescript
// src/controllers/task.controller.ts
import { Request, Response, NextFunction } from 'express'
import { taskService } from '../services/task.service'
import { successResponse, errorResponse } from '../utils/response'

export class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, status, priority } = req.query
      const result = await taskService.getTasks({
        page: Number(page),
        limit: Number(limit),
        status: status as string | undefined,
        priority: priority as string | undefined
      })
      successResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.createTask(req.body)
      successResponse(res, task, '任务创建成功', 201)
    } catch (error) {
      next(error)
    }
  }
}

export const taskController = new TaskController()
```

---

## 4. 服务层 (Services)

### 4.1 职责

- 实现核心业务逻辑
- 业务规则校验
- 调用数据层获取/保存数据
- 事务管理（如有）

### 4.2 代码规范

- Service 类使用依赖注入
- 业务规则明确抛出业务异常
- 复杂逻辑拆分为私有方法
- 每个方法职责单一

```typescript
// src/services/task.service.ts
import { ITaskRepository } from '../repositories/task.repository'
import { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../types/task.types'
import { BusinessError, NotFoundError } from '../utils/errors'
import { validateTaskTransition } from '../utils/task-state-machine'

export class TaskService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      id: generateId(),
      title: dto.title,
      description: dto.description || '',
      status: TaskStatus.PENDING,
      priority: dto.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return this.taskRepository.create(task)
  }

  async updateTaskStatus(id: string, newStatus: TaskStatus): Promise<Task> {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new NotFoundError('任务不存在')
    }

    if (!validateTaskTransition(task.status, newStatus)) {
      throw new BusinessError(`不允许从 ${task.status} 变更为 ${newStatus}`)
    }

    task.status = newStatus
    task.updatedAt = new Date()
    
    return this.taskRepository.update(id, task)
  }
}
```

---

## 5. 中间件 (Middleware)

### 5.1 常见中间件

- `errorHandler`: 全局错误处理
- `validateRequest`: 请求参数校验
- `authMiddleware`: 认证鉴权
- `rateLimiter`: 限流
- `requestLogger`: 请求日志

### 5.2 错误处理中间件

```typescript
// src/middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express'
import { BaseError, ValidationError, NotFoundError, BusinessError } from '../utils/errors'
import { errorResponse } from '../utils/response'
import { logger } from '../utils/logger'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`请求错误: ${error.message}`, {
    url: req.url,
    method: req.method,
    stack: error.stack
  })

  if (error instanceof ValidationError) {
    errorResponse(res, error.message, 400, error.details)
    return
  }

  if (error instanceof NotFoundError) {
    errorResponse(res, error.message, 404)
    return
  }

  if (error instanceof BusinessError) {
    errorResponse(res, error.message, 422)
    return
  }

  // 未知错误
  errorResponse(res, '服务器内部错误', 500)
}
```

---

## 6. 数据验证

使用 Zod 进行请求参数校验：

```typescript
// src/validators/task.validator.ts
import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional()
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional()
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
```

---

## 7. API 响应格式

### 7.1 成功响应

```json
{
  "success": true,
  "data": {
    "id": "task-123",
    "title": "完成项目文档",
    "status": "in-progress"
  },
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 7.2 分页响应

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "success"
}
```

### 7.3 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数校验失败",
    "details": [
      {
        "field": "title",
        "message": "标题不能为空"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

*适用于：src/ 目录下所有后端代码*
