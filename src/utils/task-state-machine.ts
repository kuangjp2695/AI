/**
 * 任务状态机 - 管理任务状态的合法流转
 */

import { TaskStatus } from '../types/task.types'
import { BusinessError } from './errors'

/**
 * 状态流转图
 * 
 * pending → in-progress → completed
 *    ↓         ↓
 * cancelled ←──┘
 */
const validTransitions: Record<TaskStatus, TaskStatus[]> = {
  pending: ['in-progress', 'cancelled'],
  'in-progress': ['completed', 'cancelled', 'pending'],
  completed: [],
  cancelled: []
}

/**
 * 验证状态流转是否合法
 * @param fromStatus 当前状态
 * @param toStatus 目标状态
 * @returns 是否合法
 */
export function isValidStatusTransition(fromStatus: TaskStatus, toStatus: TaskStatus): boolean {
  const allowedTransitions = validTransitions[fromStatus]
  return allowedTransitions.includes(toStatus)
}

/**
 * 验证状态流转，如果不合法则抛出错误
 * @param fromStatus 当前状态
 * @param toStatus 目标状态
 * @throws BusinessError 状态流转不合法时抛出
 */
export function validateStatusTransition(fromStatus: TaskStatus, toStatus: TaskStatus): void {
  if (!isValidStatusTransition(fromStatus, toStatus)) {
    throw new BusinessError(
      `不允许将任务从 "${getStatusDisplayName(fromStatus)}" 变更为 "${getStatusDisplayName(toStatus)}"`
    )
  }
}

/**
 * 获取状态的中文显示名称
 * @param status 状态值
 * @returns 中文名称
 */
export function getStatusDisplayName(status: TaskStatus): string {
  const displayNames: Record<TaskStatus, string> = {
    pending: '待办',
    'in-progress': '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return displayNames[status]
}

/**
 * 获取优先级的中文显示名称
 * @param priority 优先级值
 * @returns 中文名称
 */
export function getPriorityDisplayName(priority: string): string {
  const displayNames: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return displayNames[priority] || priority
}

/**
 * 获取可以从当前状态流转到的所有状态
 * @param currentStatus 当前状态
 * @returns 可流转的状态列表
 */
export function getAvailableTransitions(currentStatus: TaskStatus): TaskStatus[] {
  return validTransitions[currentStatus] || []
}
