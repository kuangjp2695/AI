/**
 * 请求日志中间件
 */

import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now()
  const { method, url, ip } = req

  // 响应完成时记录
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const { statusCode } = res

    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'

    logger[logLevel](`${method} ${url} ${statusCode} - ${duration}ms`, {
      method,
      url,
      statusCode,
      duration,
      ip
    })
  })

  next()
}
