/**
 * API 响应格式化工具
 */

import { Response } from 'express'
import { SuccessResponse, ErrorResponse, ValidationErrorDetail } from '../types/api.types'

/**
 * 成功响应
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message: string = '操作成功',
  statusCode: number = 200
): void {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }
  res.status(statusCode).json(response)
}

/**
 * 错误响应
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: ValidationErrorDetail[]
): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString()
  }
  res.status(statusCode).json(response)
}
