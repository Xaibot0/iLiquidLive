const fs = require('fs');
const path = require('path');

const STYLE_BLOCK = `
    <style>
      .w-webflow-badge {
        display: none !important;
        visibility: hidden !important;
      }
    </style>
`;

// Recursively scan directory
function scanAndModifyHTML(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanAndModifyHTML(fullPath); // Recurse into folder
    } else if (stat.isFile() && path.extname(item).toLowerCase() === '.html') {
      modifyHTMLFile(fullPath);
    }
  }
}

// Append <style> before </body>
function modifyHTMLFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Avoid inserting multiple times
  if (content.includes('.w-webflow-badge') || content.includes(STYLE_BLOCK.trim())) {
    console.log(`Already modified: ${filePath}`);
    return;
  }

  const closingBodyIndex = content.lastIndexOf('</body>');
  if (closingBodyIndex === -1) {
    console.warn(`No </body> tag found in ${filePath}`);
    return;
  }

  const modifiedContent =
    content.slice(0, closingBodyIndex) +
    STYLE_BLOCK +
    '\n' +
    content.slice(closingBodyIndex);

  fs.writeFileSync(filePath, modifiedContent, 'utf8');
  console.log(`Modified: ${filePath}`);
}

// Run it from current directory
const targetDir = process.argv[2] || process.cwd();
scanAndModifyHTML(targetDir);
