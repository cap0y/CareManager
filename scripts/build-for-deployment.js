#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('[DEPLOYMENT BUILD] Starting deployment build process...');

try {
  // Step 1: Clean only the dist directory (safer than npm run clean)
  console.log('[DEPLOYMENT BUILD] Cleaning previous builds...');
  const distPath = path.resolve(projectRoot, 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('[DEPLOYMENT BUILD] Removed dist directory');
  }

  // Step 2: Build frontend with Vite
  console.log('[DEPLOYMENT BUILD] Building frontend...');
  execSync('vite build', { cwd: projectRoot, stdio: 'inherit' });

  // Step 3: Build backend with esbuild (optimized for Cloud Run)
  console.log('[DEPLOYMENT BUILD] Building backend with Cloud Run optimizations...');
  const esbuildCommand = [
    'esbuild server/index.ts',
    '--bundle',
    '--platform=node',
    '--target=node20',  // Updated to Node 20 for better compatibility
    '--format=esm',
    '--sourcemap',
    '--minify',
    '--outfile=dist/server/index.js',
    '--external:pg-native',
    '--external:*.node',
    '--external:fsevents',
    '--external:@google-cloud/*',
    '--external:bufferutil',
    '--external:utf-8-validate',
    '--banner:js="import { createRequire } from \'module\'; const require = createRequire(import.meta.url); const __filename = import.meta.url; const __dirname = import.meta.dirname;"',
    '--define:process.env.NODE_ENV=\\"production\\"'
  ].join(' ');
  
  execSync(esbuildCommand, { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 3.1: Create optimized main entry point for Cloud Run (no bundled Node.js)
  console.log('[DEPLOYMENT BUILD] Creating Cloud Run optimized entry point...');
  execSync('node scripts/create-cloud-run-entry.js', { cwd: projectRoot, stdio: 'inherit' });

  // Step 4: Create minimal package.json for Cloud Run production environment
  console.log('[DEPLOYMENT BUILD] Creating production package.json for Cloud Run...');
  const productionPackageJson = {
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
  };
  
  fs.writeFileSync(
    path.resolve(projectRoot, 'dist/package.json'),
    JSON.stringify(productionPackageJson, null, 2),
    'utf8'
  );
  console.log('[DEPLOYMENT BUILD] ✓ Production package.json created');

  // Step 5: Skip Node.js runtime bundling - use system Node.js in Cloud Run
  console.log('[DEPLOYMENT BUILD] Using system Node.js runtime for Cloud Run compatibility...');

  // Step 6: Verify essential build artifacts for Cloud Run
  console.log('[DEPLOYMENT BUILD] Verifying essential build artifacts...');
  const requiredFiles = [
    'dist/index.js',           // Main Cloud Run entry point
    'dist/server/index.js',    // Bundled server code
    'dist/public/index.html',  // Frontend build
    'dist/package.json'        // Production package.json
  ];

  for (const file of requiredFiles) {
    const filePath = path.resolve(projectRoot, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required build artifact missing: ${file}`);
    }
    console.log(`[DEPLOYMENT BUILD] ✓ ${file}`);
  }

  // Verify entry point is executable
  const entryPath = path.resolve(projectRoot, 'dist/index.js');
  try {
    fs.chmodSync(entryPath, 0o755);
    console.log('[DEPLOYMENT BUILD] ✓ Entry point is executable');
  } catch (err) {
    console.warn('[DEPLOYMENT BUILD] Could not set executable permissions on entry point');
  }

  console.log('[DEPLOYMENT BUILD] Build completed successfully!');
  console.log('[DEPLOYMENT BUILD] Ready for Cloud Run deployment with system Node.js runtime');
  console.log('[DEPLOYMENT BUILD] Entry point: dist/index.js');
  console.log('[DEPLOYMENT BUILD] Server bundle: dist/server/index.js');
  console.log('[DEPLOYMENT BUILD] Frontend: dist/public/');

} catch (error) {
  console.error('[DEPLOYMENT BUILD] Build failed:', error.message);
  process.exit(1);
}