#!/bin/bash

# Production start script for Cloud Run deployment
# This script handles starting the server with proper Node.js runtime detection

echo "[PRODUCTION START] Starting production server..."

# Set environment variables for Cloud Run
export PORT=${PORT:-8080}
export NODE_ENV=production

# Check if bundled Node.js runtime exists
BUNDLED_NODE="./dist/server/node"
SERVER_BUNDLE="./dist/server/index.js"
MAIN_ENTRY="./dist/index.js"

if [ -f "$MAIN_ENTRY" ]; then
    echo "[PRODUCTION START] Using main entry point (recommended for Cloud Run)"
    exec node "$MAIN_ENTRY"
elif [ -f "$BUNDLED_NODE" ] && [ -f "$SERVER_BUNDLE" ]; then
    echo "[PRODUCTION START] Using bundled Node.js runtime"
    exec "$BUNDLED_NODE" "$SERVER_BUNDLE"
elif [ -f "$SERVER_BUNDLE" ]; then
    echo "[PRODUCTION START] Using system Node.js with server bundle"
    exec node "$SERVER_BUNDLE"
else
    echo "[PRODUCTION START] ERROR: No server bundle found!"
    echo "[PRODUCTION START] Available files in dist:"
    ls -la dist/ || echo "dist directory not found"
    exit 1
fi