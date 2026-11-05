/**
 * 任务控制器 - 请求处理层
 */

import { Request, Response, NextFunction } from 'express'
import { TaskService } from '../services/task.service'
import { taskService } from '../services/task.service'
import { successResponse } from '../utils/response'
import { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput, TaskQueryInput } from '../validators/task.validator'

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * 获取任务列表
   * GET /api/tasks
   */
  getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as TaskQueryInput
      const result = await this.taskService.getTasks(query)
      successResponse(res, result, '获取任务列表成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取任务详情
   * GET /api/tasks/:id
   */
  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const task = await this.taskService.getTaskById(id)
      successResponse(res, task, '获取任务详情成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 创建任务
   * POST /api/tasks
   */
  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateTaskInput
      const task = await this.taskService.createTask({
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
      })
      successResponse(res, task, '任务创建成功', 201)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新任务
   * PUT /api/tasks/:id
   */
  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const dto = req.body as UpdateTaskInput
      const task = await this.taskService.updateTask(id, {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
      })
      successResponse(res, task, '任务更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新任务状态
   * PATCH /api/tasks/:id/status
   */
  updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const { status, reason } = req.body as UpdateTaskStatusInput
      const task = await this.taskService.updateTaskStatus(id, status, reason)
      successResponse(res, task, '任务状态更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除任务
   * DELETE /api/tasks/:id
   */
  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      await this.taskService.deleteTask(id)
      successResponse(res, null, '任务删除成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取任务统计
   * GET /api/tasks/stats/overview
   */
  getTaskStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.taskService.getTaskStats()
      successResponse(res, stats, '获取统计数据成功')
    } catch (error) {
      next(error)
    }
  }
}

/** 任务控制器单例实例 */
export const taskController = new TaskController(taskService)
