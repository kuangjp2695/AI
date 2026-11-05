/**
 * 任务仓储接口
 */

import { Task, TaskQueryParams, PaginatedResult } from '../types/task.types'

/**
 * 任务仓储接口
 */
export interface ITaskRepository {
  /**
   * 分页查询任务
   */
  findAll(params: TaskQueryParams): Promise<PaginatedResult<Task>>

  /**
   * 根据 ID 查找任务
   */
  findById(id: string): Promise<Task | null>

  /**
   * 创建任务
   */
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>

  /**
   * 更新任务
   */
  update(id: string, task: Partial<Task>): Promise<Task | null>

  /**
   * 删除任务
   */
  delete(id: string): Promise<boolean>

  /**
   * 统计任务数量
   */
  count(filters?: Partial<Task>): Promise<number>
}
