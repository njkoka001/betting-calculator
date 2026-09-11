const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy HTML, JS, redirects and headers to dist
const filesToCopy = [
  'index.html',
  'admin.html',
  'trendmark-db.js',
  '_redirects',
  '_headers'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> dist/${file}`);
  }
});

console.log('Build complete! Static assets in dist ready for deployment.');
