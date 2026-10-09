import fs from 'node:fs';
import path from 'node:path';
import { getAllArticles } from '../src/lib/articles.ts';

const articles = getAllArticles();

const coreUrls = [
  { loc: 'https://www.plombiermonsurgent.be/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://www.plombiermonsurgent.be/services', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/services/depannage-urgence', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/services/debouchage', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/services/detection-fuites', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/services/chauffage-chaudieres', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/services/installations-sanitaires', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/services/traitement-eau', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/cuesmes', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/frameries', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/ghlin', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/jemappes', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/maisieres-casteau-shape', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/nimy', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/quaregnon', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/locations/saint-ghislain', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.plombiermonsurgent.be/contact', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://www.plombiermonsurgent.be/about', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.plombiermonsurgent.be/blog', priority: '0.8', changefreq: 'weekly' },
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

xml += '  <!-- 1. Pages Principales & Services -->\n';
for (const u of coreUrls) {
  xml += '  <url>\n';
  xml += `    <loc>${u.loc}</loc>\n`;
  xml += '    <lastmod>2026-10-09</lastmod>\n';
  xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
  xml += `    <priority>${u.priority}</priority>\n`;
  xml += '  </url>\n';
}

xml += '\n  <!-- 2. Guides Pratiques & Blog Plomberie Mons (30 Dossiers d\'Experts) -->\n';
for (const a of articles) {
  xml += '  <url>\n';
  xml += `    <loc>https://www.plombiermonsurgent.be/blog/${a.slug}</loc>\n`;
  xml += '    <lastmod>2026-10-09</lastmod>\n';
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>0.7</priority>\n';
  xml += '  </url>\n';
}

xml += '</urlset>\n';

const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf-8');
console.log(`Generated sitemap at ${outPath} with ${coreUrls.length + articles.length} URLs!`);
