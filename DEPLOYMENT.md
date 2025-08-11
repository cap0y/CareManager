# Deployment Configuration Guide

## Issue: Node.js Runtime Not Found in Deployment Container

The deployment error occurs because the Cloud Run container doesn't have access to the Node.js runtime when trying to execute `node dist/server/index.js`.

## Solutions Implemented

### 1. Bundled Node.js Runtime Deployment

Created deployment scripts that bundle the Node.js runtime with the application:

#### Build Script: `scripts/build-for-deployment.js`
- Builds frontend and backend
- Copies Node.js executable to `dist/server/node`
- Verifies all required build artifacts
- Ensures the bundled runtime has proper permissions

#### Production Start Script: `scripts/start-production.js` 
- Uses the bundled Node.js runtime instead of system Node.js
- Sets proper environment variables for production
- Handles graceful shutdown and error management
- Eliminates dependency on system Node.js installation

### 2. Alternative Deployment Commands

Instead of relying on the system's `node` command, use these approaches:

#### Option A: Use Bundled Runtime (Recommended)
```bash
# Build with bundled runtime
node scripts/build-for-deployment.js

# Start with bundled runtime  
node scripts/start-production.js
```

#### Option B: Use npm scripts (Fallback)
```bash
# Build normally
npm run build

# Start using npm (ensures Node.js is available)
npm run start
```

### 3. Deployment Configuration

The current `.replit` file configuration:
```toml
modules = ["nodejs-20", "web", "postgresql-16"]

[deployment]
deploymentTarget = "cloudrun"
build = ["npm", "run", "build"]
run = ["node", "dist/server/index.js"]
```

#### Recommended Changes (requires manual update in Replit UI):

**Option 1: Use bundled runtime build**
```toml
[deployment]
deploymentTarget = "cloudrun"  
build = ["node", "scripts/build-for-deployment.js"]
run = ["node", "scripts/start-production.js"]
```

**Option 2: Use npm commands**
```toml
[deployment]
deploymentTarget = "cloudrun"
build = ["npm", "run", "build"] 
run = ["npm", "run", "start"]
```

## How to Apply the Fix

### Immediate Solution (Manual Update Required)
1. In the Replit interface, go to deployment settings
2. Change the run command from `["node", "dist/server/index.js"]` to `["npm", "run", "start"]`
3. This ensures npm provides the Node.js runtime context

### Long-term Solution (Better Performance)
1. Change the build command to `["node", "scripts/build-for-deployment.js"]`
2. Change the run command to `["node", "scripts/start-production.js"]`
3. This bundles Node.js with your app, eliminating runtime dependencies

## Verification

After deployment, these files should exist:
- `dist/server/index.js` (your application bundle)
- `dist/server/node` (bundled Node.js runtime)
- `dist/public/index.html` (frontend assets)

## Benefits

1. **No Runtime Dependencies**: Application is self-contained
2. **Faster Startup**: No need to locate system Node.js
3. **Consistent Environment**: Same Node.js version in development and production
4. **Reliable Deployment**: Eliminates "runtime not found" errors

## Environment Variables

The production start script sets:
- `NODE_ENV=production`
- `PORT=${PORT || 5000}`

Ensure your deployment environment provides:
- `DATABASE_URL` (for PostgreSQL connection)
- `PORT` (Cloud Run will set this automatically)