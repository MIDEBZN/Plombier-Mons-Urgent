import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const srcDir = path.join(process.cwd(), 'src');
let changedCount = 0;

walkDir(srcDir, (filePath) => {
  if (!filePath.endsWith('.astro') && !filePath.endsWith('.ts') && !filePath.endsWith('.js') && !filePath.endsWith('.css') && !filePath.endsWith('.json')) {
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Replace phone variants
  // 1. 065 70 03 87 -> 0489 16 43 78
  content = content.replace(/065\s+70\s+03\s+87/g, '0489 16 43 78');
  // 2. 065700387 -> 0489164378
  content = content.replace(/065700387/g, '0489164378');
  // 3. +32 65 70 03 87 -> +32 489 16 43 78
  content = content.replace(/\+32\s+65\s+70\s+03\s+87/g, '+32 489 16 43 78');
  // 4. +3265700387 -> +32489164378
  content = content.replace(/\+3265700387/g, '+32489164378');
  // 5. 3265700387 -> 32489164378
  content = content.replace(/3265700387/g, '32489164378');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    changedCount++;
    console.log(`Updated phone in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`\nUpdated phone numbers in ${changedCount} files.`);
