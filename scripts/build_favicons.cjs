const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp vector SVG favicon based on uploaded design
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#0D1B2A"/>
  <!-- Pipe body -->
  <path d="M 36 30 C 36 21 43 16 52 16 L 58 16 C 67 16 74 21 74 30 L 74 34 L 64 34 L 64 30 C 64 25.5 61.5 24 57 24 L 53 24 C 48.5 24 46 25.5 46 30 L 46 48 L 36 48 Z" fill="#FFFFFF"/>
  <!-- Spout rim -->
  <rect x="62" y="34" width="14" height="4.5" rx="2" fill="#FFFFFF"/>
  <!-- Vertical pipe and collar -->
  <rect x="36" y="48" width="10" height="26" fill="#FFFFFF"/>
  <rect x="33.5" y="44" width="15" height="4.5" rx="2" fill="#FFFFFF"/>
  <!-- Water Drop -->
  <path d="M 69 45 C 69 45 56 62 56 71 C 56 78.5 61.8 84 69 84 C 76.2 84 82 78.5 82 71 C 82 62 69 45 69 45 Z" fill="#00A3FF"/>
  <!-- Droplet highlight -->
  <path d="M 63 67 C 62 71.5 63.5 75.5 66 77" stroke="#90DCFF" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon, 'utf8');

async function run() {
  const buf32 = await sharp(path.join(publicDir, 'favicon-mark-32.png')).toFormat('png').toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buf32);
  console.log('Favicon and ICO created successfully!');
}

run().catch(console.error);
