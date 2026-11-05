/**
 * 服务层依赖注入配置
 * 
 * 在这里组装各层的依赖关系
 */

import { InMemoryTaskRepository } from '../models/in-memory-task.repository'
import { TaskService } from '../services/task.service'

// 仓储层
const taskRepository = InMemoryTaskRepository

// 服务层
const taskService = new TaskService(taskRepository)

export {
  taskRepository,
  taskService
}
