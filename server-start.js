#!/usr/bin/env node
/**
 * Direct Node.js entry point for Cloud Run deployment
 * This script runs the server without requiring npm or package.json scripts
 * Uses tsx to run TypeScript directly, avoiding bundling complications
 */

// Cloud Run environment setup
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '8080';

// Memory optimization for Cloud Run
if (!process.env.NODE_OPTIONS) {
  process.env.NODE_OPTIONS = '--max-old-space-size=512';
}

console.log('[CLOUD RUN] Starting Korean caregiving platform server...');
console.log(`[CLOUD RUN] Node.js version: ${process.version}`);
console.log(`[CLOUD RUN] Environment: ${process.env.NODE_ENV}`);
console.log(`[CLOUD RUN] Port: ${process.env.PORT}`);

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the server using tsx directly
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: __dirname,
  env: process.env,
  stdio: 'inherit'
});

// Graceful shutdown handlers
const shutdown = (signal) => {
  console.log(`[CLOUD RUN] Received ${signal}, shutting down gracefully...`);
  serverProcess.kill(signal);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle server process lifecycle
serverProcess.on('exit', (code, signal) => {
  if (signal) {
    console.log(`[CLOUD RUN] Server terminated by signal: ${signal}`);
    process.exit(0);
  } else if (code !== 0) {
    console.error(`[CLOUD RUN] Server exited with code: ${code}`);
    process.exit(code);
  } else {
    console.log('[CLOUD RUN] Server exited successfully');
    process.exit(0);
  }
});

serverProcess.on('error', (error) => {
  console.error('[CLOUD RUN] Failed to start server:', error.message);
  process.exit(1);
});