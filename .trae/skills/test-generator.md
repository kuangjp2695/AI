---
name: test-generator
description: 为 TypeScript/Node.js 代码自动生成单元测试和集成测试，遵循项目测试规范，使用 Jest + ts-jest
---

# 测试生成技能 (Test Generator)

## 何时使用（When）

当需要为以下情况生成测试代码时使用此技能：
- 新功能开发完成后需要补充单元测试
- 现有代码缺少测试覆盖
- Bug 修复后需要添加回归测试
- 用户明确要求生成测试代码时
- 重构前需要补充测试以保证安全

**不要在以下情况使用**：
- 代码只是简单的类型定义或接口
- 配置文件
- 第三方库的封装（除非有自定义逻辑）
- 用户只是询问测试思路，不需要实际生成代码

---

## 如何执行（How）

### 测试生成流程

#### 1. 分析被测代码
- 识别被测单元的输入和输出
- 理解业务逻辑和分支条件
- 确定依赖关系
- 识别边界条件和异常场景

#### 2. 设计测试用例

**必须覆盖的场景**：

| 场景类型 | 说明 | 示例 |
|----------|------|------|
| 正常路径 | 功能正常工作的情况 | 创建任务成功 |
| 边界条件 | 参数的边界值 | 空字符串、最大长度、零值 |
| 异常路径 | 错误和异常情况 | 任务不存在、参数无效 |
| 状态组合 | 不同状态的组合 | 不同任务状态下的操作 |

#### 3. 选择测试类型

- **单元测试**：Service 层、工具函数、复杂业务逻辑
- **集成测试**：Controller 层、API 端点、数据库操作
- **优先级**：核心业务逻辑 > 公共 API > 工具函数 > 配置

#### 4. 生成测试代码

遵循以下规范：
- 使用 AAA 模式（Arrange-Act-Assert）
- 使用 describe/it 分层描述
- 测试描述以"应该"开头
- 使用测试数据工厂创建测试数据
- Mock 外部依赖
- 每个 it 只测试一个行为

### 测试文件模板

#### Service 层单元测试模板

```typescript
import { SomeService } from '../../src/services/some.service'
import { ISomeRepository } from '../../src/repositories/some.repository'
import { createSomeFactory } from '../utils/factories/some.factory'

// Mock 依赖
const mockRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
} as jest.Mocked<ISomeRepository>

describe('SomeService', () => {
  let service: SomeService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new SomeService(mockRepository)
  })

  describe('#methodName', () => {
    it('应该在正常情况下返回正确结果', async () => {
      // Arrange
      const input = { /* 输入参数 */ }
      const expected = { /* 预期结果 */ }
      mockRepository.someMethod.mockResolvedValue(expected)

      // Act
      const result = await service.methodName(input)

      // Assert
      expect(result).toEqual(expected)
      expect(mockRepository.someMethod).toHaveBeenCalledWith(/* 期望参数 */)
    })

    it('应该在参数无效时抛出验证错误', async () => {
      // Arrange
      const invalidInput = { /* 无效参数 */ }

      // Act & Assert
      await expect(service.methodName(invalidInput)).rejects.toThrow(/* 错误类型 */)
    })

    it('应该在资源不存在时抛出 NotFoundError', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(service.methodName('non-existent-id')).rejects.toThrow('不存在')
    })
  })
})
```

#### Controller 层集成测试模板

```typescript
import request from 'supertest'
import { app } from '../../src/app'
import { setupTestDatabase, teardownTestDatabase } from '../utils/test-db'

describe('Some API', () => {
  beforeAll(async () => {
    await setupTestDatabase()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  describe('POST /api/some-resource', () => {
    it('应该创建资源并返回 201', async () => {
      const response = await request(app)
        .post('/api/some-resource')
        .send({
          // 请求体
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
    })

    it('应该在参数无效时返回 400', async () => {
      const response = await request(app)
        .post('/api/some-resource')
        .send({
          // 无效参数
        })
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })
})
```

---

## 产出什么（What）

产出完整的测试代码，包含：
1. 测试文件（放在 `tests/unit/` 或 `tests/integration/` 对应目录）
2. 测试用例覆盖正常路径、边界条件、异常场景
3. Mock 设置和测试数据工厂
4. 测试覆盖率预期说明

### 测试质量标准

- **覆盖率**：语句覆盖率 ≥ 80%，分支覆盖率 ≥ 75%
- **独立性**：每个测试用例独立运行，互不依赖
- **可读性**：测试描述清晰，易于理解测试意图
- **可维护性**：使用工厂函数，避免重复代码

---

## 参考文件

- `.trae/rules/frontend/testing/unit-test-rules.md` - 测试规范
- `tests/utils/factories/` - 测试数据工厂（可复用）
- `tsconfig.json` - TypeScript 配置
- `package.json` - Jest 配置
