/**
 * 任务服务单元测试
 */

import { TaskService } from '../../../src/services/task.service'
import { ITaskRepository } from '../../../src/models/task.model'
import { Task, TaskStatus, PaginatedResult } from '../../../src/types/task.types'
import { NotFoundError, BusinessError } from '../../../src/utils/errors'

// Mock 仓储层
const mockTaskRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn()
} as jest.Mocked<ITaskRepository>

// 测试数据工厂
function createMockTask(overrides: Partial<Task> = {}): Task {
  const now = new Date()
  return {
    id: 'test-task-id',
    title: '测试任务',
    description: '这是一个测试任务',
    status: 'pending',
    priority: 'medium',
    tags: ['test'],
    createdAt: now,
    updatedAt: now,
    ...overrides
  }
}

describe('TaskService', () => {
  let taskService: TaskService

  beforeEach(() => {
    jest.clearAllMocks()
    taskService = new TaskService(mockTaskRepository)
  })

  describe('#getTasks', () => {
    it('应该返回分页的任务列表', async () => {
      // Arrange
      const mockTasks = [createMockTask(), createMockTask({ id: 'task-2' })]
      const mockResult: PaginatedResult<Task> = {
        items: mockTasks,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1
        }
      }
      mockTaskRepository.findAll.mockResolvedValue(mockResult)

      // Act
      const result = await taskService.getTasks({ page: 1, limit: 20 })

      // Assert
      expect(result).toEqual(mockResult)
      expect(mockTaskRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 })
    })

    it('应该正确传递筛选参数', async () => {
      // Arrange
      const params = { status: 'pending' as TaskStatus, priority: 'high' as const }
      mockTaskRepository.findAll.mockResolvedValue({
        items: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
      })

      // Act
      await taskService.getTasks(params)

      // Assert
      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(params)
    })
  })

  describe('#getTaskById', () => {
    it('应该在任务存在时返回任务', async () => {
      // Arrange
      const mockTask = createMockTask()
      mockTaskRepository.findById.mockResolvedValue(mockTask)

      // Act
      const result = await taskService.getTaskById('test-task-id')

      // Assert
      expect(result).toEqual(mockTask)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith('test-task-id')
    })

    it('应该在任务不存在时抛出 NotFoundError', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(taskService.getTaskById('non-existent-id')).rejects.toThrow(NotFoundError)
      await expect(taskService.getTaskById('non-existent-id')).rejects.toThrow('不存在')
    })
  })

  describe('#createTask', () => {
    it('应该成功创建任务', async () => {
      // Arrange
      const createDto = {
        title: '新任务',
        description: '任务描述',
        priority: 'high' as const,
        assignee: '张三'
      }
      const mockTask = createMockTask({
        title: createDto.title,
        description: createDto.description,
        priority: createDto.priority,
        assignee: createDto.assignee
      })
      mockTaskRepository.create.mockResolvedValue(mockTask)

      // Act
      const result = await taskService.createTask(createDto)

      // Assert
      expect(result).toEqual(mockTask)
      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createDto.title,
          description: createDto.description,
          priority: createDto.priority,
          assignee: createDto.assignee,
          status: 'pending',
          tags: []
        })
      )
    })

    it('应该使用默认值创建任务', async () => {
      // Arrange
      const createDto = { title: '最小任务' }
      mockTaskRepository.create.mockResolvedValue(createMockTask(createDto))

      // Act
      await taskService.createTask(createDto)

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '最小任务',
          description: '',
          priority: 'medium',
          status: 'pending',
          tags: []
        })
      )
    })
  })

  describe('#updateTask', () => {
    it('应该成功更新任务', async () => {
      // Arrange
      const existingTask = createMockTask()
      const updateDto = { title: '更新后的标题', priority: 'high' as const }
      const updatedTask = { ...existingTask, ...updateDto }
      
      mockTaskRepository.findById.mockResolvedValue(existingTask)
      mockTaskRepository.update.mockResolvedValue(updatedTask)

      // Act
      const result = await taskService.updateTask('test-task-id', updateDto)

      // Assert
      expect(result.title).toBe('更新后的标题')
      expect(result.priority).toBe('high')
      expect(mockTaskRepository.update).toHaveBeenCalledWith('test-task-id', expect.any(Object))
    })

    it('应该在任务不存在时抛出 NotFoundError', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(taskService.updateTask('non-existent-id', {})).rejects.toThrow(NotFoundError)
    })
  })

  describe('#updateTaskStatus', () => {
    it('应该成功更新任务状态（pending -> in-progress）', async () => {
      // Arrange
      const pendingTask = createMockTask({ status: 'pending' })
      const inProgressTask = createMockTask({ status: 'in-progress' })
      
      mockTaskRepository.findById.mockResolvedValue(pendingTask)
      mockTaskRepository.update.mockResolvedValue(inProgressTask)

      // Act
      const result = await taskService.updateTaskStatus('test-task-id', 'in-progress')

      // Assert
      expect(result.status).toBe('in-progress')
      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        'test-task-id',
        expect.objectContaining({ status: 'in-progress' })
      )
    })

    it('应该成功更新任务状态（in-progress -> completed）', async () => {
      // Arrange
      const inProgressTask = createMockTask({ status: 'in-progress' })
      const completedTask = createMockTask({ status: 'completed' })
      
      mockTaskRepository.findById.mockResolvedValue(inProgressTask)
      mockTaskRepository.update.mockResolvedValue(completedTask)

      // Act
      const result = await taskService.updateTaskStatus('test-task-id', 'completed')

      // Assert
      expect(result.status).toBe('completed')
    })

    it('应该在非法状态流转时抛出 BusinessError（completed -> pending）', async () => {
      // Arrange
      const completedTask = createMockTask({ status: 'completed' })
      mockTaskRepository.findById.mockResolvedValue(completedTask)

      // Act & Assert
      await expect(
        taskService.updateTaskStatus('test-task-id', 'pending')
      ).rejects.toThrow(BusinessError)
    })

    it('应该在任务不存在时抛出 NotFoundError', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(
        taskService.updateTaskStatus('non-existent-id', 'completed')
      ).rejects.toThrow(NotFoundError)
    })
  })

  describe('#deleteTask', () => {
    it('应该成功删除任务', async () => {
      // Arrange
      mockTaskRepository.delete.mockResolvedValue(true)

      // Act
      await taskService.deleteTask('test-task-id')

      // Assert
      expect(mockTaskRepository.delete).toHaveBeenCalledWith('test-task-id')
    })

    it('应该在任务不存在时抛出 NotFoundError', async () => {
      // Arrange
      mockTaskRepository.delete.mockResolvedValue(false)

      // Act & Assert
      await expect(taskService.deleteTask('non-existent-id')).rejects.toThrow(NotFoundError)
    })
  })

  describe('#getTaskStats', () => {
    it('应该返回正确的统计数据', async () => {
      // Arrange
      mockTaskRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3)  // pending
        .mockResolvedValueOnce(4)  // in-progress
        .mockResolvedValueOnce(2)  // completed
        .mockResolvedValueOnce(1)  // cancelled

      // Act
      const stats = await taskService.getTaskStats()

      // Assert
      expect(stats.total).toBe(10)
      expect(stats.byStatus.pending).toBe(3)
      expect(stats.byStatus['in-progress']).toBe(4)
      expect(stats.byStatus.completed).toBe(2)
      expect(stats.byStatus.cancelled).toBe(1)
      expect(stats.completionRate).toBe(20)
    })

    it('应该在没有任务时返回 0 完成率', async () => {
      // Arrange
      mockTaskRepository.count.mockResolvedValue(0)

      // Act
      const stats = await taskService.getTaskStats()

      // Assert
      expect(stats.total).toBe(0)
      expect(stats.completionRate).toBe(0)
    })
  })
})
