const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.resolve(__dirname, '../public');
const files = fs.readdirSync(publicDir);

async function convertAll() {
  console.log('Starting conversion of all images in public/ to WebP...');
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const src = path.join(publicDir, file);
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const dest = path.join(publicDir, baseName + '.webp');
      
      await sharp(src)
        .webp({ quality: 85, effort: 6 })
        .toFile(dest);
        
      const srcStat = fs.statSync(src);
      const destStat = fs.statSync(dest);
      const savings = Math.round((1 - destStat.size / srcStat.size) * 100);
      console.log(`Converted ${file} (${srcStat.size} B) -> ${baseName}.webp (${destStat.size} B) [-${savings}%]`);
    }
  }
  console.log('All images converted to WebP successfully!');
}

convertAll().catch(console.error);
