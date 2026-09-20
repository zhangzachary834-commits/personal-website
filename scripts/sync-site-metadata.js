const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const baseUrl = String(config.baseUrl || '').replace(/\/$/, '');
const socialImage = `${baseUrl}/${String(config.socialImage || 'assets/dimension-emblem.jpg').replace(/^\/+/, '')}`;

if (!/^https:\/\//.test(baseUrl)) {
  throw new Error(`site.config.json baseUrl must be an absolute https URL; got: ${baseUrl}`);
}

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

function replaceOrInsert(headHtml, matcher, replacement, anchor = /<meta\s+name=["']author["'][^>]*>/i) {
  if (matcher.test(headHtml)) return headHtml.replace(matcher, replacement);
  if (anchor.test(headHtml)) return headHtml.replace(anchor, m => `${m}\n    ${replacement}`);
  return headHtml.replace(/<\/head>/i, `    ${replacement}\n</head>`);
}

const htmlFiles = walk(root).filter(file => file.endsWith('.html'));
const publicPages = [];

for (const file of htmlFiles) {
  const r = rel(file);
  let html = fs.readFileSync(file, 'utf8');
  const isToolPage = r === 'studio.html';
  const isErrorPage = r === '404.html';

  // Reuse the canonical emblem for favicons instead of shipping a duplicate image blob.
  html = html.replace(/favicon\\.jpg/g, 'dimension-emblem.jpg');

  if (isToolPage || isErrorPage) {
    const robotsTag = '<meta name="robots" content="noindex, nofollow">';
    html = replaceOrInsert(
      html,
      /<meta\b[^>]*name=["']robots["'][^>]*>/i,
      robotsTag
    );
  } else {
    const url = pageUrl(file);
    const canonicalTag = `<link rel="canonical" href="${url}">`;
    const ogUrlTag = `<meta property="og:url" content="${url}">`;
    const ogImageTag = `<meta property="og:image" content="${socialImage}">`;

    html = replaceOrInsert(
      html,
      /<link\b[^>]*rel=["']canonical["'][^>]*>/i,
      canonicalTag
    );
    html = replaceOrInsert(
      html,
      /<meta\b[^>]*property=["']og:url["'][^>]*>/i,
      ogUrlTag
    );
    html = replaceOrInsert(
      html,
      /<meta\b[^>]*property=["']og:image["'][^>]*>/i,
      ogImageTag
    );

    publicPages.push(url);
  }

  if (html !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, html);
    console.log(`updated ${r}`);
  }
}

const scriptPath = path.join(root, 'script.js');
if (fs.existsSync(scriptPath)) {
  let script = fs.readFileSync(scriptPath, 'utf8');
  const original = script;
  script = script.replace(/Sent via zacharyzhang\.dev/g, 'Sent via Dimension of Thought');
  script = script.replace(
    /https:\/\/zhangzachary834-commits\.github\.io\/posts\/\$\{draft\.slug\}\.html/g,
    `${baseUrl}/posts/\${draft.slug}.html`
  );
  if (script !== original) {
    fs.writeFileSync(scriptPath, script);
    console.log('updated script.js deployment strings');
  }
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...publicPages.sort().map(url => `  <url><loc>${url.replace(/&/g, '&amp;')}</loc></url>`),
  '</urlset>',
  ''
].join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
fs.writeFileSync(path.join(root, 'robots.txt'), robots);

console.log(`Synchronized metadata for ${publicPages.length} public HTML pages.`);
