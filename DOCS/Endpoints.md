# API Endpoints

All routes are served under the `/api` prefix. The service currently exposes a single catalogue endpoint that supports filtering and pagination.

## GET `/api/products`
Fetch paginated product data from the upstream mock API, optionally filtered by name or category.

### Query Parameters
| Name   | Type   | Default | Description |
|--------|--------|---------|-------------|
| `search` | string | `""`    | Case-insensitive substring match against product `name` or `category`. |
| `page`   | number | `1`     | 1-based page index. Values less than 1 are coerced to 1. |
| `limit`  | number | `10`    | Results per page. Values less than 1 are coerced to 1. |

### Response
```json
{
  "search": "shoe",
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5,
  "results": [
    {
      "id": "1",
      "name": "Running Shoe",
      "category": "Footwear",
      "...": "..."
    }
  ]
}
```

- `results` mirrors the shape returned by the upstream API. Additional fields are passed through unchanged.
- When cached, responses include the exact payload previously generated for the matching `search/page/limit` combination.

### Error Responses
- `500 Internal Server Error` – Upstream request failed or the response could not be processed. Returns `{ "message": "Failed to fetch products" }`.
- Validation errors or disallowed CORS origins will surface via the shared error handler with consistent JSON formatting.

## Health & Future Endpoints
A dedicated health endpoint is not yet implemented. Additions can be made by extending `src/routes` and `src/controllers`; remember to update this document whenever new endpoints are introduced.

