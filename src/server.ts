/**
 * 服务器启动入口
 */

import { app } from './app'
import { logger } from './utils/logger'

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  logger.info(`服务器启动成功`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  })
  logger.info(`健康检查: http://localhost:${PORT}/api/health`)
  logger.info(`任务 API: http://localhost:${PORT}/api/tasks`)
})

// 优雅关闭
function gracefulShutdown(signal: string): void {
  logger.info(`收到 ${signal} 信号，开始优雅关闭...`)
  
  server.close(() => {
    logger.info('服务器已关闭')
    process.exit(0)
  })

  // 强制关闭超时
  setTimeout(() => {
    logger.error('强制关闭超时，退出进程')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// 未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  logger.error('未处理的 Promise 拒绝:', reason)
  process.exit(1)
})
