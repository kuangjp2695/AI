/**
 * 任务状态机单元测试
 */

import {
  isValidStatusTransition,
  validateStatusTransition,
  getStatusDisplayName,
  getPriorityDisplayName,
  getAvailableTransitions
} from '../../../src/utils/task-state-machine'
import { BusinessError } from '../../../src/utils/errors'

describe('task-state-machine', () => {
  describe('isValidStatusTransition', () => {
    it('应该允许 pending -> in-progress', () => {
      expect(isValidStatusTransition('pending', 'in-progress')).toBe(true)
    })

    it('应该允许 pending -> cancelled', () => {
      expect(isValidStatusTransition('pending', 'cancelled')).toBe(true)
    })

    it('应该不允许 pending -> completed', () => {
      expect(isValidStatusTransition('pending', 'completed')).toBe(false)
    })

    it('应该允许 in-progress -> completed', () => {
      expect(isValidStatusTransition('in-progress', 'completed')).toBe(true)
    })

    it('应该允许 in-progress -> cancelled', () => {
      expect(isValidStatusTransition('in-progress', 'cancelled')).toBe(true)
    })

    it('应该允许 in-progress -> pending', () => {
      expect(isValidStatusTransition('in-progress', 'pending')).toBe(true)
    })

    it('应该不允许 completed -> 任何状态', () => {
      expect(isValidStatusTransition('completed', 'pending')).toBe(false)
      expect(isValidStatusTransition('completed', 'in-progress')).toBe(false)
      expect(isValidStatusTransition('completed', 'cancelled')).toBe(false)
    })

    it('应该不允许 cancelled -> 任何状态', () => {
      expect(isValidStatusTransition('cancelled', 'pending')).toBe(false)
      expect(isValidStatusTransition('cancelled', 'in-progress')).toBe(false)
      expect(isValidStatusTransition('cancelled', 'completed')).toBe(false)
    })
  })

  describe('validateStatusTransition', () => {
    it('应该在合法流转时不抛出错误', () => {
      expect(() => validateStatusTransition('pending', 'in-progress')).not.toThrow()
    })

    it('应该在非法流转时抛出 BusinessError', () => {
      expect(() => validateStatusTransition('completed', 'pending')).toThrow(BusinessError)
      expect(() => validateStatusTransition('completed', 'pending')).toThrow('不允许')
    })
  })

  describe('getStatusDisplayName', () => {
    it('应该返回正确的中文名称', () => {
      expect(getStatusDisplayName('pending')).toBe('待办')
      expect(getStatusDisplayName('in-progress')).toBe('进行中')
      expect(getStatusDisplayName('completed')).toBe('已完成')
      expect(getStatusDisplayName('cancelled')).toBe('已取消')
    })
  })

  describe('getPriorityDisplayName', () => {
    it('应该返回正确的中文名称', () => {
      expect(getPriorityDisplayName('low')).toBe('低')
      expect(getPriorityDisplayName('medium')).toBe('中')
      expect(getPriorityDisplayName('high')).toBe('高')
      expect(getPriorityDisplayName('urgent')).toBe('紧急')
    })

    it('应该在未知优先级时返回原值', () => {
      expect(getPriorityDisplayName('unknown')).toBe('unknown')
    })
  })

  describe('getAvailableTransitions', () => {
    it('应该返回 pending 状态的可流转状态', () => {
      const transitions = getAvailableTransitions('pending')
      expect(transitions).toContain('in-progress')
      expect(transitions).toContain('cancelled')
      expect(transitions.length).toBe(2)
    })

    it('应该返回 in-progress 状态的可流转状态', () => {
      const transitions = getAvailableTransitions('in-progress')
      expect(transitions).toContain('completed')
      expect(transitions).toContain('cancelled')
      expect(transitions).toContain('pending')
      expect(transitions.length).toBe(3)
    })

    it('应该返回空数组 for completed', () => {
      const transitions = getAvailableTransitions('completed')
      expect(transitions).toEqual([])
    })

    it('应该返回空数组 for cancelled', () => {
      const transitions = getAvailableTransitions('cancelled')
      expect(transitions).toEqual([])
    })
  })
})
