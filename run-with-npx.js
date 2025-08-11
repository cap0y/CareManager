#!/usr/bin/env node
// Fallback runner that uses npx if direct node execution fails
// This provides an alternative when npm is available but node path has issues

import { spawn } from 'child_process';
import { promises as fs } from 'fs';

console.log('[NPX FALLBACK] Starting server with npx fallback...');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '8080';

console.log(`[NPX FALLBACK] Environment: ${process.env.NODE_ENV}`);
console.log(`[NPX FALLBACK] Port: ${process.env.PORT}`);

// Try different execution methods
const executionMethods = [
  // Method 1: Direct node execution
  { command: 'node', args: ['dist/index.js'], description: 'Direct node execution' },
  
  // Method 2: NPX node execution  
  { command: 'npx', args: ['node', 'dist/index.js'], description: 'NPX node execution' },
  
  // Method 3: NPX with server bundle
  { command: 'npx', args: ['node', 'dist/server/index.js'], description: 'NPX server bundle' },
  
  // Method 4: NPX with tsx (development fallback)
  { command: 'npx', args: ['tsx', 'server/index.ts'], description: 'NPX tsx execution' }
];

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function tryExecutionMethod(method) {
  return new Promise((resolve, reject) => {
    console.log(`[NPX FALLBACK] Trying: ${method.description}`);
    
    const child = spawn(method.command, method.args, {
      stdio: 'inherit',
      env: process.env
    });
    
    child.on('spawn', () => {
      console.log(`[NPX FALLBACK] Successfully started with: ${method.description}`);
      resolve(child);
    });
    
    child.on('error', (error) => {
      console.log(`[NPX FALLBACK] Failed with ${method.description}:`, error.message);
      reject(error);
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

async function startServer() {
  // Check if required files exist
  const hasDistIndex = await checkFileExists('dist/index.js');
  const hasDistServer = await checkFileExists('dist/server/index.js');
  const hasServerTs = await checkFileExists('server/index.ts');
  
  console.log(`[NPX FALLBACK] File availability:`);
  console.log(`  dist/index.js: ${hasDistIndex}`);
  console.log(`  dist/server/index.js: ${hasDistServer}`);
  console.log(`  server/index.ts: ${hasServerTs}`);
  
  for (const method of executionMethods) {
    try {
      // Skip methods if required files don't exist
      if (method.args.includes('dist/index.js') && !hasDistIndex) continue;
      if (method.args.includes('dist/server/index.js') && !hasDistServer) continue;
      if (method.args.includes('server/index.ts') && !hasServerTs) continue;
      
      const child = await tryExecutionMethod(method);
      
      // Setup signal handlers for graceful shutdown
      process.on('SIGTERM', () => {
        console.log('[NPX FALLBACK] Received SIGTERM, shutting down...');
        child.kill('SIGTERM');
      });
      
      process.on('SIGINT', () => {
        console.log('[NPX FALLBACK] Received SIGINT, shutting down...');
        child.kill('SIGINT');
      });
      
      return; // Success, exit function
      
    } catch (error) {
      // Continue to next method
      continue;
    }
  }
  
  console.error('[NPX FALLBACK] All execution methods failed');
  process.exit(1);
}

startServer();