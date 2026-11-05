---
name: refactor-assistant
description: 辅助代码重构，提供重构建议、安全重构步骤和重构后验证，确保重构不改变代码行为
---

# 重构辅助技能 (Refactor Assistant)

## 何时使用（When）

当需要进行代码重构时使用此技能：
- 代码质量差，难以维护
- 存在大量重复代码
- 函数/类过大，职责不单一
- 嵌套过深，逻辑复杂
- 命名不清晰，难以理解
- 准备添加新功能前需要先重构
- 用户明确要求重构代码时

**重构前必须满足**：
- 有足够的测试覆盖（核心路径有测试）
- 理解代码的业务逻辑
- 明确重构目标

---

## 如何执行（How）

### 重构原则

1. **小步重构**：每次只做一个重构，每步都可回退
2. **测试先行**：重构前确保有测试，重构后运行测试
3. **行为不变**：重构只改变代码结构，不改变外部行为
4. **保持可用**：重构过程中代码始终可运行
5. **循序渐进**：先简单后复杂，先易后难

### 常见重构类型

#### 1. 提取函数 (Extract Function)

**适用场景**：
- 函数过长（超过 30 行）
- 代码片段可以独立理解
- 存在重复代码片段

**重构步骤**：
1. 识别可以提取的逻辑片段
2. 创建新函数，命名清晰表达意图
3. 将片段移到新函数中
4. 原位置替换为函数调用
5. 运行测试验证

**示例**：
```typescript
// 重构前
function processTask(task: Task) {
  // 验证任务状态
  if (task.status === 'cancelled') {
    throw new Error('已取消的任务不能处理')
  }
  if (task.status === 'completed') {
    throw new Error('已完成的任务不能重复处理')
  }
  
  // 处理任务...
}

// 重构后
function validateTaskStatus(task: Task): void {
  if (task.status === 'cancelled') {
    throw new Error('已取消的任务不能处理')
  }
  if (task.status === 'completed') {
    throw new Error('已完成的任务不能重复处理')
  }
}

function processTask(task: Task) {
  validateTaskStatus(task)
  // 处理任务...
}
```

#### 2. 提取变量 (Extract Variable)

**适用场景**：
- 表达式复杂，难以理解
- 相同表达式多次出现
- 表达式结果需要有名称说明

**示例**：
```typescript
// 重构前
if (task.status === 'completed' && task.completedAt > weekAgo) {
  // ...
}

// 重构后
const isRecentlyCompleted = task.status === 'completed' && task.completedAt > weekAgo
if (isRecentlyCompleted) {
  // ...
}
```

#### 3. 简化条件表达式

**适用场景**：
- 条件嵌套过深
- 复杂的 if-else 链
- 可以使用早返回减少嵌套

**示例**：
```typescript
// 重构前
function getTaskPriority(task: Task): string {
  if (task.priority === 'urgent') {
    return '紧急'
  } else {
    if (task.priority === 'high') {
      return '高'
    } else {
      if (task.priority === 'medium') {
        return '中'
      } else {
        return '低'
      }
    }
  }
}

// 重构后
function getTaskPriority(task: Task): string {
  const priorityMap: Record<string, string> = {
    urgent: '紧急',
    high: '高',
    medium: '中',
    low: '低'
  }
  return priorityMap[task.priority] || '低'
}
```

#### 4. 替换魔法数字/字符串

**适用场景**：
- 代码中出现意义不明的数字或字符串
- 相同的魔法值多处出现

**示例**：
```typescript
// 重构前
if (task.points > 100) {
  // 高级任务
}

// 重构后
const ADVANCED_TASK_THRESHOLD = 100
if (task.points > ADVANCED_TASK_THRESHOLD) {
  // 高级任务
}
```

#### 5. 提取类/接口

**适用场景**：
- 类职责过多
- 一组数据和方法可以独立成类
- 参数过多（数据簇）

### 重构流程

1. **分析现状**
   - 理解现有代码逻辑
   - 识别代码坏味道
   - 评估测试覆盖情况

2. **制定计划**
   - 确定重构目标
   - 列出重构步骤
   - 评估风险和影响范围

3. **执行重构**
   - 按照小步重构原则逐步执行
   - 每步重构后运行测试
   - 提交代码（便于回退）

4. **验证结果**
   - 运行全部测试
   - 检查代码质量指标
   - 确认行为不变

---

## 产出什么（What）

产出重构方案和重构后的代码，包含：
1. 重构分析报告（现状、问题、目标）
2. 重构步骤计划（按顺序的小步骤）
3. 重构后的代码
4. 测试验证结果
5. 重构效果评估

### 重构效果评估维度

- **可读性**：代码是否更容易理解
- **可维护性**：修改是否更容易
- **可测试性**：是否更容易编写测试
- **复用性**：是否减少了重复代码
- **性能**：是否有性能变化（确保没有降低）

---

## 参考文件

- `.trae/rules/general-rules.md` - 通用开发规则
- `.trae/rules/typescript-style.md` - TypeScript 代码规范
- `.trae/rules/frontend/testing/unit-test-rules.md` - 测试规范
- `tests/` - 现有测试（重构前确保有测试覆盖）
