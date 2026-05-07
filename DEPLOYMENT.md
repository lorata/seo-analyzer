# SEO Analyzer Pro - Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Server with 2GB+ RAM
- PostgreSQL 14+
- Redis 7+
- Node.js 18+ (for manual deployment)

## Docker Deployment

### Production Build

1. **Update environment variables**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# Edit files with production values
```

2. **Build images**
```bash
docker-compose build
```

3. **Start services**
```bash
docker-compose up -d
```

### Scaling

To scale services:

```bash
docker-compose up -d --scale backend=3
```

## Manual Deployment

### Backend Deployment

1. **Install dependencies**
```bash
cd backend
npm install --production
```

2. **Build application**
```bash
npm run build
```

3. **Set environment variables**
```bash
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export REDIS_URL=redis://...
```

4. **Run migrations**
```bash
npm run db:migrate
```

5. **Start server**
```bash
npm start
```

### Frontend Deployment

1. **Install dependencies**
```bash
cd frontend
npm install --production
```

2. **Build application**
```bash
npm run build
```

3. **Start server**
```bash
npm start
```

## Server Setup

### Ubuntu 22.04

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PostgreSQL**
```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo -u postgres psql
CREATE DATABASE seo_analyzer;
\q
```

3. **Install Redis**
```bash
sudo apt-get install -y redis-server
```

4. **Install PM2**
```bash
sudo npm install -g pm2
```

## Nginx Configuration

```nginx
upstream backend {
  server localhost:3001;
}

upstream frontend {
  server localhost:3000;
}

server {
  listen 80;
  server_name example.com www.example.com;
  
  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name example.com www.example.com;
  
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
  
  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  
  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  
  # Backend API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## SSL Certificate

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d example.com -d www.example.com
```

## PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'seo-analyzer-backend',
      script: './backend/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 'max',
      exec_mode: 'cluster'
    },
    {
      name: 'seo-analyzer-frontend',
      script: './frontend/.next/standalone/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Database Backup

### Automated Backup

```bash
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -U postgres seo_analyzer | gzip > "$BACKUP_DIR/seo_analyzer_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Monitoring

### Health Checks

```bash
# Check backend
curl http://localhost:3001/health

# Check database
psql -U postgres -c "SELECT 1"

# Check Redis
redis-cli ping
```

### Logs

```bash
# Backend logs
tail -f /var/log/seo-analyzer/backend.log

# Frontend logs
tail -f /var/log/seo-analyzer/frontend.log

# System logs
journalctl -u nginx -f
```

## Performance Tuning

### PostgreSQL

```sql
-- Increase shared_buffers
ALTER SYSTEM SET shared_buffers = '256MB';

-- Increase effective_cache_size
ALTER SYSTEM SET effective_cache_size = '1GB';

SELECT pg_reload_conf();
```

### Redis

```bash
# Increase max memory
redis-cli CONFIG SET maxmemory 512mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql postgresql://user:pass@localhost:5432/seo_analyzer

# Check connections
psql -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

### Out of Memory

```bash
# Check memory usage
free -h

# Check process memory
top -o %MEM
```

### Port Already in Use

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Upgrades

### Update Dependencies

```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix
```

### Database Migration

```bash
# Create backup first
pg_dump seo_analyzer > backup.sql

# Run migrations
npm run db:migrate
```

## Rollback

```bash
# Restore from backup
psql seo_analyzer < backup.sql

# Restart services
docker-compose restart
```
