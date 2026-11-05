# 测试规范

> 本项目测试的编写规范、最佳实践和覆盖率要求。

---

## 1. 测试类型

| 类型 | 位置 | 目标 | 覆盖率要求 |
|------|------|------|-----------|
| 单元测试 | `tests/unit/` | 单个函数/类 | ≥ 80% |
| 集成测试 | `tests/integration/` | 模块间协作 | ≥ 60% |
| E2E 测试 | `tests/e2e/` | 完整 API 流程 | 关键路径覆盖 |

---

## 2. 单元测试规范

### 2.1 测试文件结构

- 测试文件与源文件一一对应
- 命名格式：`{source-name}.test.ts`
- 目录结构与 src/ 保持一致

```
src/
├── services/
│   └── task.service.ts
tests/
└── unit/
    └── services/
        └── task.service.test.ts
```

### 2.2 AAA 模式

每个测试用例遵循 Arrange-Act-Assert 结构：

```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('应该成功创建任务', () => {
      // Arrange - 准备测试数据和环境
      const mockRepository = createMockTaskRepository()
      const service = new TaskService(mockRepository)
      const taskData = { title: '测试任务', priority: 'medium' }

      // Act - 执行被测试的操作
      const result = service.createTask(taskData)

      // Assert - 验证结果
      expect(result).toBeDefined()
      expect(result.title).toBe('测试任务')
      expect(result.status).toBe('pending')
    })
  })
})
```

### 2.3 describe/it 命名规范

- `describe`: 描述被测试的单元（类名/函数名）
- `it`: 描述预期的行为，以"应该"开头

```typescript
describe('TaskService', () => {
  describe('#createTask', () => {
    it('应该创建一个状态为 pending 的新任务', () => {})
    it('应该在标题为空时抛出验证错误', () => {})
    it('应该为任务生成唯一 ID', () => {})
  })

  describe('#updateTaskStatus', () => {
    it('应该成功更新任务状态', () => {})
    it('应该在状态流转不合法时抛出错误', () => {})
    it('应该在任务不存在时抛出 NotFoundError', () => {})
  })
})
```

### 2.4 测试用例粒度

- 每个 it 只测试一个行为
- 一个功能点对应多个测试用例
- 覆盖正常路径、边界情况、异常情况

---

## 3. Mock 规范

### 3.1 Mock 原则

- 只 mock 直接依赖，不 mock 间接依赖
- 使用真实实现优先，mock 其次
- mock 对象行为要符合真实接口契约

### 3.2 Mock 工具

- 使用 Jest 内置的 mock 功能
- 复杂 mock 使用 `jest.mocked()`
- 接口 mock 使用类型辅助

```typescript
import { TaskService } from '../../src/services/task.service'
import { ITaskRepository } from '../../src/repositories/task.repository'

// 创建 mock
const mockTaskRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
} as jest.Mocked<ITaskRepository>

describe('TaskService', () => {
  let service: TaskService

  beforeEach(() => {
    // 每个测试前重置 mock
    jest.clearAllMocks()
    service = new TaskService(mockTaskRepository)
  })

  describe('#getTaskById', () => {
    it('应该返回找到的任务', async () => {
      // Arrange
      const mockTask = { id: '1', title: '测试任务', status: 'pending' }
      mockTaskRepository.findById.mockResolvedValue(mockTask)

      // Act
      const result = await service.getTaskById('1')

      // Assert
      expect(result).toEqual(mockTask)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith('1')
    })

    it('应该在任务不存在时返回 null', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(null)

      // Act
      const result = await service.getTaskById('999')

      // Assert
      expect(result).toBeNull()
    })
  })
})
```

---

## 4. 测试数据工厂

使用测试数据工厂创建测试数据，避免重复代码：

```typescript
// tests/utils/factories/task.factory.ts
import { Task, TaskStatus, TaskPriority } from '../../../src/types/task.types'
import { v4 as uuidv4 } from 'uuid'

interface TaskFactoryOptions {
  id?: string
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  createdAt?: Date
  updatedAt?: Date
}

export function createTaskFactory(options: TaskFactoryOptions = {}): Task {
  return {
    id: options.id || uuidv4(),
    title: options.title || '默认测试任务',
    description: options.description || '这是一个测试任务的描述',
    status: options.status || TaskStatus.PENDING,
    priority: options.priority || 'medium',
    tags: [],
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date()
  }
}

export function createTaskListFactory(count: number, options?: TaskFactoryOptions): Task[] {
  return Array.from({ length: count }, (_, index) =>
    createTaskFactory({
      ...options,
      title: options?.title ? `${options.title} ${index + 1}` : `测试任务 ${index + 1}`
    })
  )
}
```

---

## 5. 集成测试规范

### 5.1 测试范围

- API 端到端测试
- 数据库操作集成
- 服务间协作测试

### 5.2 测试环境

- 使用独立的测试数据库
- 每个测试用例后清理数据
- 使用测试配置覆盖生产配置

### 5.3 API 测试示例

```typescript
// tests/integration/task.api.test.ts
import request from 'supertest'
import { app } from '../../src/app'
import { setupTestDatabase, teardownTestDatabase } from '../utils/test-db'

describe('Task API', () => {
  beforeAll(async () => {
    await setupTestDatabase()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  describe('POST /api/tasks', () => {
    it('应该创建新任务并返回 201', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: '集成测试任务',
          description: '这是一个集成测试',
          priority: 'high'
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe('集成测试任务')
      expect(response.body.data.status).toBe('pending')
    })

    it('应该在标题为空时返回 400', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })
})
```

---

## 6. 覆盖率要求

| 指标 | 要求 |
|------|------|
| 语句覆盖率 | ≥ 80% |
| 分支覆盖率 | ≥ 75% |
| 函数覆盖率 | ≥ 80% |
| 行覆盖率 | ≥ 80% |

### 6.1 排除文件

- 类型定义文件 (`.d.ts`)
- 入口文件 (`server.ts`, `app.ts`)
- 配置文件
- 第三方库封装

### 6.2 Jest 配置

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "roots": ["<rootDir>/tests"],
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/server.ts",
      "!src/types/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

---

## 7. 测试最佳实践

### 7.1 DO

- 测试行为，不测试实现
- 每个测试独立运行，互不依赖
- 测试描述清晰明了
- 使用测试数据工厂
- 合理使用 beforeEach/afterEach

### 7.2 DON'T

- 不要在测试中写复杂逻辑
- 不要测试第三方库
- 不要过度 mock
- 不要跳过失败的测试（用 `.skip` 标记并说明原因）
- 不要在 it 中写多个 expect 且互相依赖

---

*适用于：tests/ 目录下所有测试文件*
