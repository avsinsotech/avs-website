import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.avsinsotech.com').replace(/\/$/, '');

export function pageMeta(opts: { title: string; description: string; path: string; keywords?: string[] }): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: { title: opts.title, description: opts.description, url, siteName: 'AVS InSoTech', type: 'website', locale: 'en_IN', images: [{ url: '/images/og-image.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  };
}
