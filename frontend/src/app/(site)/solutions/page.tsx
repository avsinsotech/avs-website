import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import { PageHero, CtaBand } from '@/components/ui';
import { getProducts, getSolutions } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Banking Solutions for Co-operative Banks, Credit Societies & NBFCs',
  description: 'Core banking, digital banking, KYC & regulatory compliance, lending & recovery, AI automation and treasury solutions from AVS InSoTech.',
  path: '/solutions',
  keywords: ['Digital Banking Solutions', 'RBI Compliance Software', 'Co-operative Bank Software'],
});

export default async function SolutionsPage() {
  const [solutions, products] = await Promise.all([getSolutions(), getProducts()]);
  return (
    <>
      <PageHero eyebrow="Solutions" crumbs={[{ label: 'Solutions' }]} title="Solutions for every department of your institution" text="Six integrated solution areas, one technology partner." />
      <section className="section">
        <div className="container space-y-6">
          {solutions.map((s, i) => {
            const items = products.filter((p) => p.category === s.categoryKey).slice(0, 6);
            return (
              <Reveal key={s.slug}>
                <div className="grid gap-8 rounded-[2rem] border border-navy-100 bg-white p-8 shadow-card transition hover:shadow-lift lg:grid-cols-[1.1fr_1fr] lg:p-12">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white"><Icon name={s.icon} className="h-7 w-7" /></span>
                      <span className="font-display text-sm font-bold text-teal-600">0{i + 1}</span>
                    </div>
                    <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{s.name}</h2>
                    <p className="mt-4 leading-relaxed text-navy-600">{s.description}</p>
                    <ul className="mt-6 space-y-2">{s.outcomes.map((o) => <li key={o} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 className="h-5 w-5 text-teal-500" />{o}</li>)}</ul>
                    <Link href={`/solutions/${s.slug}`} className="btn-primary mt-8">Explore More <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                  <div className="rounded-2xl bg-navy-50/70 p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Related products</p>
                    <ul className="mt-4 grid gap-2">
                      {items.map((p) => (
                        <li key={p.slug}><Link href={`/products/${p.slug}`} className="group flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-medium text-navy-800 shadow-sm hover:text-teal-600"><span className="flex items-center gap-3"><Icon name={p.icon} className="h-4 w-4 text-teal-500" />{p.name}</span><ArrowRight className="h-4 w-4 opacity-40 group-hover:opacity-100" /></Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
