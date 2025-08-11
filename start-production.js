#!/usr/bin/env node
// Production starter that uses tsx instead of bundled files
import { spawn } from 'child_process';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('[PRODUCTION] Starting server with tsx...');

// Set production environment
const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: process.env.PORT || '8080'
};

// Start server with tsx (no bundling required)
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: projectRoot,
  env: env,
  stdio: 'inherit'
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('[PRODUCTION] Shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('[PRODUCTION] Shutting down gracefully...');
  serverProcess.kill('SIGINT');
});

serverProcess.on('exit', (code) => {
  process.exit(code || 0);
});
