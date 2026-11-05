/**
 * 健康检查路由
 */

import { Router, Request, Response } from 'express'
import { successResponse } from '../utils/response'

const router = Router()

/**
 * 健康检查端点
 */
router.get('/', (_req: Request, res: Response): void => {
  successResponse(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  }, '服务运行正常')
})

export const healthRoutes = router
