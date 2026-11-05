/**
 * Express 应用配置
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

import { taskRoutes } from './routes/task.routes'
import { healthRoutes } from './routes/health.routes'
import { errorHandler } from './middleware/error-handler'
import { requestLogger } from './middleware/request-logger'
import { NotFoundError } from './utils/errors'

const app = express()

// 安全中间件
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// 解析中间件
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// HTTP 请求日志
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// 自定义请求日志
app.use(requestLogger)

// 路由
app.use('/api/health', healthRoutes)
app.use('/api/tasks', taskRoutes)

// 404 处理
app.use('*', () => {
  throw new NotFoundError('请求的资源不存在')
})

// 全局错误处理
app.use(errorHandler)

export { app }
