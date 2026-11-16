import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { PageHero, CtaBand } from '@/components/ui';
import { industries } from '@/data/site';
import { getProducts } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Industries – Credit Societies, Urban Co-op Banks, DCCBs, State Co-op Banks, NBFCs',
  description: 'How AVS InSoTech solutions address the operational challenges of credit societies, urban co-operative banks, DCCBs, state co-operative banks, NBFCs and co-operative federations.',
  path: '/industries',
  keywords: ['Credit Society Software', 'Co-operative Bank Software', 'NBFC Gold Loan Software'],
});

export default async function IndustriesPage() {
  const all = await getProducts();
  const getProduct = (s: string) => all.find((p) => p.slug === s);
  return (
    <>
      <PageHero eyebrow="Industries" crumbs={[{ label: 'Industries' }]} title="Purpose-built for every type of co-operative institution" text="Each segment has its own challenges. Here is how AVS helps.">
        <div className="mt-8 flex flex-wrap gap-2">
          {industries.map((i) => <a key={i.slug} href={`#${i.slug}`} className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-navy-100 hover:border-teal-400 hover:text-white">{i.name}</a>)}
        </div>
      </PageHero>
      <section className="section">
        <div className="container space-y-10">
          {industries.map((ind, idx) => (
            <Reveal key={ind.slug}>
              <article id={ind.slug} className="scroll-mt-32 overflow-hidden rounded-[2rem] border border-navy-100 bg-white shadow-card">
                <div className="grid lg:grid-cols-[1fr_1.1fr]">
                  <div className={`relative p-8 lg:p-12 ${idx % 2 ? 'bg-gradient-to-br from-teal-600 to-teal-800' : 'bg-gradient-to-br from-navy-800 to-navy-950'} text-white`}>
                    <div className="absolute inset-0 bg-grid-dark" />
                    <div className="relative">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20"><Icon name={ind.icon} className="h-7 w-7" /></span>
                      <h2 className="mt-6 text-3xl font-bold text-white">{ind.name}</h2>
                      <p className="mt-4 leading-relaxed text-white/80">{ind.intro}</p>
                      <p className="mt-8 text-xs font-bold uppercase tracking-wider text-white/60">Operational challenges</p>
                      <ul className="mt-3 space-y-2.5">
                        {ind.challenges.map((c) => <li key={c} className="flex gap-3 text-sm text-white/90"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />{c}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12">
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600">How AVS helps</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {ind.solutions.map((s) => {
                        const p = getProduct(s);
                        if (!p) return null;
                        return (
                          <Link key={s} href={`/products/${p.slug}`} className="group rounded-2xl border border-navy-100 p-4 transition hover:border-teal-300 hover:shadow-card">
                            <Icon name={p.icon} className="h-5 w-5 text-teal-500" />
                            <p className="mt-3 text-sm font-semibold text-navy-900">{p.short ?? p.name}</p>
                            <p className="mt-1 text-xs leading-relaxed text-navy-500">{p.tagline}</p>
                          </Link>
                        );
                      })}
                    </div>
                    <Link href="/request-demo" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-600">Discuss your requirements <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
