import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Full Square Brand Logo with dark navy background (matching the user's image exactly)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background subtle gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1A2C"/>
      <stop offset="100%" stop-color="#08101C"/>
    </linearGradient>

    <!-- Water droplet gradient -->
    <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22B8FF"/>
      <stop offset="60%" stop-color="#008BE3"/>
      <stop offset="100%" stop-color="#006BB8"/>
    </linearGradient>

    <!-- Drop highlight gradient -->
    <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#65D2FF" stop-opacity="0.2"/>
    </linearGradient>

    <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Dark navy container with smooth rounded corners -->
  <rect width="512" height="512" rx="64" fill="url(#bgGrad)"/>

  <!-- Pipe and Water Graphic Group -->
  <g transform="translate(22, 10)" filter="url(#shadowFilter)">
    <!-- Vertical lower pipe body -->
    <rect x="160" y="195" width="40" height="85" fill="#FFFFFF"/>

    <!-- Vertical lower collar ring -->
    <rect x="152" y="176" width="56" height="20" rx="4" fill="#FFFFFF"/>

    <!-- Outer Elbow Path -->
    <!-- From (160, 176) up and right, then down to spout -->
    <path d="
      M 160 176
      V 152
      C 160 102 200 62 250 62
      H 268
      C 292 62 312 82 312 106
      V 116
      H 272
      V 106
      C 272 102 268 98 264 98
      H 250
      C 220 98 200 118 200 148
      V 176
      Z
    " fill="#FFFFFF"/>

    <!-- Collar near the spout -->
    <rect x="256" y="54" width="16" height="50" rx="3" fill="#FFFFFF"/>

    <!-- Spout flange / nozzle rim -->
    <rect x="268" y="112" width="48" height="15" rx="3" fill="#FFFFFF"/>

    <!-- Water Drop -->
    <!-- Positioned directly below spout opening (x=292, y=140 to 240) -->
    <g transform="translate(292, 206)">
      <!-- Main Drop Body -->
      <path d="
        M 0 -68
        C 0 -68 -38 -15 -38 22
        C -38 46 -17 65 0 65
        C 17 65 38 46 38 22
        C 38 -15 0 -68 0 -68
        Z
      " fill="url(#dropGrad)"/>

      <!-- Specular Reflection / Highlight curve -->
      <path d="
        M -18 -10
        C -28 6 -28 32 -16 46
      " fill="none" stroke="url(#highlightGrad)" stroke-width="5.5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Typography: PLOMBIER -->
  <text x="256" y="372"
        text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-weight="900"
        font-size="64"
        letter-spacing="2"
        fill="#FFFFFF">PLOMBIER</text>

  <!-- Typography: MONS URGENT -->
  <text x="256" y="428"
        text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-weight="900"
        font-size="42"
        letter-spacing="3.5">
    <tspan fill="#FFFFFF">MONS </tspan>
    <tspan fill="#00A3FF">URGENT</tspan>
  </text>
</svg>`;

// 2. Favicon SVG (optimized icon-only for small browser tabs: 16x16, 32x32, 64x64)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1A2C"/>
      <stop offset="100%" stop-color="#08101C"/>
    </linearGradient>
    <linearGradient id="favDrop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22B8FF"/>
      <stop offset="100%" stop-color="#0077C8"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#favBg)"/>

  <!-- Icon centered in 128x128 -->
  <g transform="translate(14, 12)">
    <!-- Vertical lower pipe body -->
    <rect x="24" y="58" width="16" height="38" fill="#FFFFFF"/>

    <!-- Vertical lower collar ring -->
    <rect x="20" y="50" width="24" height="9" rx="2" fill="#FFFFFF"/>

    <!-- Outer Elbow Path -->
    <path d="
      M 24 50
      V 38
      C 24 20 40 8 58 8
      H 66
      C 76 8 84 16 84 26
      V 32
      H 68
      V 26
      C 68 24 66 22 64 22
      H 58
      C 48 22 40 30 40 40
      V 50
      Z
    " fill="#FFFFFF"/>

    <!-- Collar near spout -->
    <rect x="61" y="4" width="7" height="20" rx="1.5" fill="#FFFFFF"/>

    <!-- Spout flange / nozzle rim -->
    <rect x="66" y="30" width="20" height="7" rx="1.5" fill="#FFFFFF"/>

    <!-- Water Drop -->
    <g transform="translate(76, 68)">
      <path d="
        M 0 -28
        C 0 -28 -17 -6 -17 10
        C -17 21 -8 29 0 29
        C 8 29 17 21 17 10
        C 17 -6 0 -28 0 -28
        Z
      " fill="url(#favDrop)"/>
      <path d="
        M -8 -4
        C -12 3 -12 14 -7 20
      " fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    </g>
  </g>
</svg>`;

// 3. Transparent Horizontal Logo (for Header navigation bar)
const headerLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" width="320" height="64">
  <defs>
    <linearGradient id="hdrDrop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22B8FF"/>
      <stop offset="100%" stop-color="#008BE3"/>
    </linearGradient>
    <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1A2C"/>
      <stop offset="100%" stop-color="#0A1320"/>
    </linearGradient>
  </defs>

  <!-- Left Icon Container -->
  <rect x="2" y="4" width="56" height="56" rx="14" fill="url(#iconBg)"/>

  <!-- Icon inside container -->
  <g transform="translate(6, 4) scale(0.44)">
    <rect x="24" y="58" width="16" height="38" fill="#FFFFFF"/>
    <rect x="20" y="50" width="24" height="9" rx="2" fill="#FFFFFF"/>
    <path d="
      M 24 50
      V 38
      C 24 20 40 8 58 8
      H 66
      C 76 8 84 16 84 26
      V 32
      H 68
      V 26
      C 68 24 66 22 64 22
      H 58
      C 48 22 40 30 40 40
      V 50
      Z
    " fill="#FFFFFF"/>
    <rect x="61" y="4" width="7" height="20" rx="1.5" fill="#FFFFFF"/>
    <rect x="66" y="30" width="20" height="7" rx="1.5" fill="#FFFFFF"/>
    <g transform="translate(76, 68)">
      <path d="
        M 0 -28
        C 0 -28 -17 -6 -17 10
        C -17 21 -8 29 0 29
        C 8 29 17 21 17 10
        C 17 -6 0 -28 0 -28
        Z
      " fill="url(#hdrDrop)"/>
      <path d="
        M -8 -4
        C -12 3 -12 14 -7 20
      " fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    </g>
  </g>

  <!-- Brand Typography -->
  <text x="68" y="32"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-weight="900"
        font-size="20"
        letter-spacing="0.5"
        fill="#10213A">PLOMBIER</text>

  <text x="68" y="50"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-weight="900"
        font-size="14"
        letter-spacing="1.2">
    <tspan fill="#10213A">MONS </tspan>
    <tspan fill="#008BE3">URGENT</tspan>
  </text>
</svg>`;

// Write SVG files to public/
fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSvg, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'header-logo.svg'), headerLogoSvg, 'utf-8');
console.log('SVG files generated in public/');

// Generate PNG versions via sharp
async function generatePngs() {
  // 1. logo.png (512x512)
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));

  // 2. favicon-32x32.png
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // 3. favicon-16x16.png
  await sharp(Buffer.from(faviconSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // 4. apple-touch-icon.png (180x180)
  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 5. favicon.png (64x64 standard)
  await sharp(Buffer.from(faviconSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  // 6. header-logo.png
  await sharp(Buffer.from(headerLogoSvg))
    .resize(640, 128)
    .png()
    .toFile(path.join(publicDir, 'header-logo.png'));

  console.log('PNG files generated in public/');
}

generatePngs().catch(console.error);
