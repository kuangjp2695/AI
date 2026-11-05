/**
 * 任务相关类型定义
 */

/** 任务状态枚举 */
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

/** 任务优先级枚举 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

/**
 * 任务接口
 */
export interface Task {
  /** 任务唯一标识 */
  id: string
  /** 任务标题 */
  title: string
  /** 任务描述 */
  description: string
  /** 任务状态 */
  status: TaskStatus
  /** 任务优先级 */
  priority: TaskPriority
  /** 负责人 */
  assignee?: string
  /** 标签列表 */
  tags: string[]
  /** 截止日期 */
  dueDate?: Date
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 预估工时（小时） */
  estimatedHours?: number
  /** 实际工时（小时） */
  actualHours?: number
}

/**
 * 创建任务 DTO
 */
export interface CreateTaskDto {
  title: string
  description?: string
  priority?: TaskPriority
  assignee?: string
  tags?: string[]
  dueDate?: Date
  estimatedHours?: number
}

/**
 * 更新任务 DTO
 */
export interface UpdateTaskDto {
  title?: string
  description?: string
  priority?: TaskPriority
  assignee?: string
  tags?: string[]
  dueDate?: Date
  estimatedHours?: number
  actualHours?: number
}

/**
 * 任务状态更新 DTO
 */
export interface UpdateTaskStatusDto {
  status: TaskStatus
}

/**
 * 任务查询参数
 */
export interface TaskQueryParams {
  page?: number
  limit?: number
  status?: TaskStatus
  priority?: TaskPriority
  assignee?: string
  tag?: string
  sortBy?: keyof Pick<Task, 'createdAt' | 'updatedAt' | 'priority' | 'dueDate'>
  sortOrder?: 'asc' | 'desc'
  keyword?: string
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * 任务状态流转记录
 */
export interface TaskStatusHistory {
  id: string
  taskId: string
  fromStatus: TaskStatus | null
  toStatus: TaskStatus
  changedAt: Date
  changedBy?: string
  reason?: string
}
