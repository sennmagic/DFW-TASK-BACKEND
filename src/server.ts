// src/server.ts
import { createApp } from './app'
import { env } from './config/env'

async function startServer() {


  const app = createApp()

  app.listen(env.port, () => {
    console.info(`Server listening on port ${env.port} `)
  })
}

void startServer()

