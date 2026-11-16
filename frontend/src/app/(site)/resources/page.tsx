import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import FaqList from '@/components/FaqList';
import { PageHero, SectionHeading, CtaBand, JsonLd } from '@/components/ui';
import { articles, faqs, resourceSections } from '@/data/site';
import { fetchContent } from '@/lib/api';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Resources – Banking Technology Articles, RBI Compliance Updates, Brochures & FAQs',
  description: 'Articles, co-operative banking updates, RBI compliance updates, product brochures, videos, case studies and FAQs from AVS InSoTech.',
  path: '/resources',
});

export default async function ResourcesPage() {
  const posts = await fetchContent('/api/content/articles', articles);
  const faqItems = await fetchContent('/api/content/faqs', faqs);
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <>
      <PageHero eyebrow="Resources" crumbs={[{ label: 'Resources' }]} title="Knowledge Centre" text="Insights, updates and material to help your institution make better technology decisions." />
      <section className="section">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resourceSections.map((r, i) => (
              <Reveal key={r.title} delay={(i % 4) * 60}>
                <a href={r.title === 'FAQs' ? '#faqs' : '#latest'} className="group card flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift">
                  <Icon name={r.icon} className="h-7 w-7 text-teal-500" />
                  <h2 className="mt-4 text-base font-semibold">{r.title}</h2>
                  <p className="mt-2 text-sm text-navy-500">{r.text}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section id="latest" className="section scroll-mt-24 bg-navy-50/60">
        <div className="container">
          <SectionHeading eyebrow="Latest" title="Articles & updates" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((a, i) => (
              <Reveal key={a.slug} delay={i * 70}>
                <Link href={`/resources/${a.slug}`} className="group card flex h-full flex-col overflow-hidden transition hover:shadow-lift">
                  <div className={`relative h-40 ${i % 2 ? 'bg-gradient-to-br from-teal-500 to-teal-800' : 'bg-gradient-to-br from-navy-700 to-navy-950'}`}><div className="absolute inset-0 bg-grid-dark" /></div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{a.category}</p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-teal-700">{a.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-navy-500">{a.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between text-xs text-navy-400">
                      <span>{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{a.readMins} min read</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section id="faqs" className="section scroll-mt-24">
        <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="FAQs" title="Frequently asked questions" text="Can’t find what you need? Our team is happy to help." />
            <Link href="/contact" className="btn-outline mt-8">Contact us <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <FaqList items={faqItems} />
        </div>
      </section>
      <CtaBand />
      <JsonLd data={faqSchema} />
    </>
  );
}
