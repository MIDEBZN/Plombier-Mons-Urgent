import { batch1Articles, type BlogArticle } from "./batch1";
import { batch2Articles } from "./batch2";
import { batch3Articles } from "./batch3";

export type { BlogArticle };

export const blogArticles: BlogArticle[] = [
  ...batch1Articles,
  ...batch2Articles,
  ...batch3Articles,
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, limit: number = 3): BlogArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return blogArticles.slice(0, limit);

  // prioritize same category, exclude current
  const sameCategory = blogArticles.filter(
    (a) => a.category === current.category && a.slug !== currentSlug
  );
  const others = blogArticles.filter(
    (a) => a.category !== current.category && a.slug !== currentSlug
  );

  return [...sameCategory, ...others].slice(0, limit);
}
