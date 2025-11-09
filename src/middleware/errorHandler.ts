import type { Request, Response, NextFunction } from 'express'
import { isHttpError } from 'http-errors'

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  const status = typeof error.status === 'number' ? error.status : 500
  const expose = isHttpError(error) ? error.expose : status < 500
  const message = expose && error.message ? error.message : 'Internal server error'
  const details = expose ? error.details ?? error.data : undefined

  if (status >= 500) {
    console.error(error)
  } else {
    console.warn(error)
  }

  res.status(status).json({
    success: false,
    message,
    ...(details !== undefined ? { details } : {}),
  })
}
