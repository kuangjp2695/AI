/**
 * 自定义错误类
 */

import { ErrorCode } from '../types/api.types'

/**
 * 基础错误类
 */
export class BaseError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    details?: unknown
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 参数验证错误
 */
export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, details)
  }
}

/**
 * 未认证错误
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string = '未授权访问') {
    super(message, ErrorCode.UNAUTHORIZED, 401)
  }
}

/**
 * 无权限错误
 */
export class ForbiddenError extends BaseError {
  constructor(message: string = '没有权限执行此操作') {
    super(message, ErrorCode.FORBIDDEN, 403)
  }
}

/**
 * 资源不存在错误
 */
export class NotFoundError extends BaseError {
  constructor(message: string = '资源不存在') {
    super(message, ErrorCode.NOT_FOUND, 404)
  }
}

/**
 * 资源冲突错误
 */
export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, ErrorCode.CONFLICT, 409)
  }
}

/**
 * 业务逻辑错误
 */
export class BusinessError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.BUSINESS_ERROR, 422, details)
  }
}

/**
 * 内部服务器错误
 */
export class InternalError extends BaseError {
  constructor(message: string = '服务器内部错误') {
    super(message, ErrorCode.INTERNAL_ERROR, 500)
  }
}
