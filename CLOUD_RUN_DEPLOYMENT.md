# Cloud Run Deployment Guide

## Overview

This document provides a comprehensive guide for deploying the Korean Caregiving Platform to Google Cloud Run without npm dependencies.

## Issues Fixed

The original deployment failed with these errors:
- `npm executable not found in deployment container PATH`
- `Cloud Run deployment environment missing npm/Node.js runtime`
- `Run command 'npm run start' fails because npm is not available`

## Solution Applied

### 1. Direct Node.js Execution
- **Build Command**: `node scripts/build-for-deployment.js`
- **Run Command**: `node dist/index.js`
- **Entry Point**: Direct Node.js execution bypasses npm entirely

### 2. Cloud Run Optimized Build Process

The deployment build script (`scripts/build-for-deployment.js`) now creates:

#### Essential Artifacts
- `dist/index.js` - Main Cloud Run entry point with graceful shutdown
- `dist/server/index.js` - Bundled backend server (ESM format)
- `dist/public/` - Frontend build artifacts  
- `dist/package.json` - Minimal production package.json

#### Build Features
- Frontend build with Vite
- Backend bundling with esbuild
- ESM module support
- Memory optimization for Cloud Run
- Graceful shutdown handlers (SIGTERM/SIGINT)
- Comprehensive error logging

### 3. Production Package.json

Created minimal `dist/package.json` for Cloud Run:

```json
{
  "name": "korean-caregiving-platform",
  "version": "1.0.0",
  "type": "module",
  "description": "Korean caregiving platform - Production build",
  "main": "index.js",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

### 4. Cloud Run Entry Point

The `dist/index.js` entry point provides:

- **Environment Setup**: Production mode with Cloud Run PORT (8080)
- **Memory Optimization**: 1GB memory limit compatible
- **Graceful Shutdown**: SIGTERM/SIGINT signal handling
- **Error Handling**: Comprehensive error logging and stack traces
- **Direct Import**: ESM module loading of bundled server

## Deployment Process

### Step 1: Build for Production
```bash
node scripts/build-for-deployment.js
```

This creates all necessary deployment artifacts in the `dist/` directory.

### Step 2: Verify Build
The build process verifies these required files:
- ✓ `dist/index.js` - Main entry point
- ✓ `dist/server/index.js` - Server bundle
- ✓ `dist/public/index.html` - Frontend
- ✓ `dist/package.json` - Production config

### Step 3: Deploy to Cloud Run
The `.replit` configuration should use:
- **Build**: `["node", "scripts/build-for-deployment.js"]`
- **Run**: `["node", "dist/index.js"]`

## Cloud Run Configuration

### Environment Variables
- `PORT`: Provided by Cloud Run (defaults to 8080)
- `NODE_ENV`: Set to 'production'
- `NODE_OPTIONS`: Memory optimized for Cloud Run containers
- `DATABASE_URL`: PostgreSQL connection (configured via secrets)

### Container Specifications
- **Node.js Version**: 20+
- **Memory**: Optimized for 1GB Cloud Run containers
- **Networking**: Listens on 0.0.0.0 (all interfaces)
- **Protocol**: HTTP/HTTPS with WebSocket support

### Runtime Features
- **ESM Modules**: Full ES module support
- **Static Assets**: Frontend served from dist/public/
- **API Routes**: Backend API available at /api/*
- **WebSocket**: Real-time communication via Socket.IO

## Verification

To test the deployment locally:

```bash
# Build the application
node scripts/build-for-deployment.js

# Test the Cloud Run entry point
cd dist && node index.js
```

Expected output:
```
[CLOUD RUN] Starting server...
[CLOUD RUN] Node.js version: v20.x.x  
[CLOUD RUN] Environment: production
[CLOUD RUN] Port: 8080
[CLOUD RUN] Working directory: /path/to/dist
[CLOUD RUN] Server module loaded successfully
서버 실행 중: http://0.0.0.0:8080
API 엔드포인트: http://0.0.0.0:8080/api
WebSocket 서버 실행 중: ws://0.0.0.0:8080
```

## Troubleshooting

### Common Issues
1. **Module import errors**: Verify ESM format with `"type": "module"`
2. **Port binding**: Ensure server listens on 0.0.0.0 for Cloud Run
3. **Memory limits**: Monitor memory usage in production logs
4. **Database connections**: Verify DATABASE_URL environment variable

### Logs and Debugging
The Cloud Run entry point provides detailed logging for:
- Server startup process
- Environment configuration
- Module loading status  
- Error stack traces
- Graceful shutdown events

## Success Criteria

✅ Build process completes without errors
✅ All required artifacts created in dist/
✅ Entry point is executable and starts server
✅ Server binds to Cloud Run compatible host/port
✅ Frontend assets served correctly
✅ API endpoints accessible
✅ WebSocket connections working
✅ Graceful shutdown on container termination

The deployment is now ready for Cloud Run with direct Node.js execution, bypassing all npm dependencies.