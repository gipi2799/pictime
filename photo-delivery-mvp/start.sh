#!/bin/bash
# Production startup wrapper for Railway deployments
# Attempts migrations but continues even if they fail

set -e

# Log startup
echo "🚀 Starting photo-delivery-mvp production server..."
echo "📍 Environment: production"
echo "📦 PORT: ${PORT:-3000}"

# Check environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  WARNING: DATABASE_URL not set"
else
  echo "✅ DATABASE_URL is configured"
  echo "📊 Running Prisma migrations..."
  
  if npx prisma migrate deploy --skip-generate; then
    echo "✅ Migrations completed successfully"
  else
    echo "⚠️  Migration failed - continuing with server startup"
  fi
fi

# Check auth environment
if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "⚠️  WARNING: NEXTAUTH_SECRET not set"
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "⚠️  WARNING: NEXTAUTH_URL not set"
fi

# Start Next.js production server
echo "🚀 Starting Next.js server..."
exec next start
