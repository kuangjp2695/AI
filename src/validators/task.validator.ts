/**
 * 任务相关的 Zod 验证 Schema
 */

import { z } from 'zod'

/**
 * 创建任务验证 Schema
 */
export const createTaskSchema = z.object({
  title: z.string({
    required_error: '标题不能为空',
    invalid_type_error: '标题必须是字符串'
  }).min(1, '标题不能为空').max(200, '标题不能超过 200 个字符'),
  
  description: z.string().max(2000, '描述不能超过 2000 个字符').optional(),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    invalid_type_error: '优先级无效'
  }).optional(),
  
  assignee: z.string().max(100, '负责人名称不能超过 100 个字符').optional(),
  
  tags: z.array(z.string().max(50, '标签不能超过 50 个字符')).max(20, '最多 20 个标签').optional(),
  
  dueDate: z.string().datetime({ message: '截止日期格式无效' }).optional(),
  
  estimatedHours: z.number().min(0, '预估工时不能为负数').max(1000, '预估工时不能超过 1000 小时').optional()
})

/**
 * 更新任务验证 Schema
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过 200 个字符').optional(),
  
  description: z.string().max(2000, '描述不能超过 2000 个字符').optional(),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  
  assignee: z.string().max(100, '负责人名称不能超过 100 个字符').optional(),
  
  tags: z.array(z.string().max(50, '标签不能超过 50 个字符')).max(20, '最多 20 个标签').optional(),
  
  dueDate: z.string().datetime({ message: '截止日期格式无效' }).optional(),
  
  estimatedHours: z.number().min(0, '预估工时不能为负数').max(1000, '预估工时不能超过 1000 小时').optional(),
  
  actualHours: z.number().min(0, '实际工时不能为负数').max(1000, '实际工时不能超过 1000 小时').optional()
})

/**
 * 更新任务状态验证 Schema
 */
export const updateTaskStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled'], {
    required_error: '状态不能为空',
    invalid_type_error: '状态无效'
  }),
  reason: z.string().max(500, '原因不能超过 500 个字符').optional()
})

/**
 * 任务查询参数验证 Schema
 */
export const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1, '页码最小为 1').default(1),
  limit: z.coerce.number().int().min(1, '每页数量最小为 1').max(100, '每页数量最大为 100').default(20),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignee: z.string().optional(),
  tag: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'dueDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  keyword: z.string().max(100, '关键词不能超过 100 个字符').optional()
})

/** 类型推导 */
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>
export type TaskQueryInput = z.infer<typeof taskQuerySchema>
