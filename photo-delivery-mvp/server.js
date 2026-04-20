#!/usr/bin/env node

/**
 * Production startup script for Railway deployment
 * Handles Prisma migrations gracefully and starts Next.js server
 */

import { spawn } from 'child_process';
import { promisify } from 'util';
import { execFile } from 'child_process';

const exec = promisify(execFile);

async function runCommand(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: false
    });

    child.on('close', (code) => {
      resolve(code);
    });

    child.on('error', reject);
  });
}

async function start() {
  try {
    // Check for required environment variables
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️  DATABASE_URL is not set. Using Next.js without database operations.');
      console.log('Set DATABASE_URL environment variable to enable database features.');
    }

    if (!process.env.NEXTAUTH_SECRET) {
      console.warn('⚠️  NEXTAUTH_SECRET is not set. NextAuth will not work correctly in production.');
      console.log('Set NEXTAUTH_SECRET environment variable for authentication.');
    }

    if (!process.env.NEXTAUTH_URL) {
      console.warn('⚠️  NEXTAUTH_URL is not set. NextAuth callback URL will be undefined.');
      console.log('Set NEXTAUTH_URL environment variable (e.g., https://your-app.up.railway.app).');
    }

    // Attempt to run Prisma migrations if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      console.log('📦 Attempting to run Prisma migrations...');
      const code = await runCommand('npx', ['prisma', 'migrate', 'deploy']);
      if (code === 0) {
        console.log('✅ Prisma migrations completed successfully.');
      } else {
        console.warn('⚠️  Prisma migration failed with code', code);
        console.log('Continuing with server startup. Database may not be fully initialized.');
      }
    }

    // Start the production Next.js server
    console.log('🚀 Starting Next.js production server...');
    console.log(`📍 Server will listen on PORT: ${process.env.PORT || 3000}`);
    
    const exitCode = await runCommand('next', ['start']);
    process.exit(exitCode);
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

start().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
