# Production Deployment Guide

This guide covers deploying this Next.js app to production on Railway with Nixpacks.

## Quick Start

### Prerequisites
- Railway account with Postgres plugin
- GitHub repository with this code

### Deployment Steps

1. **Connect GitHub Repository**
   - Go to Railway dashboard
   - Create a new service from GitHub
   - Select this repository

2. **Add PostgreSQL Database**
   - In Railway, add a Postgres plugin to your service
   - This automatically injects `DATABASE_URL`

3. **Set Environment Variables**
   - `NEXTAUTH_URL` - Your public app URL (e.g., `https://my-app.up.railway.app`)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - Any S3/AWS credentials if using external storage

4. **Deploy**
   - Railway automatically detects `package.json`
   - Builds with: `npm run build`
   - Starts with: `npm start`

## Startup Process

The app starts via `server.js` which:

1. **Validates Environment Variables**
   - Checks for `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - Logs warnings if optional variables are missing
   - App still starts even if some are incomplete

2. **Runs Prisma Migrations**
   - Attempts `prisma migrate deploy --skip-generate`
   - If migrations fail (e.g., database not ready), logs warning
   - **App continues to start regardless of migration status**

3. **Starts Next.js Server**
   - Listens on `process.env.PORT` (Railway sets this, default 3000)
   - Binds to all network interfaces
   - Returns HTML responses immediately

## Port Binding

- Railway sets `PORT` environment variable automatically
- Next.js respects this via `next start`
- App binds to `0.0.0.0:PORT` for Railway's load balancer

Example:
```bash
PORT=5000 npm start  # Listens on port 5000
PORT=8080 npm start  # Listens on port 8080
```

## Build Process

```bash
npm run build
```

Runs:
1. `prisma generate` - Generates Prisma client
2. `next build` - Creates optimized production build in `.next/`

Output includes:
- Static prerendered pages
- Dynamic server routes
- 49.3 kB middleware bundle
- ~87-95 kB First Load JS per route

## Troubleshooting

### Database Connection Error
```
Error: P1001: Can't reach database server
```
- App will still start
- Set `DATABASE_URL` and restart
- If using Railway Postgres, ensure plugin is linked

### Missing NEXTAUTH_SECRET
- Warning logged on startup
- Authentication won't work
- Set via Railway environment variables

### Port Binding Issues
- Railway automatically assigns PORT
- App respects this automatically with `next start`
- No manual configuration needed

## Prisma Migrations

### How Migrations Run

Migrations happen at startup via `npm start` → `server.js` → `prisma migrate deploy`

If migrations fail:
- Warning is logged
- App continues to start
- Database schema may be out of sync

### Running Migrations Manually

In Railway Shell or locally:
```bash
npx prisma migrate deploy
```

### Creating New Migrations

Locally (with local DB):
```bash
npx prisma migrate dev --name your_migration_name
```

This:
1. Creates migration file in `prisma/migrations/`
2. Runs it on local database
3. Generates Prisma client

Commit the migration file to git.

## Environment Variables Reference

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection | Yes | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | OAuth redirect URL | Yes | `https://my-app.up.railway.app` |
| `NEXTAUTH_SECRET` | Session encryption key | Yes | `base64-random-string` |
| `PORT` | Server port (set by Railway) | No | `3000` or `8080` |
| `AWS_ACCESS_KEY_ID` | S3 access key | No | `ABC123...` |
| `AWS_SECRET_ACCESS_KEY` | S3 secret | No | `xyz789...` |

## Health Checks

The app responds to requests immediately once started:
- Landing page: `GET /`
- Register page: `GET /register`
- NextAuth routes: `GET/POST /api/auth/*`

No database is required for these initial responses.

## Production Logs

Expected startup logs:
```
🚀 Starting photo-delivery-mvp production server...
📍 Environment: production
📦 PORT: 3000
✅ DATABASE_URL is configured
📊 Running Prisma migrations...
✅ Migrations completed successfully
🚀 Starting Next.js server...
  ▲ Next.js 14.2.18
 ✓ Ready in 350ms
```

## Rolling Updates

Railway handles zero-downtime deployments:
1. New build completes
2. New service instance starts with new code
3. Old instance receives no new connections
4. Old instance shuts down gracefully

Migration locks prevent concurrent migrations during this process.

## Monitoring

Monitor via Railway dashboard:
- Memory/CPU usage
- Logs and startup messages
- Environment variables
- Network traffic

## Scaling

To add replicas:
1. Railway dashboard → Service Settings
2. Set replica count
3. Load balancer automatically distributes traffic

## Contact & Support

For deployment issues:
1. Check Railway documentation: https://docs.railway.app
2. View startup logs in Railway dashboard
3. Ensure environment variables are set correctly
4. Verify Postgres is running and accessible
