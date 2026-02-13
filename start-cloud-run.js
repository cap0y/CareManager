#!/usr/bin/env node
// Direct Node.js entry point for Cloud Run - avoids npm PATH dependency
// This approach bypasses npm entirely and uses system Node.js runtime

// Set Cloud Run compatible environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '8080';

// Cloud Run memory optimization
if (!process.env.NODE_OPTIONS) {
  process.env.NODE_OPTIONS = '--max-old-space-size=512';
}

console.log('[CLOUD RUN] Direct Node.js startup');
console.log('[CLOUD RUN] Node.js version:', process.version);
console.log('[CLOUD RUN] Environment:', process.env.NODE_ENV);
console.log('[CLOUD RUN] Port:', process.env.PORT);

// Graceful shutdown handling for Cloud Run
const gracefulShutdown = (signal) => {
  console.log(`[CLOUD RUN] Received ${signal}, shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server by importing the bundled entry point
import('./dist/server/index.js')
  .then(() => {
    console.log('[CLOUD RUN] Server started successfully');
  })
  .catch((error) => {
    console.error('[CLOUD RUN] Failed to start server:', error);
    console.error('[CLOUD RUN] Stack trace:', error.stack);
    process.exit(1);
  });