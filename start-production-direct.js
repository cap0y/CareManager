#!/usr/bin/env node
// Direct production starter that bypasses npm entirely
// Uses only Node.js runtime available in Cloud Run containers

// Production environment setup
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || '8080';

console.log(`[DIRECT START] Starting Korean Caregiving Platform on port ${PORT}`);
console.log(`[DIRECT START] Node.js: ${process.version}`);
console.log(`[DIRECT START] Environment: ${process.env.NODE_ENV}`);

// Set up graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`[DIRECT START] Received ${signal}, shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Error handling
process.on('uncaughtException', (error) => {
  console.error('[DIRECT START] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[DIRECT START] Unhandled Rejection:', reason);
  process.exit(1);
});

// Import and run the main entry point
try {
  await import('./dist/index.js');
} catch (error) {
  console.error('[DIRECT START] Failed to import main module:', error.message);
  
  // Fallback: try running server directly
  try {
    console.log('[DIRECT START] Trying direct server import...');
    await import('./dist/server/index.js');
  } catch (serverError) {
    console.error('[DIRECT START] Server import also failed:', serverError.message);
    process.exit(1);
  }
}