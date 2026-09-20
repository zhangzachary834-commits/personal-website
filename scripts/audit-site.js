const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const baseUrl = String(config.baseUrl || '').replace(/\/$/, '');
const errors = [];
const warnings = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'backup'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function pageUrl(file) {
  const r = rel(file);
  return r === 'index.html' ? `${baseUrl}/` : `${baseUrl}/${r}`;
}

function stripQueryHash(value) {
  return value.split('#')[0].split('?')[0];
}

function isExternal(value) {
  return /^(?:https?:|mailto:|tel:|data:|blob:)/i.test(value);
}

function resolveLocal(fromFile, value) {
  const clean = decodeURIComponent(stripQueryHash(value));
  if (!clean) return null;
  if (clean.startsWith('/')) {
    const projectPrefix = new URL(baseUrl).pathname.replace(/\/$/, '');
    if (projectPrefix && clean.startsWith(projectPrefix + '/')) {
      return path.join(root, clean.slice(projectPrefix.length + 1));
    }
    return path.join(root, clean.replace(/^\/+/, ''));
  }
  return path.resolve(path.dirname(fromFile), clean);
}

const files = walk(root);
const htmlFiles = files.filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const r = rel(file);

  if (!/<html\b[^>]*\blang=/i.test(html)) errors.push(`${r}: missing html lang attribute`);
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) errors.push(`${r}: missing viewport meta`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${r}: missing title`);
  if (!/<meta\b[^>]*name=["']description["']/i.test(html)) warnings.push(`${r}: missing meta description`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${r}: duplicate id "${id}"`);
    seen.add(id);
  }

  for (const m of html.matchAll(/<(?:a|link|script|img|source)\b[^>]*\b(?:href|src)=["']([^"']+)["'][^>]*>/gi)) {
    const value = m[1].trim();
    if (!value || value.startsWith('#') || isExternal(value)) continue;
    if (/^javascript:/i.test(value)) {
      errors.push(`${r}: javascript: URL is not allowed (${value})`);
      continue;
    }
    const target = resolveLocal(file, value);
    if (!target) continue;
    let exists = fs.existsSync(target);
    if (exists && fs.statSync(target).isDirectory()) exists = fs.existsSync(path.join(target, 'index.html'));
    if (!exists) errors.push(`${r}: broken local reference "${value}"`);
  }

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(m[0])) errors.push(`${r}: image missing alt attribute`);
  }

  for (const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
    if (!/\brel=["'][^"']*noopener[^"']*["']/i.test(m[0])) warnings.push(`${r}: target=_blank link missing noopener`);
  }

  if (r !== 'studio.html' && r !== '404.html') {
    const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]
      || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1];
    if (!canonical) errors.push(`${r}: missing canonical URL`);
    else if (canonical !== pageUrl(file)) errors.push(`${r}: canonical is ${canonical}, expected ${pageUrl(file)}`);

    const ogUrl = html.match(/<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]
      || html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:url["'][^>]*>/i)?.[1];
    if (!ogUrl) warnings.push(`${r}: missing og:url`);
    else if (ogUrl !== pageUrl(file)) errors.push(`${r}: og:url is ${ogUrl}, expected ${pageUrl(file)}`);
  }

  if (/dimensionofthought\.com|zacharyzhang\.dev/i.test(html)) {
    errors.push(`${r}: contains stale deployment/domain string`);
  }
}

for (const file of files.filter(f => f.endsWith('.css'))) {
  const css = fs.readFileSync(file, 'utf8');
  for (const m of css.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/gi)) {
    const value = m[2];
    if (!value || value.startsWith('#') || isExternal(value)) continue;
    const target = resolveLocal(file, value);
    if (target && !fs.existsSync(target)) errors.push(`${rel(file)}: broken CSS url("${value}")`);
  }
}

try {
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  for (const item of tracked) {
    if (item === '.DS_Store' || item.includes('/.DS_Store')) errors.push(`tracked generated file: ${item}`);
    if (item === 'node_modules' || item.startsWith('node_modules/')) errors.push(`tracked dependency: ${item}`);
  }
} catch (err) {
  warnings.push(`could not inspect git tracked files: ${err.message}`);
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
console.log(`Audited ${htmlFiles.length} HTML files: ${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
