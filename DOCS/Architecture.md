# Architecture

## High-Level Overview
This service is a lightweight product-catalogue backend composed of three primary layers:
- **HTTP composition (`src/app.ts`)** builds an Express application instance with security, observability, and performance middleware.
- **Domain logic (`src/controllers/productController.ts`)** fetches products from an upstream API, applies filtering/pagination, and stores responses in a short-lived cache.
- **Configuration & infrastructure (`src/config`, `render.yaml`, `dockerfile`)** provide environment validation and deployment artefacts for Render and Docker.

Each layer is written in TypeScript and compiled to CommonJS output under `dist/`. The compiled artefacts are what run in production and inside the Docker image.

## Request Lifecycle
1. **Entrypoint**: `src/server.ts` instantiates the Express app via `createApp()` and starts an HTTP listener on the configured port.
2. **Middleware chain** (`src/app.ts`):
   - Compression reduces payload sizes.
   - CORS checks the request origin against an allow list that can be configured via `CORS_ORIGIN`.
   - Helmet sets security headers suited for production environments.
   - JSON and URL-encoded parsers normalise request bodies.
   - Morgan logs concise performance metrics for each request.
3. **Routing**: All API routes are mounted under `/api`. Currently, `src/routes/productRoutes.ts` exposes the `GET /products` endpoint.
4. **Controller logic** (`getProducts`):
   - Normalises query parameters (`search`, `page`, `limit`).
   - Builds a cache key and returns cached data when available.
   - Fetches the upstream product list from `MOCK_API_BASE_URL` if needed.
   - Filters by name or category, calculates pagination metadata, and returns the formatted payload.
5. **Error handling**: Any thrown errors bubble into `src/middleware/errorHandler.ts`, which logs server-side failures (5xx) and serialises responses into a consistent JSON shape.

## Configuration & Operational Concerns
- **Environment validation**: `src/config/env.ts` loads variables with `dotenv` and validates them with Zod, ensuring required values (port, upstream URL) are always sane.
- **Caching**: NodeCache stores responses for five minutes, reducing load on the mock API during bursts of traffic.
- **Logging**: Console logging is leveraged throughout the controller for observability; Render and Docker capture these logs automatically.
- **Build & runtime**: The project relies on `npm run build` (TypeScript compilation) before `npm start`. On Render, the `render.yaml` file enforces dev-dependency installation and a build step so compiled artefacts are present when the service boots.

## Scalability Considerations
- **Stateless design**: All state lives in memory; the service can be horizontally scaled by running multiple instances behind a load balancer. Consider replacing NodeCache with Redis or another shared store when running more than one instance.
- **Rate limiting**: The codebase already ships with `express-rate-limit` as a dependency. Adding a global or route-specific limiter is straightforward and recommended before exposing the API publicly.
- **Resilience**: Wrap outbound calls with retries/backoff (Axios interceptors or libraries like `p-retry`) if the upstream becomes less reliable. Circuit breakers can further protect the service from repeated failures.
- **Monitoring**: Structured logging (e.g., pino) and metrics (Prometheus or StatsD) are natural next steps for production deployments.

## Development Workflow
- TypeScript strict mode catches unsafe patterns at compile time.
- `npm run dev` uses `ts-node-dev` for fast feedback.
- Vitest is configured for unit/integration tests; add suites under a `tests/` directory or co-locate with source files as the project grows.

By keeping middleware, routing, configuration, and controllers isolated, the codebase remains easy to extend—add additional routes by introducing new controller modules and mounting them under `src/routes`, or swap the caching layer without touching the HTTP pipeline.

