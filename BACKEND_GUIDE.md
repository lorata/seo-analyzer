# Backend Development Guide

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── websiteController.ts
│   │   │   ├── auditController.ts
│   │   │   ├── keywordController.ts
│   │   │   └── reportController.ts
│   │   ├── routes/          # API route definitions
│   │   │   ├── websites.ts
│   │   │   ├── audit.ts
│   │   │   ├── keywords.ts
│   │   │   └── reports.ts
│   │   └── services/        # Business logic
│   │       ├── auditService.ts
│   │       └── reportService.ts
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── models/              # TypeScript types
│   │   └── types.ts
│   ├── utils/               # Utility functions
│   │   ├── logger.ts
│   │   ├── db.ts
│   │   └── cache.ts
│   └── index.ts             # Application entry point
├── migrations/              # Database migration scripts
├── tests/                   # Test files
├── .env.example             # Environment variables template
├── Dockerfile               # Docker configuration
├── package.json             # Node dependencies
└── tsconfig.json            # TypeScript configuration
```

## Running the Backend

### Development
```bash
cd backend
npm install
npm run dev
```

### Production
```bash
cd backend
npm install
npm run build
NODE_ENV=production npm start
```

## Database Setup

### Run Migrations
```bash
npm run db:migrate
```

### Seed Database (Optional)
```bash
npm run db:seed
```

## API Documentation

### Website Management

#### Create Website
```bash
POST /api/websites
Content-Type: application/json

{
  "domain": "https://example.com",
  "name": "Example Website",
  "description": "My awesome website",
  "pageCount": 300
}
```

#### Get Website
```bash
GET /api/websites/:id
```

#### List Websites
```bash
GET /api/websites?page=1&limit=10
```

#### Update Website
```bash
PUT /api/websites/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "pageCount": 350
}
```

#### Delete Website
```bash
DELETE /api/websites/:id
```

### SEO Audit

#### Start Audit
```bash
POST /api/audit/start
Content-Type: application/json

{
  "websiteId": "uuid-here"
}
```

#### Get Audit Status
```bash
GET /api/audit/:auditId
```

#### Get Audit Issues
```bash
GET /api/audit/:auditId/issues?severity=critical&page=1&limit=20
```

#### Get Audit Report
```bash
GET /api/audit/:auditId/report
```

### Keyword Research

#### Research Keywords
```bash
POST /api/keywords/research
Content-Type: application/json

{
  "query": "seo optimization",
  "limit": 20
}
```

#### Get Tracked Keywords
```bash
GET /api/keywords/tracked/:websiteId?page=1&limit=20
```

#### Track Keyword
```bash
POST /api/keywords/track/:websiteId
Content-Type: application/json

{
  "keyword": "seo optimization",
  "url": "https://example.com/page"
}
```

#### Get Ranking History
```bash
GET /api/keywords/history/:keywordId?days=30
```

### Reports

#### Generate Report
```bash
POST /api/reports/generate
Content-Type: application/json

{
  "auditId": "uuid-here",
  "reportType": "pdf" // or "excel" or "both"
}
```

#### Get Report
```bash
GET /api/reports/:reportId
```

#### Download Report
```bash
GET /api/reports/:reportId/download
```

#### List Reports
```bash
GET /api/reports/audit/:auditId?page=1&limit=10
```

## Adding New Features

### 1. Create Database Table
Add migration in `migrations/` folder following SQL naming conventions.

### 2. Create TypeScript Type
Add type definitions in `src/models/types.ts`.

### 3. Create Controller
Add request handler in `src/api/controllers/`.

### 4. Create Service (if needed)
Add business logic in `src/api/services/`.

### 5. Create Route
Add API route in `src/api/routes/`.

### 6. Register Route
Import and use route in `src/index.ts`.

## Testing

### Run Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Code Quality

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## Environment Variables

See `.env.example` for all available configuration options.

## Debugging

### Enable Debug Logging
```bash
LOG_LEVEL=debug npm run dev
```

### Database Debugging
Connect directly to PostgreSQL:
```bash
psql postgresql://seo_user:seo_password@localhost:5432/seo_analyzer
```

## Performance Tips

1. Use database indexes for frequently queried columns
2. Cache expensive operations with Redis
3. Implement pagination for large result sets
4. Use connection pooling for database
5. Monitor API response times

## Security Best Practices

1. Always validate user input with Joi
2. Use parameterized queries to prevent SQL injection
3. Rate limit public endpoints
4. Implement proper error handling
5. Log security-relevant events
6. Keep dependencies up to date
