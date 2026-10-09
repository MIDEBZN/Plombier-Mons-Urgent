import fs from 'fs';
import path from 'path';
import { validateArticle } from './validator.js';

const articlesDir = path.join(process.cwd(), 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md')).sort();

console.log(`Found ${files.length} article markdown files in ${articlesDir}.\n`);

let totalWords = 0;
let failedCount = 0;
const report = [];

files.forEach((file, index) => {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const res = validateArticle(content, file);
  
  totalWords += res.wordCount;
  if (!res.isValid) {
    failedCount++;
  }
  
  report.push({
    num: index + 1,
    file,
    valid: res.isValid,
    words: res.wordCount,
    titleLen: res.titleLength,
    title: res.title,
    metaLen: res.metaLength,
    errors: res.errors
  });
});

console.table(report.map(r => ({
  '#': r.num,
  'Fichier': r.file,
  'Valide': r.valid ? 'OUI' : 'NON',
  'Mots': r.words,
  'Title (<=60)': `${r.titleLen} c.`,
  'Meta (<=155)': `${r.metaLen} c.`
})));

console.log(`\n========================================`);
console.log(`Total Articles : ${files.length} / 30`);
console.log(`Articles Valides : ${files.length - failedCount} / ${files.length}`);
console.log(`Total Mots Produits : ${totalWords.toLocaleString('fr-FR')} mots`);
console.log(`Moyenne par Article : ${Math.round(totalWords / files.length)} mots / article`);
console.log(`========================================`);

if (files.length === 30 && failedCount === 0) {
  console.log('\nToutes les 30 articles sont 100 % conformes aux exigences SEO et rédactionnelles !');
  process.exit(0);
} else {
  console.error('\nCertains articles nécessitent des corrections !');
  process.exit(1);
}
