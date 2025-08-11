#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function removePath(relativePath) {
  const target = path.resolve(projectRoot, relativePath);
  try {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`[clean] removed: ${relativePath}`);
  } catch (err) {
    console.warn(`[clean] skip (not found): ${relativePath}`);
  }
}

function run(base = false, cacheOnly = false, all = false) {
  if (base || all) {
    [
      'dist',
      '.cache',
      'node_modules/.cache',
    ].forEach(removePath);
  }

  if (cacheOnly || all) {
    [
      '.vite',
      'node_modules/.vite',
      'client/node_modules/.vite',
    ].forEach(removePath);
  }

  if (all) {
    [
      'client/dist',
    ].forEach(removePath);
  }
}

const args = process.argv.slice(2);
const isAll = args.includes('--all');
const isCache = args.includes('--cache');

if (isAll) run(true, true, true);
else if (isCache) run(false, true, false);
else run(true, false, false); 