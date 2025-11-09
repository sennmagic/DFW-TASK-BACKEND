# Backend Optimizations

This Express + TypeScript backend powers a simple product catalogue API. It ingests data from an external mock service, applies lightweight filtering and pagination, and returns responses that stay fast even under repeated traffic thanks to caching and tuned middleware.

## Project Overview
- `/api/products` exposes the core endpoint. It accepts `search`, `page`, and `limit` query parameters, filters product records by name or category, and returns paginated results.
- `src/controllers/productController.ts` contains the fetch-and-filter logic and caches each unique query for five minutes.
- `src/app.ts` wires up the Express instance with compression, CORS, Helmet, JSON parsing, URL-encoded parsing, and Morgan logging before mounting routes and the centralized error handler.
- `src/config/env.ts` loads environment variables via `dotenv` and validates them with Zod so the app only boots with safe configuration.

## How It’s Built
- **Language & Framework** – TypeScript on Node 18 with Express 5. TypeScript is compiled to `dist/` through `tsc`, and development uses `ts-node-dev` for hot reloads.
- **Performance Tuning** – Compression shrinks payloads, NodeCache prevents redundant upstream calls, and precise query handling avoids unnecessary work.
- **Safety Defaults** – Helmet sets security headers, CORS is restricted through a configurable allowlist, and a shared error handler keeps responses consistent while logging issues clearly.
- **Deployment Ready** – The included Dockerfile installs dependencies, builds the TypeScript output, and starts the compiled app, making container deployments straightforward.


# DFW-TASK-BACKEND
