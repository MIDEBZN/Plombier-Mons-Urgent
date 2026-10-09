import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

export interface Article {
  slug: string;
  file: string;
  number: number;
  title: string;
  description: string;
  h1: string;
  category: string;
  readingTime: string;
  publishedDate: string;
  excerpt: string;
  contentHtml: string;
}

export const CATEGORIES = [
  'Tous les articles',
  'Urgences & Dépannage',
  'Tarifs & Devis',
  'Débouchage & Égouts',
  'Fuites & Infiltrations',
  'Chauffage & Boilers',
  'Sanitaire & Travaux',
  'Réglementation & Conseils',
] as const;

function getCategoryForNumber(num: number): string {
  if ([1, 8, 9, 27, 28].includes(num)) return 'Urgences & Dépannage';
  if ([2, 4, 7, 14, 15, 20, 22].includes(num)) return 'Tarifs & Devis';
  if ([5, 18, 19, 24, 30].includes(num)) return 'Débouchage & Égouts';
  if ([3, 11, 12].includes(num)) return 'Fuites & Infiltrations';
  if ([10, 16, 17].includes(num)) return 'Chauffage & Boilers';
  if ([13, 21, 23].includes(num)) return 'Sanitaire & Travaux';
  return 'Réglementation & Conseils'; // 6, 25, 26, 29
}

function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 220);
  return `${minutes} min de lecture`;
}

let cachedArticles: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cachedArticles) {
    return cachedArticles;
  }

  const articlesDir = path.resolve(process.cwd(), 'articles');
  if (!fs.existsSync(articlesDir)) {
    return [];
  }

  const filenames = fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.md'))
    .sort();

  const articles: Article[] = [];

  for (const file of filenames) {
    const fullPath = path.join(articlesDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Extract number from filename (e.g. article-01-...)
    const numMatch = file.match(/^article-(\d+)-/);
    const number = numMatch ? parseInt(numMatch[1], 10) : articles.length + 1;

    // Slug without the article-XX- prefix
    const slug = file.replace(/^article-\d+-/, '').replace(/\.md$/, '');

    const lines = content.split('\n');
    let title = '';
    let description = '';
    let h1 = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('Balise Title')) {
        const next = lines[i + 1] ? lines[i + 1].trim() : '';
        title = next.replace(/^[`"'\s]+|[`"'\s]+$/g, '');
      }
      if (line.includes('Meta Description')) {
        const next = lines[i + 1] ? lines[i + 1].trim() : '';
        description = next.replace(/^[`"'\s]+|[`"'\s]+$/g, '');
      }
      if (!h1 && line.startsWith('# ') && !line.includes('Article de Blog SEO')) {
        h1 = line.replace(/^#\s+/, '').trim();
      }
    }

    // Split at the first markdown separator '---' to isolate body
    const firstSep = content.indexOf('\n---\n');
    const rawBody = firstSep !== -1 ? content.slice(firstSep + 5).trim() : content;

    // Body without leading H1 since we render H1 in page hero
    const bodyWithoutH1 = rawBody.replace(/^#\s+[^\n]+\n+/, '').trim();

    // First paragraph as excerpt
    const firstParagraph = bodyWithoutH1.split('\n\n')[0] || '';
    const cleanExcerpt = firstParagraph
      .replace(/[*_#`\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const category = getCategoryForNumber(number);
    const readingTime = calculateReadingTime(bodyWithoutH1);

    // Convert markdown body to HTML
    const contentHtml = marked.parse(bodyWithoutH1) as string;

    articles.push({
      slug,
      file,
      number,
      title: title || h1 || slug,
      description: description || cleanExcerpt.slice(0, 155),
      h1: h1 || title,
      category,
      readingTime,
      publishedDate: '2026-10-09',
      excerpt: cleanExcerpt,
      contentHtml,
    });
  }

  cachedArticles = articles;
  return articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  const all = getAllArticles();
  return all.find((a) => a.slug === slug);
}
