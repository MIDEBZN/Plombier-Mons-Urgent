const fs = require('fs');
const path = require('path');

function getAstroFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAstroFiles(fullPath));
    } else if (file.endsWith('.astro')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getAstroFiles('src/pages');
const audit = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match title="something" or title={'something'}
  const titleMatch = content.match(/title="([^"]+)"/) || content.match(/title='([^']+)'/);
  const descMatch = content.match(/description="([^"]+)"/) || content.match(/description='([^']+)'/);
  const canonicalMatch = content.match(/canonicalPath="([^"]*)"/) || content.match(/canonicalPath='([^']*)'/);
  const rel = path.relative('src/pages', f).replace(/\\/g, '/');
  
  audit.push({
    file: rel,
    title: titleMatch ? titleMatch[1] : null,
    titleLen: titleMatch ? titleMatch[1].length : 0,
    desc: descMatch ? descMatch[1] : null,
    descLen: descMatch ? descMatch[1].length : 0,
    canonical: canonicalMatch ? canonicalMatch[1] : null
  });
});

console.log(JSON.stringify(audit, null, 2));
