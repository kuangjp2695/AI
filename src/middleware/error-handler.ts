/**
 * 全局错误处理中间件
 */

import { Request, Response, NextFunction } from 'express'
import { BaseError, ValidationError, InternalError } from '../utils/errors'
import { errorResponse } from '../utils/response'
import { logger } from '../utils/logger'
import { ValidationErrorDetail } from '../types/api.types'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // 记录错误日志
  logger.error(`请求错误: ${err.message}`, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    stack: err.stack
  })

  // 自定义错误
  if (err instanceof BaseError) {
    const details = err instanceof ValidationError 
      ? err.details as ValidationErrorDetail[] 
      : undefined

    errorResponse(
      res,
      err.message,
      err.statusCode,
      err.code,
      details
    )
    return
  }

  // Zod 验证错误
  if (err.name === 'ZodError') {
    errorResponse(res, '参数校验失败', 400, 'VALIDATION_ERROR')
    return
  }

  // 未知错误
  const internalError = new InternalError()
  errorResponse(
    res,
    internalError.message,
    internalError.statusCode,
    internalError.code
  )
}
