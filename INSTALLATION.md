# SEO Analyzer Pro - Complete Installation and Setup Guide

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose, which sets up all services automatically.

### Prerequisites
- Docker Desktop (includes Docker and Docker Compose)
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/lorata/seo-analyzer.git
cd seo-analyzer
```

2. **Start all services**
```bash
docker-compose up
```

That's it! The application will be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## Manual Installation (Without Docker)

### Backend Setup

#### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

#### Steps

1. **Install backend dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database and Redis credentials
```

3. **Create PostgreSQL database**
```bash
psql -U postgres
CREATE DATABASE seo_analyzer;
\q
```

4. **Run database migrations**
```bash
npm run db:migrate
```

5. **Start the backend**
```bash
npm run dev
```

The backend will run on http://localhost:3001

### Frontend Setup

#### Prerequisites
- Node.js 18+

#### Steps

1. **Install frontend dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

3. **Start the development server**
```bash
npm run dev
```

The frontend will run on http://localhost:3000

---

## Project Structure

```
seo-analyzer/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── api/               # API routes and controllers
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── routes/        # Route definitions
│   │   │   └── services/      # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   └── index.ts           # Main entry point
│   ├── migrations/            # Database migrations
│   ├── tests/                 # Test files
│   ├── .env.example           # Environment variables template
│   ├── Dockerfile             # Docker configuration
│   ├── package.json           # Dependencies
│   └── tsconfig.json          # TypeScript configuration
│
├── frontend/                  # React/Next.js Application
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── audit/        # Audit components
│   │   │   └── keywords/     # Keyword components
│   │   ├── services/         # API service functions
│   │   ├── styles/           # Global styles
│   │   └��─ types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── .env.local.example    # Environment variables template
│   ├── Dockerfile            # Docker configuration
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── next.config.js        # Next.js configuration
│
├── docker-compose.yml        # Docker Compose configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

---

## API Endpoints

### Websites
- `POST /api/websites` - Create a new website
- `GET /api/websites` - List all websites
- `GET /api/websites/:id` - Get website details
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website

### SEO Audits
- `POST /api/audit/start` - Start a new SEO audit
- `GET /api/audit/:auditId` - Get audit status and results
- `GET /api/audit/:auditId/issues` - Get identified issues
- `GET /api/audit/:auditId/report` - Get audit summary report

### Keyword Research
- `POST /api/keywords/research` - Research keywords
- `GET /api/keywords/tracked/:websiteId` - Get tracked keywords
- `POST /api/keywords/track/:websiteId` - Add keyword to track
- `GET /api/keywords/history/:keywordId` - Get ranking history

### Reports
- `POST /api/reports/generate` - Generate PDF/Excel report
- `GET /api/reports/:reportId` - Get report status
- `GET /api/reports/:reportId/download` - Download report file
- `GET /api/reports/audit/:auditId` - List audit reports

---

## Database Schema

### Tables

**websites** - Store website information
```sql
id (UUID PRIMARY KEY)
user_id (UUID)
domain (VARCHAR UNIQUE)
name (VARCHAR)
description (TEXT)
page_count (INTEGER)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**audits** - Store SEO audit records
```sql
id (UUID PRIMARY KEY)
website_id (UUID)
status (pending/running/completed/failed)
total_issues (INTEGER)
critical_issues (INTEGER)
warning_issues (INTEGER)
info_issues (INTEGER)
score (DECIMAL)
created_at (TIMESTAMP)
completed_at (TIMESTAMP)
```

**audit_issues** - Store identified issues
```sql
id (UUID PRIMARY KEY)
audit_id (UUID)
type (critical/warning/info)
category (VARCHAR)
title (VARCHAR)
description (TEXT)
affected_pages (INTEGER)
recommendation (TEXT)
how_to_fix (TEXT)
priority (INTEGER)
created_at (TIMESTAMP)
```

**keywords** - Store tracked keywords
```sql
id (UUID PRIMARY KEY)
website_id (UUID)
keyword (VARCHAR)
search_volume (INTEGER)
difficulty (DECIMAL)
current_rank (INTEGER)
previous_rank (INTEGER)
url (TEXT)
created_at (TIMESTAMP)
last_checked (TIMESTAMP)
```

**reports** - Store generated reports
```sql
id (UUID PRIMARY KEY)
audit_id (UUID)
report_type (pdf/excel/both)
status (generating/ready/failed)
file_path (TEXT)
created_at (TIMESTAMP)
expires_at (TIMESTAMP)
```

---

## Features

### SEO Audit
- Meta tags analysis (title, description)
- Performance metrics
- Security checks (HTTPS, SSL)
- Technical SEO (robots.txt, sitemap)
- Mobile responsiveness
- Page structure validation
- Link analysis
- Content optimization suggestions

### Keyword Research
- Search volume data
- Keyword difficulty scoring
- CPC (Cost Per Click) information
- Trend analysis (rising, stable, declining)
- Related keywords suggestions
- Keyword grouping

### Ranking Tracking
- Real-time keyword ranking monitoring
- Historical ranking data
- Ranking trend visualization
- Competitor comparison
- SERP position tracking

### Recommendations
- Prioritized action items
- Detailed implementation guides
- Best practices documentation
- Impact assessment
- Difficulty scoring

### Report Generation
- PDF reports with comprehensive audit data
- Excel spreadsheets with detailed metrics
- Custom report templates
- Scheduled report generation
- Email delivery options
- 30-day report storage

---

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm run test
npm run test:coverage

# Frontend tests
cd frontend
npm run test
npm run test:coverage
```

### Code Quality

```bash
# Linting
npm run lint

# Code formatting
npm run format

# Type checking
npm run type-check
```

### Build for Production

```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
npm run start
```

---

## Configuration

### Backend Environment Variables

```env
# Server
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/seo_analyzer

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# APIs (optional)
SERPAPI_KEY=your_api_key
GOOGLE_API_KEY=your_api_key
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Performance Optimization

- **Caching**: Redis caching for frequently accessed data
- **Database Indexing**: Indexed columns for fast queries
- **Lazy Loading**: Frontend images and components
- **Code Splitting**: Next.js automatic route-based splitting
- **Pagination**: Limited results per page
- **CDN Ready**: Static assets optimization

---

## Security

- **HTTPS**: Enforced in production
- **Input Validation**: Joi schema validation
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configurable origin restrictions
- **JWT**: Secure token-based authentication
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Helmet.js security headers

---

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Reset database
cd backend
npm run db:migrate
```

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping
# Should return PONG
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Docker Issues
```bash
# Remove all containers
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

---

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Language**: TypeScript 5
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Web Scraping**: Puppeteer
- **Validation**: Joi
- **Authentication**: JWT
- **Logging**: Winston
- **Security**: Helmet.js, express-rate-limit

### Frontend
- **Framework**: React 18
- **SSR/Routing**: Next.js 14
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Validation**: Zod

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

## License

MIT License - see LICENSE file for details

---

## Roadmap

- [ ] User authentication and multi-tenant support
- [ ] Advanced competitor analysis
- [ ] AI-powered recommendations
- [ ] Custom audit templates
- [ ] API webhooks
- [ ] Slack/email notifications
- [ ] Advanced analytics dashboard
- [ ] Scheduled audits
- [ ] Team collaboration features
- [ ] White-label options

---

**Happy SEO analyzing!**
