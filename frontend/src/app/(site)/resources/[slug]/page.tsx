import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageHero, CtaBand, JsonLd } from '@/components/ui';
import { articles, company } from '@/data/site';
import { pageMeta, SITE_URL } from '@/lib/seo';

export function generateStaticParams() { return articles.map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return a ? pageMeta({ title: a.title, description: a.excerpt, path: `/resources/${a.slug}` }) : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <>
      <PageHero eyebrow={a.category} crumbs={[{ label: 'Resources', href: '/resources' }, { label: a.title }]} title={a.title} text={a.excerpt} />
      <article className="container max-w-3xl py-16">
        {/* Article body is managed in Admin → Articles (rich text). This is the sample placeholder body. */}
        <div className="space-y-5 text-lg leading-relaxed text-navy-700">
          <p>This article will be published from the AVS admin panel. Use Admin → Articles to add the full body, cover image and SEO fields.</p>
        </div>
        <Link href="/resources" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-teal-600"><ArrowLeft className="h-4 w-4" />Back to Resources</Link>
      </article>
      <CtaBand />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, datePublished: a.date, publisher: { '@type': 'Organization', name: company.legalName }, mainEntityOfPage: `${SITE_URL}/resources/${a.slug}` }} />
    </>
  );
}
