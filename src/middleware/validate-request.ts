/**
 * 请求验证中间件
 */

import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { ValidationError } from '../utils/errors'

/**
 * 验证请求体
 * @param schema Zod Schema
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        next(new ValidationError('参数校验失败', details))
      } else {
        next(error)
      }
    }
  }
}

/**
 * 验证查询参数
 * @param schema Zod Schema
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        next(new ValidationError('查询参数校验失败', details))
      } else {
        next(error)
      }
    }
  }
}

/**
 * 验证路径参数
 * @param schema Zod Schema
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        next(new ValidationError('路径参数校验失败', details))
      } else {
        next(error)
      }
    }
  }
}
