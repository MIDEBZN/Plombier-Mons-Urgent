import fs from 'fs';
import path from 'path';

export function validateArticle(content, filename = 'article') {
  const errors = [];
  const warnings = [];

  // 1. Emoji check
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;
  if (emojiRegex.test(content)) {
    errors.push('Contains emoji characters which are strictly forbidden.');
  }

  // 2. Em dash check
  if (content.includes('—') || content.includes('\u2014')) {
    errors.push('Contains em dash (—) which is strictly forbidden.');
  }

  // 3. Word count check (French words)
  const plainText = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plainText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount < 1500) {
    errors.push(`Word count too low: ${wordCount} words (minimum required: 1500).`);
  } else if (wordCount > 2500) {
    warnings.push(`Word count high: ${wordCount} words (target range: 1500-2500).`);
  }

  // 4. Title tag check
  const titleMatch = content.match(/Balise Title[^\n:]*:\s*\*?\*?\s*\n?\s*`([^`]+)`/i) || 
                     content.match(/Title\s*:\s*`?([^`\n]+)`?/i);
  let title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    errors.push('Missing Title tag specification.');
  } else if (title.length > 60) {
    errors.push(`Title tag too long: ${title.length} chars (maximum: 60). Title: "${title}"`);
  }

  // 5. Meta description check
  const metaMatch = content.match(/Meta Description[^\n:]*:\s*\*?\*?\s*\n?\s*`([^`]+)`/i) ||
                    content.match(/Meta\s*:\s*`?([^`\n]+)`?/i);
  let meta = metaMatch ? metaMatch[1].trim() : '';
  if (!meta) {
    errors.push('Missing Meta description specification.');
  } else {
    if (meta.length > 155) {
      errors.push(`Meta description too long: ${meta.length} chars (maximum: 155). Meta: "${meta}"`);
    }
    if (!meta.includes('0489') && !meta.includes('16 43 78') && !meta.includes('0489 16 43 78')) {
      errors.push('Meta description missing phone number (0489 16 43 78).');
    }
  }

  // 6. Single H1 check
  const h1Matches = content.match(/^#\s+[^\n]+/gm) || [];
  // Note: If top metadata has "# Article de Blog...", and then another "# Quel Plombier...", count actual markdown H1s
  // In our articles, we have markdown headings
  const mainH1Count = h1Matches.filter(h => !h.toLowerCase().includes('fiche technique') && !h.toLowerCase().includes('article de blog')).length;
  if (mainH1Count === 0) {
    errors.push('Missing main H1 tag.');
  }

  // 7. FAQ section check
  if (!content.toLowerCase().includes('foire aux questions') && !content.toLowerCase().includes('faq')) {
    errors.push('Missing FAQ section.');
  }

  // 8. Communes check
  const communes = ['mons', 'jemappes', 'ghlin', 'cuesmes', 'nimy'];
  const hasLocal = communes.some(c => content.toLowerCase().includes(c));
  if (!hasLocal) {
    errors.push('Missing local communes mention (Mons, Jemappes, Ghlin, Cuesmes, Nimy).');
  }

  return {
    filename,
    isValid: errors.length === 0,
    wordCount,
    title,
    titleLength: title.length,
    meta,
    metaLength: meta.length,
    errors,
    warnings
  };
}

if (process.argv[1] && process.argv[1].endsWith('validator.js')) {
  const fileToTest = process.argv[2] || 'articles/article-01-quel-plombier-appeler-en-urgence-a-mons-24h24.md';
  if (fs.existsSync(fileToTest)) {
    const content = fs.readFileSync(fileToTest, 'utf-8');
    const res = validateArticle(content, path.basename(fileToTest));
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.log(`File not found: ${fileToTest}`);
  }
}
