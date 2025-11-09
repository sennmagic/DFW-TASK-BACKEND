import express from 'express'
import compression from 'compression'
import cors, { type CorsOptions } from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import { productRoutes } from './routes/productRoutes'


export function createApp() {
  const app = express()

  app.use(compression())

  const allowedOrigins = env.corsOrigins
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }0
      callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
  }

  app.use(
    cors(corsOptions),
  )
  app.use(helmet())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  const performanceFormat = ':method :url :status :res[content-length] - :response-time ms'
  app.use(morgan(performanceFormat))




app.use('/api', productRoutes)


  app.use(errorHandler)

  return app
}

