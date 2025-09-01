const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(process.argv[2] || '.');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of list) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (dirent.isFile() && fullPath.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function fixHref(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const regex = /href="([^"]+?)"/g;

  let changed = false;
  content = content.replace(regex, (match, hrefValue) => {
    // Normalize to trim whitespace just in case
    const href = hrefValue.trim();

    // Skip external URLs and anchors
    if (
      /^(https?:|mailto:|tel:|#)/.test(href) || // external, mailto, tel, anchors
      href === '/' ||                           // root slash only
      href === '//'                             // protocol-relative URLs
    ) {
      return match;
    }

    // Skip if already ends with .html or contains query/hash
    if (href.endsWith('.html') || href.includes('?') || href.includes('#')) {
      return match;
    }

    // Otherwise add .html
    changed = true;
    return `href="${href}.html"`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    // console.log(content)
    console.log(`Fixed hrefs in: ${filePath}`);
  }
}

const files = walk(rootDir);
files.forEach(fixHref);

console.log(`Processed ${files.length} .html files.`);
