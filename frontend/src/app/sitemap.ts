import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { articles } from '@/data/site';
import { getProducts, getSolutions } from '@/lib/content';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, solutions] = await Promise.all([getProducts(), getSolutions()]);
  const now = new Date();
  const staticPages = ['', '/about', '/solutions', '/products', '/industries', '/technology', '/resources', '/contact', '/request-demo', '/privacy-policy', '/terms'];
  return [
    ...staticPages.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 })),
    ...solutions.map((s) => ({ url: `${SITE_URL}/solutions/${s.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: p.featured ? 0.9 : 0.7 })),
    ...articles.map((a) => ({ url: `${SITE_URL}/resources/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
