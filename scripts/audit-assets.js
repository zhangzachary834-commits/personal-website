const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'assets');
const ignoredDirs = new Set(['.git', 'node_modules', 'assets']);
const textExtensions = new Set(['.html', '.css', '.js', '.md', '.json', '.xml', '.txt', '.yml', '.yaml']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const sourceFiles = walk(root).filter(file => textExtensions.has(path.extname(file).toLowerCase()));
const sourceText = sourceFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
const assets = fs.readdirSync(assetsDir, { withFileTypes: true })
  .filter(entry => entry.isFile())
  .map(entry => {
    const file = path.join(assetsDir, entry.name);
    const bytes = fs.readFileSync(file);
    return {
      name: entry.name,
      size: bytes.length,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      referenced: sourceText.includes(`assets/${entry.name}`)
    };
  });

const unused = assets.filter(asset => !asset.referenced);
const groups = new Map();
for (const asset of assets) {
  const group = groups.get(asset.sha256) || [];
  group.push(asset);
  groups.set(asset.sha256, group);
}
const duplicates = [...groups.values()].filter(group => group.length > 1);

for (const asset of assets) {
  console.log(`${asset.referenced ? 'USED  ' : 'UNUSED'} ${asset.name} ${(asset.size / 1024).toFixed(1)} KiB`);
}
for (const group of duplicates) {
  console.warn(`DUPLICATE CONTENT: ${group.map(asset => `${asset.name} (${(asset.size / 1024).toFixed(1)} KiB)`).join(', ')}`);
}
if (unused.length) {
  console.error(`Unused assets: ${unused.map(asset => asset.name).join(', ')}`);
  process.exit(1);
}
