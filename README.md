# Tiny Inventory Management System

A full-stack inventory management system built with TypeScript that tracks stores and their products. This project demonstrates clean architecture, RESTful API design, and modern web development practices.

## Quick Start

```bash
# Start everything with Docker
docker compose up

# Access the applications
# Web App: http://localhost:5173
# API: http://localhost:3000/api/v1
# Health Check: http://localhost:3000/health
```

The application will start with pre-seeded data (10 stores, each with 10 products).

## API Overview

### Stores

- `GET /api/v1/stores` - List stores (paginated: page, limit)
- `GET /api/v1/stores/:id` - Get store details
- `POST /api/v1/stores` - Create store (name, description)
- `PUT /api/v1/stores/:id` - Update store
- `DELETE /api/v1/stores/:id` - Delete store

### Products

- `GET /api/v1/products` - List products (filtered: category, minPrice, maxPrice, minStock, maxStock, storeId; paginated)
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Analytics (Non-trivial operations)

- `GET /api/v1/analytics/products-stores` - Get aggregate metrics (total products, total stores, average products per store)
- `GET /api/v1/analytics/stores/:id/products-by-category` - Get product distribution by category for a store

## Technology Stack

### Backend

- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Validation**: Zod with drizzle-zod
- **Testing**: Jest with Supertest
- **Logging**: Pino
- **Security**: Helmet, CORS, Rate Limiting

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query v5)
- **HTTP Client**: Axios
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI, Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React

### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL with Docker volumes for persistence

## Architecture & Design Decisions

### Backend Architecture

**Layered Architecture Pattern**
The backend follows a clean, layered architecture with clear separation of concerns:

```
src/
├── api/http/          # HTTP-specific layer (Express routes, handlers)
├── core/              # Business logic (services)
├── db/                # Data access layer (repositories, models, schemas)
├── shared/            # Cross-cutting concerns (middleware, validators)
└── config/            # Configuration management
```

**Key Design Decisions:**

1. **Repository Pattern with Dependency Injection**

   - Abstracts data access behind interfaces (`IProductRepository`, `IStoreRepository`)
   - Services depend on interfaces, not concrete implementations
   - Easy to swap implementations (e.g., in-memory for tests, PostgreSQL for production)
   - Enables clean unit testing with mock repositories

2. **Base Model Pattern**

   - Common fields (id, createdAt, updatedAt) extracted to `BaseModel`
   - `toJSON()` method for consistent serialization
   - Product model handles price conversion (cents to dollars) in serialization layer

3. **Protocol-Agnostic Service Layer**

   - HTTP handlers are thin adapters that call service methods
   - Services contain business logic and return domain objects
   - Easy to add GraphQL, gRPC, or other protocols by creating new adapters

4. **Database Design**

   - Prices stored as integers (cents) to avoid floating-point precision issues
   - UUID primary keys for distributed system compatibility
   - Indexed foreign keys for query performance
   - Drizzle ORM for type-safe queries and migrations

5. **API Response Format**
   - Consistent response wrapper: `{ success, message, data, pagination? }`
   - Standardized error handling with proper HTTP status codes
   - Pagination metadata included in paginated responses

### Frontend Architecture

**Component-Based Architecture**
The frontend is organized into reusable, composable components:

```
src/
├── components/
│   ├── ui/            # Reusable UI primitives (Button, Card, Modal, etc.)
│   ├── stores/        # Store-specific components
│   ├── products/      # Product-specific components
│   └── analytics/     # Analytics components
├── pages/             # Route-level components
├── lib/               # API client, React Query hooks, types
└── App.tsx            # Router configuration
```

**Key Design Decisions:**

1. **TanStack Query for State Management**

   - Server state managed separately from UI state
   - Automatic background refetching and caching
   - Optimistic updates for better UX
   - Built-in loading and error states

2. **Form Handling**

   - React Hook Form for performant form management
   - Zod schemas for runtime validation
   - Consistent validation between frontend and backend

3. **UI Component Library**

   - Headless UI for accessible, unstyled components
   - Tailwind CSS v4 with custom theme (Facebook-inspired blue palette)
   - Variant-based Button component for consistency

4. **Error & Loading States**
   - Every data-fetching component handles loading, error, and empty states
   - User-friendly error messages
   - Loading skeletons for better perceived performance

### Trade-offs & Rationale

1. **Repository Pattern Overhead**

   - **Chose**: Full repository pattern with interfaces
   - **Why**: Testability, flexibility, clear separation of concerns
   - **Trade-off**: More boilerplate, but worth it for maintainability and testing

2. **Monorepo vs Separate Repos**
   - **Chose**: Monorepo structure
   - **Why**: Easier to share types, simpler Docker setup, better for small teams
   - **Trade-off**: All code in one repo, but manageable with clear directory structure

## Testing Approach

### Backend Testing

**Strategy: Integration Tests with In-Memory Repositories**

```bash
cd server
npm test                # Run all tests
npm run test:watch      # Watch mode for TDD
```

**Test Structure:**

- Tests use actual Express app with mocked repositories
- Each test suite seeds its own data for isolation
- Faker.js generates realistic test data
- Supertest for HTTP assertions

**Coverage:**

- ✅ Product CRUD operations (all passing)
- ✅ Store CRUD operations (8/8 tests)
- ✅ Validation edge cases (missing fields, invalid types)
- ✅ Filtering and pagination
- ✅ Error responses (404, 400, 500)

**Why This Approach:**

- Fast execution (in-memory, no I/O)
- Isolated (no shared state between tests)
- Realistic (tests actual HTTP layer)
- Maintainable (easy to add new test cases)

**Example Test:**

```typescript
describe("GET /stores", () => {
  it("should return paginated stores", async () => {
    const response = await request(app)
      .get("/api/v1/stores?page=1&limit=5")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.pagination).toMatchObject({
      currentPage: 1,
      totalPages: 2,
      totalItems: 10,
    });
  });
});
```

## Project Structure

### Server (`/server`)

```
server/
├── src/
│   ├── api/http/              # HTTP layer
│   │   ├── products/          # Product routes & handlers
│   │   ├── stores/            # Store routes & handlers
│   │   ├── analytics/         # Analytics routes & handlers
│   │   └── health/            # Health check endpoint
│   ├── core/                  # Business logic
│   │   └── services/          # Service layer (ProductService, StoreService, etc.)
│   ├── db/                    # Data access
│   │   ├── models/            # Domain models (Product, Store)
│   │   ├── repositories/      # Data access implementations
│   │   ├── tables/            # Drizzle table schemas
│   │   ├── migrations/        # Database migrations
│   │   └── seed/              # Seed data
│   ├── shared/                # Cross-cutting concerns
│   │   ├── middleware/        # Express middleware
│   │   └── validators/        # Request validation
│   ├── config/                # Configuration
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Entry point
├── tests/                     # Integration tests
│   ├── __mocks__/             # Mock repositories
│   ├── products.test.ts
│   └── store.test.ts
├── Dockerfile.dev             # Development Docker image
└── package.json
```

### Web (`/web`)

```
web/
├── src/
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── stores/            # Store components
│   │   ├── products/          # Product components
│   │   └── analytics/         # Analytics components
│   ├── pages/
│   │   ├── HomePage.tsx       # Store list + analytics
│   │   └── StoreDetailPage.tsx # Store details + products
│   ├── lib/
│   │   ├── api.ts             # Axios client & API methods
│   │   ├── queries.ts         # React Query hooks
│   │   └── types.ts           # TypeScript types
│   ├── App.tsx                # Router configuration
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles (Tailwind)
├── Dockerfile.dev             # Development Docker image
└── package.json
```

## Development Workflow

### Local Development (without Docker)

**Backend:**

```bash
cd server
npm install
npm run dev                    # Starts on port 3000
```

**Frontend:**

```bash
cd web
npm install
npm run dev                    # Starts on port 5173
```

**Database:**

```bash
docker compose up postgres -d  # Only start Postgres
```

### Docker Development

```bash
# Start all services
docker compose up

# Rebuild after dependency changes
docker compose up --build

# Stop all services
docker compose down

# View logs
docker compose logs -f server
docker compose logs -f web
```

### Database Management

```bash
cd server

# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Environment Variables

### Server (`.env`)

```env
NODE_ENV=development
PORT=3000
DSN=postgresql://inventory_user:password@localhost:5432/tiny_inventory
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOW_STOCK_THRESHOLD=10
```

### Web (`.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Key Features

### ✅ Implemented

- Full CRUD for Stores and Products
- Pagination on all list endpoints
- Advanced filtering on products (category, price range, stock level, store)
- Analytics dashboard (aggregate metrics, category distribution)
- Form validation (frontend and backend)
- Error handling with user-friendly messages
- Loading states throughout the UI
- Responsive design
- Docker containerization with one-command startup
- Database seeding with realistic data
- Comprehensive backend tests
- Health check endpoint

## If I Had More Time

1. **Frontend Testing Suite**

   - Component tests with React Testing Library
   - Mock API responses with MSW
   - Test critical user flows (create store, add product, filter products)
   - **Why**: Frontend is currently untested; this is critical for confidence in deployments

2. **Authentication & Authorization**

   - JWT-based auth with refresh tokens
   - Role-based access control (Admin, Manager, Viewer)
   - Protect endpoints based on roles
   - **Why**: Required for production; would demonstrate security practices

3. **Advanced Search & Filtering**

   - Full-text search across products (name, description, SKU)
   - Compound filters (e.g., "Electronics under $500 with low stock")
   - Sorting options (price, name, stock level, created date)
   - **Why**: Improves UX significantly; demonstrates advanced database querying

4. **CRUD endpoints for the categories**

   - Manage the categories
   - **Why**: Consolidate the categories and manage it from one place

5. **Real-time Updates**

   - WebSocket support for live inventory updates
   - Show low stock alerts in real-time
   - Notify users when products are out of stock
   - **Why**: Better UX; demonstrates full-stack real-time architecture

6. **Audit Logging**

   - Track all CRUD operations (who, what, when)
   - Display audit trail in UI
   - Support filtering and searching logs
   - **Why**: Required for compliance; demonstrates event sourcing concepts

7. **Data Visualization Improvements**

   - More chart types (line charts for trends, pie charts for distribution)
   - Date range filters for analytics
   - Export charts as images or PDFs
   - **Why**: Better insights for business users

8. **API Documentation**

   - OpenAPI/Swagger documentation
   - Interactive API explorer
   - Code examples in multiple languages
   - **Why**: Essential for API consumers; demonstrates documentation practices

9. **Performance Optimizations**

   - Implement response caching with Redis
   - Add database query caching
   - Optimize bundle size with code splitting
   - Lazy load routes in frontend
   - **Why**: Improves scalability and user experience

10. **Price Precision**

    - Prices are stored in cents but the system doesn't handle currencies beyond USD.

11. **Geospatial Indexing on Stores**

    - Include location on the stores
    - Index the location to enable geospatial indexing for a more efficient location filtering

## License

MIT
