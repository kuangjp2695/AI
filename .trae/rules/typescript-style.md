# TypeScript 代码规范

> 本项目 TypeScript 代码的编码规范和最佳实践。

---

## 1. 类型系统

### 1.1 严格模式

必须启用 TypeScript 严格模式，配置在 `tsconfig.json` 中：

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}
```

### 1.2 类型声明

- **优先使用类型注解**，让类型意图更清晰
- **避免使用 `any`**，使用 `unknown` 替代
- 使用类型守卫（Type Guard）缩窄类型
- 公共 API 必须显式声明返回类型

```typescript
// 推荐
function getUser(id: string): Promise<User | null> {
  // ...
}

// 不推荐
async function getUser(id: string) {
  // 返回类型不明确
}
```

### 1.3 接口 vs 类型别名

- 使用 `interface` 定义对象形状
- 使用 `type` 定义联合类型、交叉类型、工具类型
- 需要扩展时使用 `interface`（支持声明合并）
- 需要联合类型时使用 `type`

```typescript
// 对象形状用 interface
interface Task {
  id: string
  title: string
  status: TaskStatus
}

// 联合类型用 type
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
```

### 1.4 枚举

- 优先使用字符串联合类型而非枚举
- 如需使用枚举，使用字符串枚举
- 避免数字枚举（隐式值易出错）

```typescript
// 推荐：字符串联合类型
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

// 也可接受：字符串枚举
enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

// 不推荐：数字枚举
enum TaskStatus {
  Pending,
  InProgress,
  Completed,
  Cancelled
}
```

---

## 2. 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量 | camelCase | `taskList`, `userName` |
| 函数 | camelCase | `getTaskById`, `createTask` |
| 类 | PascalCase | `TaskService`, `TaskController` |
| 接口 | PascalCase | `ITaskRepository`, `CreateTaskDto` |
| 类型别名 | PascalCase | `TTaskStatus`, `TaskFilter` |
| 枚举 | PascalCase | `PriorityLevel` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`, `DEFAULT_LIMIT` |
| 文件 | kebab-case | `task.service.ts`, `task.controller.ts` |
| 组件/类文件 | PascalCase | （前端适用） |

### 布尔值命名

布尔值变量应以 `is`, `has`, `can`, `should` 等开头：

```typescript
const isCompleted: boolean = task.status === 'completed'
const hasPermission: boolean = user.roles.includes('admin')
const canEdit: boolean = isOwner || hasPermission
```

---

## 3. 函数规范

### 3.1 函数参数

- 参数不超过 3 个，超过时使用对象参数
- 使用对象参数时，定义明确的接口
- 可选参数放在最后

```typescript
// 推荐：使用对象参数
interface CreateTaskOptions {
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: Date
}

function createTask(options: CreateTaskOptions): Task {
  // ...
}

// 不推荐：参数过多
function createTask(
  title: string,
  description: string,
  priority: string,
  dueDate: Date,
  assignee: string,
  tags: string[]
): Task {
  // ...
}
```

### 3.2 箭头函数

- 回调函数优先使用箭头函数
- 单行返回可省略大括号和 return
- 函数体较复杂时使用完整形式

```typescript
// 推荐
const activeTasks = tasks.filter(task => task.status === 'active')

const taskNames = tasks.map(task => task.name)

// 多行逻辑用完整形式
const processedTasks = tasks.map(task => {
  const processed = preprocess(task)
  return validate(processed)
})
```

---

## 4. 类与面向对象

### 4.1 类成员顺序

1. 静态属性
2. 实例属性
3. 构造函数
4. 静态方法
5. 公共方法
6. 受保护方法
7. 私有方法

### 4.2 访问修饰符

- 明确使用 `public`, `protected`, `private`
- 默认使用 `private`，只暴露必要的公共接口
- 属性优先使用 `private` + getter/setter

### 4.3 依赖注入

- 使用构造函数注入依赖
- 依赖面向接口而非具体实现
- 便于单元测试和替换实现

```typescript
// 推荐：依赖注入
class TaskService {
  constructor(private readonly taskRepository: ITaskRepository) {}
  
  async getTask(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id)
  }
}

// 不推荐：硬编码依赖
class TaskService {
  private taskRepository = new TaskRepository()
  
  async getTask(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id)
  }
}
```

---

## 5. 异步编程

### 5.1 async/await

- 优先使用 async/await 而非 Promise 链式调用
- 异步函数必须声明返回类型
- 并行执行使用 `Promise.all`

```typescript
// 推荐：async/await
async function getTaskWithDetails(id: string): Promise<TaskDetail> {
  const task = await taskService.getById(id)
  const comments = await commentService.getByTaskId(id)
  return { ...task, comments }
}

// 并行执行
async function getDashboardData(): Promise<DashboardData> {
  const [tasks, users, stats] = await Promise.all([
    taskService.getAll(),
    userService.getAll(),
    statsService.getOverview()
  ])
  return { tasks, users, stats }
}
```

### 5.2 错误处理

- 使用 try/catch 捕获异步错误
- 不要吞掉错误，至少记录日志
- 自定义错误类便于错误识别

```typescript
async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  try {
    const task = await taskService.updateStatus(id, status)
    logger.info(`任务 ${id} 状态更新为 ${status}`)
    return task
  } catch (error) {
    logger.error(`更新任务状态失败: ${error.message}`, { error })
    throw new BusinessError('更新任务状态失败', error)
  }
}
```

---

## 6. 模块导入导出

### 6.1 导入顺序

1. Node.js 内置模块
2. 第三方库
3. 项目内部模块（按路径深度排序）
4. 类型导入
5. 样式/资源文件

### 6.2 导出规范

- 使用命名导出，避免默认导出（React 组件除外）
- 每个文件单一职责，导出数量合理
- index.ts 用于统一导出，简化导入路径

```typescript
// 推荐：命名导出
export class TaskService { ... }
export interface ITaskService { ... }

// 使用时
import { TaskService, ITaskService } from './task.service'

// index.ts 统一导出
export * from './task.service'
export * from './task.controller'
```

---

## 7. 代码格式化

使用 Prettier 统一代码格式，配置在 `.prettierrc` 中：

- 缩进：2 空格
- 行宽：100 字符
- 分号：有
- 引号：单引号
- 尾逗号：all
- 箭头函数括号：always

使用 ESLint 检查代码质量，规则遵循：
- `@typescript-eslint/recommended`
- 项目自定义规则

---

*适用于：src/ 目录下所有 TypeScript 文件*
