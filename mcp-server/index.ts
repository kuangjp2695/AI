/**
 * 任务管理 MCP 服务器
 * 
 * 提供任务管理相关的工具函数，扩展 AI 助手的能力：
 * - 任务统计分析
 * - 任务报告生成
 * - 任务优先级计算
 * - 工作负载评估
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

// ========== 类型定义 ==========

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string
  tags: string[]
  dueDate?: string
  createdAt: string
  updatedAt: string
  estimatedHours?: number
  actualHours?: number
}

// ========== 模拟数据存储 ==========

let tasks: Task[] = [
  {
    id: 'task-001',
    title: '完成项目需求文档',
    description: '编写详细的产品需求文档，包括功能描述、用户故事、验收标准',
    status: 'completed',
    priority: 'high',
    assignee: '张三',
    tags: ['文档', '需求'],
    dueDate: '2024-01-15',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-10T16:30:00Z',
    estimatedHours: 16,
    actualHours: 20
  },
  {
    id: 'task-002',
    title: '设计数据库架构',
    description: '设计系统的数据库表结构和关系',
    status: 'completed',
    priority: 'high',
    assignee: '李四',
    tags: ['设计', '数据库'],
    dueDate: '2024-01-20',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
    estimatedHours: 24,
    actualHours: 28
  },
  {
    id: 'task-003',
    title: '开发用户认证模块',
    description: '实现用户注册、登录、权限管理功能',
    status: 'in-progress',
    priority: 'urgent',
    assignee: '王五',
    tags: ['开发', '后端', '安全'],
    dueDate: '2024-01-25',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
    estimatedHours: 40,
    actualHours: 32
  },
  {
    id: 'task-004',
    title: '开发任务管理 API',
    description: '实现任务的 CRUD 接口和状态管理',
    status: 'in-progress',
    priority: 'high',
    assignee: '赵六',
    tags: ['开发', '后端', 'API'],
    dueDate: '2024-01-30',
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
    estimatedHours: 32,
    actualHours: 16
  },
  {
    id: 'task-005',
    title: '前端页面开发',
    description: '开发任务管理的前端界面',
    status: 'pending',
    priority: 'medium',
    assignee: '钱七',
    tags: ['开发', '前端'],
    dueDate: '2024-02-05',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    estimatedHours: 48
  },
  {
    id: 'task-006',
    title: '编写单元测试',
    description: '为核心业务逻辑编写单元测试',
    status: 'pending',
    priority: 'medium',
    assignee: '孙八',
    tags: ['测试', '质量'],
    dueDate: '2024-02-10',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    estimatedHours: 24
  },
  {
    id: 'task-007',
    title: '性能优化',
    description: '优化 API 响应时间和数据库查询性能',
    status: 'pending',
    priority: 'low',
    tags: ['优化', '性能'],
    dueDate: '2024-02-15',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    estimatedHours: 16
  },
  {
    id: 'task-008',
    title: '部署上线',
    description: '将系统部署到生产环境',
    status: 'cancelled',
    priority: 'high',
    assignee: '周九',
    tags: ['运维', '部署'],
    dueDate: '2024-01-28',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    estimatedHours: 8
  }
]

// ========== 工具函数 ==========

/**
 * 生成任务统计报告
 */
function generateTaskStats(params: { assignee?: string; status?: string }): string {
  let filteredTasks = tasks

  if (params.assignee) {
    filteredTasks = filteredTasks.filter(t => t.assignee === params.assignee)
  }

  if (params.status) {
    filteredTasks = filteredTasks.filter(t => t.status === params.status)
  }

  const total = filteredTasks.length
  const byStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending').length,
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress').length,
    completed: filteredTasks.filter(t => t.status === 'completed').length,
    cancelled: filteredTasks.filter(t => t.status === 'cancelled').length
  }

  const byPriority = {
    urgent: filteredTasks.filter(t => t.priority === 'urgent').length,
    high: filteredTasks.filter(t => t.priority === 'high').length,
    medium: filteredTasks.filter(t => t.priority === 'medium').length,
    low: filteredTasks.filter(t => t.priority === 'low').length
  }

  const completedTasks = filteredTasks.filter(t => t.status === 'completed')
  const totalEstimated = completedTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)
  const totalActual = completedTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0)
  const completionRate = total > 0 ? ((byStatus.completed / total) * 100).toFixed(1) : '0'

  let report = '## 任务统计报告\n\n'
  report += `**总任务数**: ${total}\n\n`
  report += '### 按状态分布\n\n'
  report += `| 状态 | 数量 | 占比 |\n`
  report += `|------|------|------|\n`
  report += `| 待办 | ${byStatus.pending} | ${total > 0 ? ((byStatus.pending / total) * 100).toFixed(1) : 0}% |\n`
  report += `| 进行中 | ${byStatus['in-progress']} | ${total > 0 ? ((byStatus['in-progress'] / total) * 100).toFixed(1) : 0}% |\n`
  report += `| 已完成 | ${byStatus.completed} | ${total > 0 ? ((byStatus.completed / total) * 100).toFixed(1) : 0}% |\n`
  report += `| 已取消 | ${byStatus.cancelled} | ${total > 0 ? ((byStatus.cancelled / total) * 100).toFixed(1) : 0}% |\n\n`

  report += '### 按优先级分布\n\n'
  report += `| 优先级 | 数量 |\n`
  report += `|--------|------|\n`
  report += `| 紧急 | ${byPriority.urgent} |\n`
  report += `| 高 | ${byPriority.high} |\n`
  report += `| 中 | ${byPriority.medium} |\n`
  report += `| 低 | ${byPriority.low} |\n\n`

  report += '### 完成率统计\n\n'
  report += `- 完成率: ${completionRate}%\n`
  report += `- 已完成任务预估工时: ${totalEstimated} 小时\n`
  report += `- 已完成任务实际工时: ${totalActual} 小时\n`
  if (totalEstimated > 0) {
    const variance = ((totalActual - totalEstimated) / totalEstimated * 100).toFixed(1)
    report += `- 工时偏差: ${variance}%\n`
  }

  return report
}

/**
 * 评估工作负载
 */
function evaluateWorkload(assignee: string): string {
  const assigneeTasks = tasks.filter(t => t.assignee === assignee)
  const activeTasks = assigneeTasks.filter(t => t.status === 'pending' || t.status === 'in-progress')
  
  const totalEstimatedHours = activeTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)
  const inProgressTasks = activeTasks.filter(t => t.status === 'in-progress')
  const pendingTasks = activeTasks.filter(t => t.status === 'pending')
  
  // 计算工作负载等级
  let workloadLevel: string
  let workloadAdvice: string
  
  if (totalEstimatedHours > 80) {
    workloadLevel = '过载'
    workloadAdvice = '工作负载过重，建议重新分配任务或延期部分任务'
  } else if (totalEstimatedHours > 40) {
    workloadLevel = '饱满'
    workloadAdvice = '工作负载较满，注意合理安排时间'
  } else if (totalEstimatedHours > 20) {
    workloadLevel = '正常'
    workloadAdvice = '工作负载适中，可以正常推进'
  } else {
    workloadLevel = '较轻'
    workloadAdvice = '工作负载较轻，可以考虑分配更多任务'
  }

  const urgentTasks = activeTasks.filter(t => t.priority === 'urgent')
  const highPriorityTasks = activeTasks.filter(t => t.priority === 'high')

  let report = `## 工作负载评估 - ${assignee}\n\n`
  report += `**工作负载等级**: ${workloadLevel}\n\n`
  report += `### 任务概览\n\n`
  report += `- 总任务数: ${assigneeTasks.length}\n`
  report += `- 进行中: ${inProgressTasks.length}\n`
  report += `- 待办: ${pendingTasks.length}\n`
  report += `- 已完成: ${assigneeTasks.filter(t => t.status === 'completed').length}\n\n`
  
  report += `### 工时分析\n\n`
  report += `- 待完成预估工时: ${totalEstimatedHours} 小时\n`
  report += `- 紧急任务: ${urgentTasks.length} 个\n`
  report += `- 高优先级任务: ${highPriorityTasks.length} 个\n\n`

  report += `### 建议\n\n`
  report += `${workloadAdvice}\n\n`

  if (urgentTasks.length > 0) {
    report += `### 紧急任务清单\n\n`
    urgentTasks.forEach(t => {
      report += `- [${t.title}] - 截止日期: ${t.dueDate || '未设置'}\n`
    })
  }

  return report
}

/**
 * 生成每日站会报告
 */
function generateDailyStandupReport(assignee: string): string {
  const assigneeTasks = tasks.filter(t => t.assignee === assignee)
  const completedYesterday = assigneeTasks.filter(t => {
    // 简化：假设最近更新的已完成任务是昨天完成的
    return t.status === 'completed'
  }).slice(0, 3)
  
  const inProgressTasks = assigneeTasks.filter(t => t.status === 'in-progress')
  const blockedTasks = assigneeTasks.filter(t => t.priority === 'urgent' && t.status === 'pending')

  let report = `## 每日站会报告 - ${assignee}\n\n`
  report += `**日期**: ${new Date().toLocaleDateString('zh-CN')}\n\n`
  
  report += `### 昨日完成\n\n`
  if (completedYesterday.length > 0) {
    completedYesterday.forEach(t => {
      report += `- ✅ ${t.title}\n`
    })
  } else {
    report += `- 暂无\n`
  }
  
  report += `\n### 今日计划\n\n`
  if (inProgressTasks.length > 0) {
    inProgressTasks.forEach(t => {
      report += `- 🔄 ${t.title} (进行中)\n`
    })
  }
  if (blockedTasks.length > 0) {
    blockedTasks.forEach(t => {
      report += `- ⚡ ${t.title} (紧急)\n`
    })
  }
  if (inProgressTasks.length === 0 && blockedTasks.length === 0) {
    report += `- 暂无计划任务\n`
  }
  
  report += `\n### 阻塞问题\n\n`
  report += `- 暂无\n`

  return report
}

/**
 * 计算任务优先级评分
 */
function calculatePriorityScore(params: {
  impact: number
  urgency: number
  effort: number
  risk: number
}): { score: number; level: string; recommendation: string } {
  // 使用加权评分算法
  const impactWeight = 0.3
  const urgencyWeight = 0.3
  const effortWeight = 0.2
  const riskWeight = 0.2

  // effort 反向计分（工作量越大，优先级适当降低）
  const effortScore = 6 - params.effort

  const score = params.impact * impactWeight +
                params.urgency * urgencyWeight +
                effortScore * effortWeight +
                params.risk * riskWeight

  let level: string
  let recommendation: string

  if (score >= 4.5) {
    level = 'P0 - 最高优先级'
    recommendation = '立即处理，阻塞其他工作'
  } else if (score >= 3.5) {
    level = 'P1 - 高优先级'
    recommendation = '优先处理，本周内完成'
  } else if (score >= 2.5) {
    level = 'P2 - 中优先级'
    recommendation = '正常排期，迭代内完成'
  } else {
    level = 'P3 - 低优先级'
    recommendation = '延后处理，有空时做'
  }

  return { score: Math.round(score * 100) / 100, level, recommendation }
}

// ========== MCP 服务器设置 ==========

const server = new Server(
  {
    name: 'task-tools-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
)

// 工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_task_stats',
        description: '生成任务统计报告，包括按状态、优先级的分布统计，完成率和工时分析',
        inputSchema: {
          type: 'object',
          properties: {
            assignee: {
              type: 'string',
              description: '负责人姓名，可选，用于筛选特定人员的任务'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed', 'cancelled'],
              description: '任务状态，可选，用于筛选特定状态的任务'
            }
          }
        }
      },
      {
        name: 'evaluate_workload',
        description: '评估指定人员的工作负载，包括任务数量、工时分析和工作负载等级',
        inputSchema: {
          type: 'object',
          properties: {
            assignee: {
              type: 'string',
              description: '负责人姓名'
            }
          },
          required: ['assignee']
        }
      },
      {
        name: 'generate_daily_standup',
        description: '生成每日站会报告，包括昨日完成、今日计划和阻塞问题',
        inputSchema: {
          type: 'object',
          properties: {
            assignee: {
              type: 'string',
              description: '负责人姓名'
            }
          },
          required: ['assignee']
        }
      },
      {
        name: 'calculate_priority_score',
        description: '根据影响、紧急度、工作量和风险计算任务优先级评分',
        inputSchema: {
          type: 'object',
          properties: {
            impact: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: '业务影响程度 (1-5，5最高)'
            },
            urgency: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: '紧急程度 (1-5，5最紧急)'
            },
            effort: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: '预估工作量 (1-5，5最大)'
            },
            risk: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: '风险程度 (1-5，5最高)'
            }
          },
          required: ['impact', 'urgency', 'effort', 'risk']
        }
      }
    ]
  }
})

// 工具调用处理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    let content: string

    switch (name) {
      case 'generate_task_stats': {
        const params = z.object({
          assignee: z.string().optional(),
          status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']).optional()
        }).parse(args)
        
        content = generateTaskStats(params)
        break
      }

      case 'evaluate_workload': {
        const params = z.object({
          assignee: z.string()
        }).parse(args)
        
        content = evaluateWorkload(params.assignee)
        break
      }

      case 'generate_daily_standup': {
        const params = z.object({
          assignee: z.string()
        }).parse(args)
        
        content = generateDailyStandupReport(params.assignee)
        break
      }

      case 'calculate_priority_score': {
        const params = z.object({
          impact: z.number().min(1).max(5),
          urgency: z.number().min(1).max(5),
          effort: z.number().min(1).max(5),
          risk: z.number().min(1).max(5)
        }).parse(args)
        
        const result = calculatePriorityScore(params)
        content = `## 优先级评分结果\n\n`
        content += `- **综合评分**: ${result.score} / 5.0\n`
        content += `- **优先级等级**: ${result.level}\n`
        content += `- **建议**: ${result.recommendation}\n\n`
        content += `### 评分详情\n\n`
        content += `| 维度 | 得分 | 权重 | 加权分 |\n`
        content += `|------|------|------|--------|\n`
        content += `| 业务影响 | ${params.impact} | 30% | ${(params.impact * 0.3).toFixed(2)} |\n`
        content += `| 紧急程度 | ${params.urgency} | 30% | ${(params.urgency * 0.3).toFixed(2)} |\n`
        content += `| 工作量(反向) | ${6 - params.effort} | 20% | ${((6 - params.effort) * 0.2).toFixed(2)} |\n`
        content += `| 风险程度 | ${params.risk} | 20% | ${(params.risk * 0.2).toFixed(2)} |\n`
        break
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`)
    }

    return {
      content: [
        {
          type: 'text',
          text: content
        }
      ]
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.errors.map(e => e.message).join(', ')}`
      )
    }
    throw error
  }
})

// 启动服务器
async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Task Tools MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
