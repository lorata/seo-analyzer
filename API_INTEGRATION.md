# SEO Analyzer Pro - API Integration Guide

## Getting API Keys

### SerpAPI (for Keyword Research)

1. Visit https://serpapi.com
2. Sign up for free account
3. Copy your API key
4. Add to `.env`: `SERPAPI_KEY=your_key`

### Google APIs (optional)

1. Go to Google Cloud Console
2. Create new project
3. Enable Google Search Console API
4. Create API key
5. Add to `.env`: `GOOGLE_API_KEY=your_key`

## Integration Examples

### Keyword Research API

```typescript
// Using SerpAPI
const response = await axios.get('https://serpapi.com/search', {
  params: {
    q: 'keyword here',
    api_key: process.env.SERPAPI_KEY
  }
})
```

### Search Rankings API

```typescript
// Check keyword ranking
const response = await axios.get('https://serpapi.com/search', {
  params: {
    q: 'keyword',
    location: 'United States',
    api_key: process.env.SERPAPI_KEY
  }
})

const ranking = response.data.organic_results.findIndex(
  r => r.link === 'your-site.com'
) + 1
```

## Webhook Integration

The application can send webhook notifications when audits complete:

```typescript
// Configure webhook URL
const webhookUrl = process.env.WEBHOOK_URL

// Send notification
await axios.post(webhookUrl, {
  event: 'audit.completed',
  auditId: audit.id,
  websiteId: website.id,
  issuesCount: issues.length
})
```

## Third-party Service Integration

### Slack Notifications

```typescript
import axios from 'axios'

const notifySlack = async (message: string) => {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: message
  })
}
```

### Email Reports

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

await transporter.sendMail({
  from: 'noreply@example.com',
  to: user.email,
  subject: 'Your SEO Audit Report',
  html: reportHTML
})
```

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP
- Configure in `src/index.ts`

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
```

## API Authentication

Currently uses basic validation. For production, implement JWT:

```typescript
// Middleware to verify JWT
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

## Response Format

All API responses follow this format:

```json
{
  "data": {},
  "error": null,
  "status": 200
}
```

For errors:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

## Pagination

List endpoints support pagination:

```
GET /api/websites?page=1&limit=20

Response:
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

## Versioning

To add API versioning:

```typescript
app.use('/api/v1', routes)
app.use('/api/v2', routes)
```

## Monitoring

Monitor API health:

```bash
GET /health

Response:
{
  "status": "OK",
  "timestamp": "2026-05-07T10:00:00Z"
}
```

## Rate Limit Headers

Responses include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```
