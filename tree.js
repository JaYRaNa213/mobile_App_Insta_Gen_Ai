#!/usr/bin/env node
/**
 * Print a directory tree to tree.txt (default), ignoring node_modules and common build folders.
 * Usage examples:
 *   node tree.js
 *   node tree.js . out.txt
 *   node tree.js "C:\\path\\to\\project" tree.txt "node_modules,.git,dist,build"
 *   node tree.js . tree.txt "" 4   // limit depth to 4
 */

const fs = require('fs');
const path = require('path');

const startDir = path.resolve(process.argv[2] || '.');
const outFile  = path.resolve(process.argv[3] || 'tree.txt');
const excludesArg = (process.argv[4] || 'node_modules,.git,.next,.expo,dist,build,.turbo,.parcel-cache,.DS_Store,.vscode,.idea').trim();
const maxDepth = Number.isFinite(+process.argv[5]) ? +process.argv[5] : Infinity;

const EXCLUDES = new Set(
  excludesArg
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
);

function isExcluded(name) {
  // exact folder/file name match exclusion
  return EXCLUDES.has(name);
}

function safeReadDir(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return []; }
}

function formatLine(prefix, isLast, name) {
  return `${prefix}${isLast ? '└── ' : '├── '}${name}`;
}

function nextPrefix(prefix, isLast) {
  return `${prefix}${isLast ? '    ' : '│   '}`;
}

function printTree(dir, depth = 0, prefix = '') {
  if (depth > maxDepth) return [];

  let entries = safeReadDir(dir);

  // Filter excluded names
  entries = entries.filter(d => !isExcluded(d.name));

  // Sort: directories first, then files, alphabetical
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

  const lines = [];
  entries.forEach((entry, idx) => {
    const isLast = idx === entries.length - 1;
    const full = path.join(dir, entry.name);
    lines.push(formatLine(prefix, isLast, entry.name));
    if (entry.isDirectory()) {
      lines.push(...printTree(full, depth + 1, nextPrefix(prefix, isLast)));
    }
  });
  return lines;
}

// Start
const header = `${path.basename(startDir)}\n`;
const body = printTree(startDir);
const output = header + body.map(l => l).join('\n') + '\n';

try {
  fs.writeFileSync(outFile, output, 'utf8');
  console.log(`✓ Wrote directory tree to: ${outFile}`);
  console.log(`(Excluded: ${[...EXCLUDES].join(', ')})`);
} catch (err) {
  console.error('Failed to write tree file:', err.message);
  process.exit(1);
}
