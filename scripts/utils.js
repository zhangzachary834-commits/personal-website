const fs = require('fs');
const path = require('path');

function walk(dir, ignoredDirs = new Set(['.git', 'node_modules', 'backup'])) {
  const out = [];
  const ignoreSet = ignoredDirs instanceof Set ? ignoredDirs : new Set(ignoredDirs);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreSet.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, ignoreSet));
    else out.push(full);
  }
  return out;
}

module.exports = { walk };
