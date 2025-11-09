import { config as loadEnv } from 'dotenv'
import { z } from 'zod'

loadEnv()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().optional(),
  MOCK_API_BASE_URL: z.string().url().default('https://690f2d0c45e65ab24ac2c618.mockapi.io/api'),
})

const parsed = envSchema.parse(process.env)

const corsOrigins = parsed.CORS_ORIGIN?.split(',')
  .map((value) => value.trim())
  .filter((value) => value.length > 0) ?? []

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  corsOrigins,
  mockApiBaseUrl: parsed.MOCK_API_BASE_URL,
}

export type Env = typeof env
