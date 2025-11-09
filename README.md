# Backend Optimizations

TypeScript + Express service that fronts a product catalogue API. It hydrates data from a mock upstream, applies filtering and pagination, and responds quickly thanks to in-memory caching and production-ready middleware defaults.

## Overview
- Exposes `GET /api/products` for catalogue queries with `search`, `page`, and `limit` parameters.
- Applies in-memory caching per unique query to minimise calls to the upstream mock API.
- Centralises configuration, routing, and error handling to keep the codebase modular and easy to extend.

## Tech Stack
- Node.js 22 + Express 5
- TypeScript 5 with strict compiler settings
- Axios for outbound HTTP calls
- NodeCache for short-lived response caching
- Helmet, CORS, and compression middleware for production readiness

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create a `.env` file to override defaults. Available variables are listed in `src/config/env.ts`.
3. Start the development server with hot reload:
   ```bash
   npm run dev
   ```
4. Build the TypeScript output:
   ```bash
   npm run build
   ```
5. Run the compiled server locally:
   ```bash
   npm start
   ```

## Available Scripts
- `npm run dev` – Run the server with `ts-node-dev` for hot reloading.
- `npm run build` – Compile TypeScript into the `dist/` directory.
- `npm start` – Build (via `prestart`) and launch the compiled server.
- `npm run lint` – Execute ESLint across the project.
- `npm run test` / `npm run test:watch` – Run the Vitest suite.

## Folder Structure
```
backend/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  │  └─ env.ts
│  ├─ controllers/
│  │  └─ productController.ts
│  ├─ middleware/
│  │  └─ errorHandler.ts
│  └─ routes/
│     └─ productRoutes.ts
├─ dist/            # Generated on build (not committed)
├─ DOCS/            # Project documentation
│  ├─ Architecture.md
│  └─ Endpoints.md
├─ package.json
├─ tsconfig.json
└─ render.yaml
```

## Features
- **Express app factory**: `createApp()` wires middleware, routes, and error handling for easy testing and reuse.
- **Config validation**: Environment variables are parsed with Zod to prevent misconfiguration at startup.
- **Product search**: Flexible filtering by product name or category with pagination helpers.
- **Caching**: NodeCache stores responses for five minutes per unique query.
- **Central error handler**: Normalises error responses and logs noisy server errors once.

## Deployment
### Render
1. Ensure `render.yaml` is committed. Render will use the defined build (`npm install --include=dev && npm run build`) and start (`npm start`) commands.
2. Create a Web Service on Render pointing at the repository.
3. Add environment variables in the Render dashboard if you need to override defaults (`MOCK_API_BASE_URL`, `CORS_ORIGIN`, `PORT`).
4. Trigger a deploy. The build stage compiles TypeScript before the service boots, so `node dist/server.js` runs with the latest build artifacts.

### Docker
1. Build the image:
   ```bash
   docker build -t backend-optimizations .
   ```
2. Run the container:
   ```bash
   docker run --env-file .env -p 4000:4000 backend-optimizations
   ```

## Documentation
- `DOCS/Architecture.md` – High-level design decisions and scaling guidance.
- `DOCS/Endpoints.md` – Detailed API contract for available routes.
