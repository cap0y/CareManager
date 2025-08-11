#!/usr/bin/env node
// Simple production runner that bypasses npm entirely
// This is the most minimal Cloud Run compatible entry point

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '8080';

console.log('[PRODUCTION] Starting server...');
console.log(`[PRODUCTION] Environment: ${process.env.NODE_ENV}`);
console.log(`[PRODUCTION] Port: ${process.env.PORT}`);

// Graceful shutdown
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

// Import and start server
try {
  await import('./dist/index.js');
} catch (error) {
  console.error('[PRODUCTION] Failed to start:', error.message);
  process.exit(1);
}