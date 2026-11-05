/**
 * 内存任务仓储实现 - 用于演示和开发测试
 * 
 * 注意：生产环境应替换为数据库实现
 */

import { v4 as uuidv4 } from 'uuid'
import { Task, TaskQueryParams, PaginatedResult } from '../types/task.types'
import { ITaskRepository } from '../models/task.model'

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  /**
   * 初始化示例数据
   */
  private initializeSampleData(): void {
    const now = new Date()
    const sampleTasks: Task[] = [
      {
        id: uuidv4(),
        title: '完成项目需求文档',
        description: '编写详细的产品需求文档，包括功能描述、用户故事、验收标准',
        status: 'completed',
        priority: 'high',
        assignee: '张三',
        tags: ['文档', '需求'],
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        estimatedHours: 16,
        actualHours: 20
      },
      {
        id: uuidv4(),
        title: '设计数据库架构',
        description: '设计系统的数据库表结构和关系',
        status: 'completed',
        priority: 'high',
        assignee: '李四',
        tags: ['设计', '数据库'],
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        estimatedHours: 24,
        actualHours: 28
      },
      {
        id: uuidv4(),
        title: '开发用户认证模块',
        description: '实现用户注册、登录、权限管理功能',
        status: 'in-progress',
        priority: 'urgent',
        assignee: '王五',
        tags: ['开发', '后端', '安全'],
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        estimatedHours: 40,
        actualHours: 32
      },
      {
        id: uuidv4(),
        title: '开发任务管理 API',
        description: '实现任务的 CRUD 接口和状态管理',
        status: 'in-progress',
        priority: 'high',
        assignee: '赵六',
        tags: ['开发', '后端', 'API'],
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        estimatedHours: 32,
        actualHours: 16
      },
      {
        id: uuidv4(),
        title: '前端页面开发',
        description: '开发任务管理的前端界面',
        status: 'pending',
        priority: 'medium',
        assignee: '钱七',
        tags: ['开发', '前端'],
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        estimatedHours: 48
      },
      {
        id: uuidv4(),
        title: '编写单元测试',
        description: '为核心业务逻辑编写单元测试',
        status: 'pending',
        priority: 'medium',
        assignee: '孙八',
        tags: ['测试', '质量'],
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        estimatedHours: 24
      },
      {
        id: uuidv4(),
        title: '性能优化',
        description: '优化 API 响应时间和数据库查询性能',
        status: 'pending',
        priority: 'low',
        tags: ['优化', '性能'],
        dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        estimatedHours: 16
      }
    ]

    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task)
    })
  }

  async findAll(params: TaskQueryParams): Promise<PaginatedResult<Task>> {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignee,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      keyword
    } = params

    // 过滤
    let filteredTasks = Array.from(this.tasks.values())

    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status)
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === priority)
    }

    if (assignee) {
      filteredTasks = filteredTasks.filter(t => t.assignee === assignee)
    }

    if (tag) {
      filteredTasks = filteredTasks.filter(t => t.tags.includes(tag))
    }

    if (keyword) {
      const keywordLower = keyword.toLowerCase()
      filteredTasks = filteredTasks.filter(
        t =>
          t.title.toLowerCase().includes(keywordLower) ||
          t.description.toLowerCase().includes(keywordLower)
      )
    }

    // 排序
    const priorityOrder: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    }

    filteredTasks.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0
          else if (!a.dueDate) comparison = 1
          else if (!b.dueDate) comparison = -1
          else comparison = a.dueDate.getTime() - b.dueDate.getTime()
          break
        case 'createdAt':
        case 'updatedAt':
        default:
          comparison = a[sortBy].getTime() - b[sortBy].getTime()
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    // 分页
    const total = filteredTasks.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const items = filteredTasks.slice(startIndex, startIndex + limit)

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null
  }

  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date()
    const task: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    }
    this.tasks.set(task.id, task)
    return task
  }

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const existingTask = this.tasks.get(id)
    if (!existingTask) {
      return null
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      id: existingTask.id, // 确保 ID 不变
      updatedAt: new Date()
    }

    this.tasks.set(id, updatedTask)
    return updatedTask
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id)
  }

  async count(filters?: Partial<Task>): Promise<number> {
    if (!filters) {
      return this.tasks.size
    }

    let count = 0
    for (const task of this.tasks.values()) {
      let matches = true
      for (const [key, value] of Object.entries(filters)) {
        if (task[key as keyof Task] !== value) {
          matches = false
          break
        }
      }
      if (matches) {
        count++
      }
    }
    return count
  }
}

/** 单例实例 */
export const taskRepository = new InMemoryTaskRepository()
