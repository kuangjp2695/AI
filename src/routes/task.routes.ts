/**
 * 任务路由
 */

import { Router } from 'express'
import { taskController } from '../controllers/task.controller'
import { validateBody, validateQuery } from '../middleware/validate-request'
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskQuerySchema
} from '../validators/task.validator'

const router = Router()

// 获取任务统计（必须放在 :id 路由之前）
router.get('/stats/overview', taskController.getTaskStats)

// 获取任务列表
router.get('/', validateQuery(taskQuerySchema), taskController.getTasks)

// 获取任务详情
router.get('/:id', taskController.getTaskById)

// 创建任务
router.post('/', validateBody(createTaskSchema), taskController.createTask)

// 更新任务
router.put('/:id', validateBody(updateTaskSchema), taskController.updateTask)

// 更新任务状态
router.patch('/:id/status', validateBody(updateTaskStatusSchema), taskController.updateTaskStatus)

// 删除任务
router.delete('/:id', taskController.deleteTask)

export const taskRoutes = router
