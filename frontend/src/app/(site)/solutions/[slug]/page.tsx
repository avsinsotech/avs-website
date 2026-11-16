import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, CalendarCheck } from 'lucide-react';
import Icon from '@/components/Icon';
import { PageHero, SectionHeading, ProductCard, CtaBand } from '@/components/ui';
import { solutions as seedSolutions, audiences } from '@/data/site';
import { getProducts, getSolutions } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const revalidate = 300;
export function generateStaticParams() { return seedSolutions.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (await getSolutions()).find((x) => x.slug === slug);
  if (!s) return {};
  return pageMeta({ title: `${s.name} for Co-operative Banks & Credit Societies`, description: s.description, path: `/solutions/${s.slug}` });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [solutions, products] = await Promise.all([getSolutions(), getProducts()]);
  const s = solutions.find((x) => x.slug === slug);
  if (!s) notFound();
  const items = products.filter((p) => p.category === s.categoryKey);
  return (
    <>
      <PageHero eyebrow="Solution" crumbs={[{ label: 'Solutions', href: '/solutions' }, { label: s.name }]} title={s.name} text={s.description}>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/request-demo" className="btn-primary"><CalendarCheck className="h-4 w-4" />Request a Demo</Link></div>
      </PageHero>
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Outcomes" title="What this solution delivers" />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {s.outcomes.map((o) => <li key={o} className="card flex gap-3 p-5 text-navy-700"><CheckCircle2 className="h-5 w-5 shrink-0 text-teal-500" />{o}</li>)}
            </ul>
          </div>
          <div className="card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Suitable for</p>
            <ul className="mt-4 space-y-3">
              {audiences.map((a) => <li key={a.slug} className="flex items-center gap-3 text-sm text-navy-700"><Icon name={a.icon} className="h-4 w-4 text-teal-500" />{a.name}</li>)}
            </ul>
          </div>
        </div>
        <div className="container mt-20">
          <SectionHeading eyebrow="Products" title={`Products in ${s.name}`} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((p, i) => <ProductCard key={p.slug} p={p} delay={(i % 3) * 60} />)}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
