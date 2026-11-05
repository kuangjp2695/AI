/**
 * 任务服务 - 业务逻辑层
 */

import { ITaskRepository } from '../models/task.model'
import { taskRepository } from '../models/in-memory-task.repository'
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryParams,
  PaginatedResult,
  TaskStatus
} from '../types/task.types'
import { NotFoundError } from '../utils/errors'
import { validateStatusTransition } from '../utils/task-state-machine'
import { logger } from '../utils/logger'

export class TaskService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  /**
   * 分页获取任务列表
   */
  async getTasks(params: TaskQueryParams): Promise<PaginatedResult<Task>> {
    logger.debug('获取任务列表', { params })
    return this.taskRepository.findAll(params)
  }

  /**
   * 根据 ID 获取任务
   */
  async getTaskById(id: string): Promise<Task> {
    logger.debug('获取任务详情', { taskId: id })
    
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new NotFoundError(`任务 ${id} 不存在`)
    }
    return task
  }

  /**
   * 创建任务
   */
  async createTask(dto: CreateTaskDto): Promise<Task> {
    logger.info('创建任务', { title: dto.title, assignee: dto.assignee })

    const task = await this.taskRepository.create({
      title: dto.title,
      description: dto.description || '',
      status: 'pending',
      priority: dto.priority || 'medium',
      assignee: dto.assignee,
      tags: dto.tags || [],
      dueDate: dto.dueDate,
      estimatedHours: dto.estimatedHours
    })

    logger.info('任务创建成功', { taskId: task.id })
    return task
  }

  /**
   * 更新任务
   */
  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    logger.info('更新任务', { taskId: id, updates: Object.keys(dto) })

    // 检查任务是否存在
    const existingTask = await this.taskRepository.findById(id)
    if (!existingTask) {
      throw new NotFoundError(`任务 ${id} 不存在`)
    }

    const updatedTask = await this.taskRepository.update(id, {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      assignee: dto.assignee,
      tags: dto.tags,
      dueDate: dto.dueDate,
      estimatedHours: dto.estimatedHours,
      actualHours: dto.actualHours
    })

    if (!updatedTask) {
      throw new NotFoundError(`任务 ${id} 不存在`)
    }

    logger.info('任务更新成功', { taskId: id })
    return updatedTask
  }

  /**
   * 更新任务状态
   */
  async updateTaskStatus(id: string, newStatus: TaskStatus, reason?: string): Promise<Task> {
    logger.info('更新任务状态', { taskId: id, newStatus, reason })

    // 检查任务是否存在
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new NotFoundError(`任务 ${id} 不存在`)
    }

    // 验证状态流转是否合法
    validateStatusTransition(task.status, newStatus)

    // 更新状态
    const updatedTask = await this.taskRepository.update(id, {
      status: newStatus
    })

    if (!updatedTask) {
      throw new NotFoundError(`任务 ${id} 不存在`)
    }

    logger.info('任务状态更新成功', { taskId: id, fromStatus: task.status, toStatus: newStatus })
    return updatedTask
  }

  /**
   * 删除任务
   */
  async deleteTask(id: string): Promise<void> {
    logger.info('删除任务', { taskId: id })

    const deleted = await this.taskRepository.delete(id)
    if (!deleted) {
      throw new NotFoundError(`任务 ${id} 不存在`)
    }

    logger.info('任务删除成功', { taskId: id })
  }

  /**
   * 获取任务统计
   */
  async getTaskStats(): Promise<{
    total: number
    byStatus: Record<TaskStatus, number>
    completionRate: number
  }> {
    const total = await this.taskRepository.count()
    const pendingCount = await this.taskRepository.count({ status: 'pending' as TaskStatus })
    const inProgressCount = await this.taskRepository.count({ status: 'in-progress' as TaskStatus })
    const completedCount = await this.taskRepository.count({ status: 'completed' as TaskStatus })
    const cancelledCount = await this.taskRepository.count({ status: 'cancelled' as TaskStatus })

    const completionRate = total > 0 ? (completedCount / total) * 100 : 0

    return {
      total,
      byStatus: {
        pending: pendingCount,
        'in-progress': inProgressCount,
        completed: completedCount,
        cancelled: cancelledCount
      },
      completionRate
    }
  }
}

/** 任务服务单例实例 */
export const taskService = new TaskService(taskRepository)
