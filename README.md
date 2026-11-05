# 任务管理系统 (Task Management System)

> 一个基于 Node.js + TypeScript + Express 的任务管理系统，完整展示 TRAE IDE 的 Skill、Agent、MCP 等工程化能力。

---

## 项目概述

本项目是一个完整的后端服务，同时也是 **TRAE IDE 工程项目的最佳实践示例**。它展示了如何在 TRAE IDE 中：

- ✅ 使用 **Skills** 扩展 AI 助手的能力（代码审查、测试生成、文档生成等）
- ✅ 使用 **Subagents** 创建专业的子智能体（代码审查专家、安全审计专家等）
- ✅ 使用 **Commands** 定义快捷斜杠命令
- ✅ 使用 **MCP Servers** 扩展外部工具能力
- ✅ 使用 **Rules** 定义项目编码规范
- ✅ 使用 **AGENTS.md** 定义 AI 协作规范

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 运行时 | Node.js 18+ |
| 语言 | TypeScript |
| Web 框架 | Express.js |
| 数据验证 | Zod |
| 日志 | Winston |
| 测试 | Jest + ts-jest |
| 代码质量 | ESLint + Prettier |
| 安全 | Helmet + CORS |

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### 4. 验证服务

```bash
curl http://localhost:3000/api/health
```

### 5. 运行测试

```bash
# 运行全部测试
npm test

# 运行单元测试
npm run test:unit

# 查看覆盖率
npm test -- --coverage
```

---

## 项目结构

```
.
├── .trae/                      # TRAE IDE 项目配置
│   ├── rules/                  # 项目规则
│   │   ├── general-rules.md          # 通用开发规则
│   │   ├── typescript-style.md       # TypeScript 代码规范
│   │   ├── backend/
│   │   │   └── api-design.md         # 后端 API 设计规范
│   │   └── frontend/
│   │       └── testing/
│   │           └── unit-test-rules.md # 单元测试规范
│   ├── skills/                 # 项目技能 (Skills)
│   │   ├── code-reviewer.md          # 代码审查技能
│   │   ├── test-generator.md         # 测试生成技能
│   │   ├── api-doc-generator.md      # API 文档生成技能
│   │   ├── bug-detector.md           # Bug 检测技能
│   │   └── refactor-assistant.md     # 重构辅助技能
│   ├── agents/                 # 项目级子智能体 (Subagents)
│   │   ├── code-review-agent.md      # 代码审查 Agent
│   │   ├── security-audit-agent.md   # 安全审计 Agent
│   │   └── test-writer-agent.md      # 测试编写 Agent
│   ├── commands/               # 项目命令 (Slash Commands)
│   │   ├── review.md                 # /review - 代码审查
│   │   ├── audit.md                  # /audit - 安全审计
│   │   ├── docs.md                   # /docs - 生成文档
│   │   ├── refactor.md               # /refactor - 代码重构
│   │   ├── dev/
│   │   │   ├── run.md                # /dev/run - 启动开发服务器
│   │   │   └── build.md              # /dev/build - 构建项目
│   │   └── test/
│   │       ├── generate.md           # /test/generate - 生成测试
│   │       ├── run.md                # /test/run - 运行测试
│   │       └── coverage.md           # /test/coverage - 查看覆盖率
│   └── mcp.json                # 项目级 MCP 配置
│
├── mcp-server/                 # 自定义 MCP 服务器
│   ├── index.ts                # MCP 服务器入口
│   ├── package.json
│   └── tsconfig.json
│
├── src/                        # 源代码
│   ├── controllers/            # 控制层
│   ├── services/               # 服务层（业务逻辑）
│   ├── models/                 # 数据模型/仓储
│   ├── routes/                 # 路由定义
│   ├── middleware/             # 中间件
│   ├── validators/             # 参数验证
│   ├── utils/                  # 工具函数
│   ├── types/                  # 类型定义
│   ├── app.ts                  # Express 应用配置
│   └── server.ts               # 服务器入口
│
├── tests/                      # 测试
│   ├── unit/                   # 单元测试
│   └── integration/            # 集成测试
│
├── AGENTS.md                   # AI 协作规范
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## TRAE IDE 功能详解

### 1. 项目规则 (Rules)

项目规则定义了编码规范和最佳实践，AI 助手在生成和审查代码时会自动遵循这些规则。

**位置**: `.trae/rules/`

**可用规则**:
- `general-rules.md` - 通用开发规则（代码质量、版本控制、错误处理等）
- `typescript-style.md` - TypeScript 代码规范（类型系统、命名规范、异步编程等）
- `backend/api-design.md` - 后端开发规范（分层架构、API 设计、中间件等）
- `frontend/testing/unit-test-rules.md` - 测试规范（测试类型、Mock 规范、覆盖率等）

### 2. 项目技能 (Skills)

Skills 是可复用的能力模块，AI 助手会在合适的时机自动调用。

**位置**: `.trae/skills/`

**可用技能**:

| 技能 | 描述 | 触发场景 |
|------|------|----------|
| **code-reviewer** | 代码审查 | 代码提交前、PR 审查 |
| **test-generator** | 测试生成 | 新功能开发后、补充测试 |
| **api-doc-generator** | API 文档生成 | API 开发完成后 |
| **bug-detector** | Bug 检测 | 代码审查、问题排查 |
| **refactor-assistant** | 重构辅助 | 代码重构、质量改进 |

### 3. 子智能体 (Subagents)

Subagents 是专用的子智能体，Agent 会在识别到合适任务时自动调用。

**位置**: `.trae/agents/`

**可用子智能体**:

| 子智能体 | 描述 | 专长领域 |
|---------|------|----------|
| **code-review-agent** | 代码审查专家 | 代码质量、最佳实践 |
| **security-audit-agent** | 安全审计专家 | OWASP Top 10、安全漏洞 |
| **test-writer-agent** | 测试开发专家 | 单元测试、集成测试 |

### 4. 斜杠命令 (Commands)

斜杠命令是快捷操作，用户可以直接输入 `/命令名` 调用。

**位置**: `.trae/commands/`

**可用命令**:

| 命令 | 描述 | 示例 |
|------|------|------|
| `/review` | 代码审查 | `/review src/services/task.service.ts` |
| `/audit` | 安全审计 | `/audit --all` |
| `/docs` | 生成 API 文档 | `/docs --openapi` |
| `/refactor` | 代码重构 | `/refactor src/utils/helpers.ts` |
| `/dev/run` | 启动开发服务器 | `/dev/run` |
| `/dev/build` | 构建项目 | `/dev/build` |
| `/test/generate` | 生成测试 | `/test/generate src/services/task.service.ts` |
| `/test/run` | 运行测试 | `/test/run --coverage` |
| `/test/coverage` | 查看覆盖率 | `/test/coverage` |

### 5. MCP 服务器

MCP (Model Context Protocol) 服务器扩展了 AI 助手的工具能力。

**配置文件**: `.trae/mcp.json`

**可用 MCP 服务器**:

| 服务器 | 描述 | 工具 |
|--------|------|------|
| **task-tools** | 任务管理工具 | 任务统计、工作负载评估、站会报告、优先级评分 |
| **filesystem** | 文件系统访问 | 读写文件、目录操作 |

**自定义 MCP 服务器** (`mcp-server/`):

提供以下工具：
- `generate_task_stats` - 生成任务统计报告
- `evaluate_workload` - 评估工作负载
- `generate_daily_standup` - 生成每日站会报告
- `calculate_priority_score` - 计算任务优先级评分

### 6. AGENTS.md

`AGENTS.md` 是跨工具的 AI 协作规范，定义了：
- 项目概览和技术栈
- 编码规范
- 提交规范
- 测试规范
- API 设计规范
- 安全规范
- 性能规范
- AI 协作指南

---

## API 文档

### 任务管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/tasks` | 获取任务列表（支持分页、筛选、排序） |
| GET | `/api/tasks/:id` | 获取任务详情 |
| POST | `/api/tasks` | 创建任务 |
| PUT | `/api/tasks/:id` | 更新任务 |
| PATCH | `/api/tasks/:id/status` | 更新任务状态 |
| DELETE | `/api/tasks/:id` | 删除任务 |
| GET | `/api/tasks/stats/overview` | 获取任务统计 |

### 健康检查

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/health` | 健康检查 |

### 任务状态流转

```
pending → in-progress → completed
    ↓         ↓
cancelled ←──┘
```

- **pending** (待办): 新创建的任务
- **in-progress** (进行中): 正在处理的任务
- **completed** (已完成): 已完成的任务（不可回退）
- **cancelled** (已取消): 已取消的任务（不可恢复）

---

## 开发指南

### 添加新功能

1. **定义类型**: 在 `src/types/` 中添加类型定义
2. **创建验证器**: 在 `src/validators/` 中添加 Zod Schema
3. **实现服务**: 在 `src/services/` 中实现业务逻辑
4. **创建控制器**: 在 `src/controllers/` 中处理请求
5. **定义路由**: 在 `src/routes/` 中注册路由
6. **编写测试**: 在 `tests/` 中添加测试用例

### 代码规范

请参考 `.trae/rules/` 目录下的规则文件，AI 助手会自动遵循这些规范。

### 测试规范

请参考 `.trae/rules/frontend/testing/unit-test-rules.md`

- 覆盖率要求：语句 ≥ 80%，分支 ≥ 75%
- 使用 AAA 模式（Arrange-Act-Assert）
- 使用测试数据工厂

---

## 部署

### 构建

```bash
npm run build
```

### 生产运行

```bash
npm start
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| CORS_ORIGIN | CORS 允许的域名 | * |
| LOG_LEVEL | 日志级别 | info |

---

## 如何使用 TRAE IDE 功能

### 代码审查

1. 选中要审查的代码文件
2. 输入 `/review src/services/task.service.ts`
3. AI 助手会调用 code-reviewer skill 进行全面审查

### 生成测试

1. 输入 `/test/generate src/services/task.service.ts`
2. AI 助手会分析代码并生成完整的单元测试

### 安全审计

1. 输入 `/audit --all`
2. 安全审计 Agent 会扫描整个项目的安全问题

### 代码重构

1. 输入 `/refactor src/utils/helpers.ts`
2. 重构辅助 Skill 会提供重构建议和优化方案

### 使用 MCP 工具

在对话中直接描述需求，AI 助手会自动调用合适的 MCP 工具：

- "帮我统计一下张三的任务情况" → 调用 `generate_task_stats`
- "评估一下王五的工作负载" → 调用 `evaluate_workload`
- "生成今天的站会报告" → 调用 `generate_daily_standup`
- "帮我评估这个任务的优先级" → 调用 `calculate_priority_score`

---

## 许可证

MIT License
