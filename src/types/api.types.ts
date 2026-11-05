/**
 * API 响应相关类型定义
 */

/**
 * 成功响应
 */
export interface SuccessResponse<T> {
  success: true
  data: T
  message: string
  timestamp: string
}

/**
 * 错误响应
 */
export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: ValidationErrorDetail[]
  }
  timestamp: string
}

/**
 * 验证错误详情
 */
export interface ValidationErrorDetail {
  field: string
  message: string
}

/** API 响应类型 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

/** 错误码枚举 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
