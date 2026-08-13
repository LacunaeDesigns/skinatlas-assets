#!/usr/bin/env node
// Flags invisible and ambiguous characters that survive a copy-paste and then
// silently break grep, diffs, and search indexing. Zero dependencies.
//
//   node scripts/check-text.mjs           report, exit 1 on any error-level hit
//   node scripts/check-text.mjs --fix     rewrite files, then report what changed
//   node scripts/check-text.mjs --strict  treat warnings as errors too

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FIX = process.argv.includes('--fix');
const STRICT = process.argv.includes('--strict');

// Dot-directories (.git, .next, .astro, …) are skipped by the walker already.
const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'build', 'out', 'coverage', 'graphify-out', 'vendor',
  'Binaries', 'Intermediate', 'Saved', 'DerivedDataCache', // Unreal generated output
]);
const EXTS = new Set(['.md', '.mdx', '.astro', '.ts', '.tsx', '.js', '.mjs', '.jsx', '.json', '.css', '.html', '.txt', '.yml', '.yaml']);

// A no-break space between two digits is deliberate typography — a thousands
// separator ("16 416") or a unit gap. Never flag it, never rewrite it.
const betweenDigits = (text, offset, length) =>
  /\d/.test(text[offset - 1] ?? '') && /\d/.test(text[offset + length] ?? '');

// Patterns are written as escape sequences on purpose: a literal invisible
// character here would make this file fail its own check.
//
// level: 'error' — never legitimate in this repo, always safe to delete.
// level: 'warn'  — renders as a space, occasionally intentional (e.g. "10 km").
const CHARS = [
  { pattern: '\\u200b', name: 'ZWSP (zero-width space)', level: 'error', fix: '' },
  { pattern: '\\u200c', name: 'ZWNJ', level: 'error', fix: '' },
  { pattern: '\\u200d', name: 'ZWJ', level: 'error', fix: '' },
  { pattern: '\\u2060', name: 'word joiner', level: 'error', fix: '' },
  { pattern: '\\u00ad', name: 'soft hyphen', level: 'error', fix: '' },
  { pattern: '[\\u200e\\u200f\\u202a-\\u202e\\u2066-\\u2069]', name: 'bidi control', level: 'error', fix: '' },
  { pattern: '\\ufeff', name: 'BOM / zero-width no-break space', level: 'error', fix: '' },
  { pattern: '\\u00a0', name: 'NBSP', level: 'warn', fix: ' ', exempt: betweenDigits },
  { pattern: '\\u202f', name: 'narrow NBSP', level: 'warn', fix: ' ', exempt: betweenDigits },
  { pattern: '[\\u2002\\u2003\\u2009\\u200a]', name: 'en/em/thin space', level: 'warn', fix: ' ', exempt: betweenDigits },
].map((c) => ({ ...c, re: new RegExp(c.pattern, 'g') }));

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTS.has(path.extname(entry.name))) yield full;
  }
}

const findings = [];
let scanned = 0;
let fixed = 0;

for (const file of walk(ROOT)) {
  scanned++;
  const original = fs.readFileSync(file, 'utf8');
  let hit = false;

  original.split('\n').forEach((line, i) => {
    for (const { re, name, level, exempt } of CHARS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        if (exempt?.(line, m.index, m[0].length)) continue;
        hit = true;
        findings.push({
          file: path.relative(ROOT, file).replace(/\\/g, '/'),
          line: i + 1,
          col: m.index + 1,
          name,
          level,
        });
      }
    }
  });

  if (hit && FIX) {
    let next = original;
    for (const { re, fix, exempt } of CHARS) {
      next = next.replace(re, (match, offset, full) =>
        exempt?.(full, offset, match.length) ? match : fix
      );
    }
    if (next !== original) {
      fs.writeFileSync(file, next, 'utf8');
      fixed++;
    }
  }
}

const errors = findings.filter((f) => f.level === 'error');
const warns = findings.filter((f) => f.level === 'warn');

if (findings.length === 0) {
  console.log(`check-text: ${scanned} files scanned, clean.`);
  process.exit(0);
}

for (const f of findings) {
  const tag = f.level === 'error' ? 'ERROR' : 'warn ';
  console.log(`${tag}  ${f.file}:${f.line}:${f.col}  ${f.name}`);
}

console.log(
  `\ncheck-text: ${scanned} files scanned — ${errors.length} error(s), ${warns.length} warning(s)` +
    (FIX ? `, ${fixed} file(s) rewritten.` : '.')
);

if (FIX) process.exit(0);
if (errors.length || (STRICT && warns.length)) {
  console.log('Run `npm run check:text -- --fix` to strip them.');
  process.exit(1);
}
process.exit(0);
