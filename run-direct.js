#!/usr/bin/env node
// Simple direct runner for Cloud Run that bypasses npm entirely
// Uses the system Node.js runtime available in Cloud Run containers

// Production environment setup
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || '8080';

console.log(`[DIRECT RUN] Starting on port ${PORT}`);
console.log(`[DIRECT RUN] Node.js: ${process.version}`);

// Import and run the server
try {
  await import('./dist/server/index.js');
} catch (error) {
  console.error('[DIRECT RUN] Startup failed:', error.message);
  process.exit(1);
}