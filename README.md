# SEO Analyzer Pro

A professional SEO analysis and optimization tool designed for websites with 300-500 pages. Provides comprehensive SEO audits, competitive keyword research, ranking analysis, and actionable recommendations with detailed fix guides.

## Features

- **SEO Audit**: Comprehensive technical SEO analysis
- **SEO Analysis**: On-page and off-page optimization review
- **Keyword Research**: Identify high-potential keywords with search volume and difficulty metrics
- **Ranking Tracking**: Monitor keyword rankings over time
- **Actionable Recommendations**: Prioritized fix suggestions with implementation guides
- **Professional Reports**: Download detailed PDF/Excel reports
- **Dashboard**: Real-time metrics and insights

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** for relational data
- **Redis** for caching and job queues
- **Puppeteer** for web scraping and rendering analysis
- **TypeScript** for type safety

### Frontend
- **React 18** with TypeScript
- **Next.js** for server-side rendering and routing
- **TailwindCSS** for styling (professional, clean design)
- **Recharts** for data visualization
- **React Query** for server state management
- **Axios** for API communication

## Project Structure

```
seo-analyzer/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── styles/
│   ├── public/
│   ├── .env.local.example
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/lorata/seo-analyzer.git
cd seo-analyzer
```

2. **Backend setup**
```bash
cd backend
cp .env.example .env
npm install
npm run build
npm run dev
```

3. **Frontend setup**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

4. **Database setup**
```bash
cd backend
npm run db:migrate
npm run db:seed
```

## API Endpoints

### Websites
- `POST /api/websites` - Create new website
- `GET /api/websites/:id` - Get website details
- `GET /api/websites` - List all websites

### SEO Audit
- `POST /api/audit/start` - Start SEO audit
- `GET /api/audit/:auditId` - Get audit results
- `GET /api/audit/:auditId/issues` - Get identified issues

### Keyword Research
- `GET /api/keywords/research` - Perform keyword research
- `GET /api/keywords/ranking/:websiteId` - Get ranking keywords
- `POST /api/keywords/track` - Add keywords to track

### Reports
- `GET /api/reports/:reportId/download` - Download report (PDF/Excel)
- `POST /api/reports/generate` - Generate new report

## Development

### Running Tests
```bash
# Backend
cd backend
npm run test
npm run test:coverage

# Frontend
cd frontend
npm run test
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run format
```

## Performance Optimization

- Page caching with Redis
- Database query optimization
- Frontend bundle optimization
- Image lazy loading
- Efficient data pagination

## Security

- HTTPS enforced
- Input validation and sanitization
- Rate limiting
- CORS configuration
- JWT authentication
- Database query parameterization

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
