import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarCheck, CheckCircle2, TrendingUp, Download, Cpu } from 'lucide-react';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import LeadForm from '@/components/LeadForm';
import ScreenshotMock from '@/components/ScreenshotMock';
import { PageHero, SectionHeading, ProductCard, JsonLd } from '@/components/ui';
import { productCategories } from '@/data/site';
import { products as seedProducts, techFor } from '@/data/products';
import { getProducts, getCompany } from '@/lib/content';
import { pageMeta, SITE_URL } from '@/lib/seo';

export const revalidate = 300;
export const dynamicParams = true;
export function generateStaticParams() { return seedProducts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await getProducts()).find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta({ title: p.metaTitle || `${p.name} – ${p.tagline}`, description: p.metaDescription || p.intro, path: `/products/${p.slug}` });
}

const tocItems = [
  ['introduction', 'Introduction'], ['features', 'Key Features'], ['benefits', 'Business Benefits'], ['modules', 'Modules'],
  ['workflow', 'Workflow'], ['technology', 'Technology'], ['screenshots', 'Screenshots'], ['demo', 'Request a Demo'],
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, company] = await Promise.all([getProducts(), getCompany()]);
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const cat = productCategories.find((c) => c.key === p.category)!;
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  const productNames = products.map((x) => x.name);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.intro,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Android',
    url: `${SITE_URL}/products/${p.slug}`,
    publisher: { '@type': 'Organization', name: company.legalName },
  };

  return (
    <>
      <PageHero eyebrow={cat.name} crumbs={[{ label: 'Products', href: '/products' }, { label: p.short ?? p.name }]} title={p.name} text={p.tagline}>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#demo" className="btn-primary"><CalendarCheck className="h-4 w-4" />Request a Demo</a>
          {p.brochure
            ? <a href={p.brochure} target="_blank" rel="noopener noreferrer" className="btn-ghost-light"><Download className="h-4 w-4" />Download Brochure</a>
            : <Link href={`/contact?product=${encodeURIComponent(p.name)}`} className="btn-ghost-light"><Download className="h-4 w-4" />Request Brochure</Link>}
        </div>
      </PageHero>

      <div className="container grid gap-12 py-16 lg:grid-cols-[220px_1fr] lg:py-20">
        <aside className="hidden lg:block">
          <nav className="sticky top-32 space-y-1 border-l border-navy-100" aria-label="On this page">
            {tocItems.map(([id, label]) => <a key={id} href={`#${id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-navy-500 hover:border-teal-500 hover:text-teal-600">{label}</a>)}
          </nav>
        </aside>

        <div className="min-w-0 space-y-20">
          {/* 1. Introduction */}
          <section id="introduction" className="scroll-mt-32">
            <div className="grid items-center gap-10 xl:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white"><Icon name={p.icon} className="h-7 w-7" /></span>
                <h2 className="mt-6 text-3xl font-bold">Product Introduction</h2>
                <p className="mt-4 text-lg leading-relaxed text-navy-600">{p.intro}</p>
              </div>
              <Reveal>{p.screenshots?.[0] ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.screenshots[0]} alt={`${p.name} screenshot`} className="w-full rounded-2xl border border-navy-100 shadow-lift" loading="lazy" /> : <ScreenshotMock title={`${p.short ?? p.name} – Dashboard`} />}</Reveal>
            </div>
          </section>

          {/* 2. Features */}
          <section id="features" className="scroll-mt-32">
            <SectionHeading eyebrow="Key Features" title="What you get" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {p.features.map((f, i) => (
                <Reveal key={f} delay={(i % 3) * 60}><div className="card flex h-full gap-3 p-5"><CheckCircle2 className="h-5 w-5 shrink-0 text-teal-500" /><span className="text-sm font-medium text-navy-800">{f}</span></div></Reveal>
              ))}
            </div>
          </section>

          {/* 3. Benefits */}
          <section id="benefits" className="scroll-mt-32">
            <div className="rounded-[2rem] bg-navy-950 p-8 text-white sm:p-12">
              <SectionHeading light eyebrow="Business Benefits" title="Why institutions choose it" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {p.benefits.map((b) => <div key={b} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-5"><TrendingUp className="h-5 w-5 shrink-0 text-teal-400" /><span className="text-navy-100">{b}</span></div>)}
              </div>
            </div>
          </section>

          {/* 4. Modules */}
          <section id="modules" className="scroll-mt-32">
            <SectionHeading eyebrow="Modules" title="Modules included" />
            <div className="mt-8 flex flex-wrap gap-3">
              {p.modules.map((m) => <span key={m} className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-800">{m}</span>)}
            </div>
          </section>

          {/* 5. Workflow */}
          <section id="workflow" className="scroll-mt-32">
            <SectionHeading eyebrow="Workflow" title="How it works" />
            <ol className="relative mt-10 grid gap-6 md:grid-flow-col md:auto-cols-fr">
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-teal-200 md:block" />
              {p.workflow.map((w, i) => (
                <li key={w} className="relative flex gap-4 md:flex-col md:gap-0">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-teal-500 bg-white font-display font-bold text-teal-600">{i + 1}</span>
                  <p className="pt-3 text-sm font-medium text-navy-800 md:pr-4 md:pt-4">{w}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 6. Technology */}
          <section id="technology" className="scroll-mt-32">
            <SectionHeading eyebrow="Technology" title="Built on a secure, modern stack" />
            <div className="mt-8 flex flex-wrap gap-3">
              {techFor(p).map((t) => <span key={t} className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-4 py-2.5 text-sm font-medium text-navy-700 shadow-sm"><Cpu className="h-4 w-4 text-teal-500" />{t}</span>)}
            </div>
          </section>

          {/* 7. Screenshots */}
          <section id="screenshots" className="scroll-mt-32">
            <SectionHeading eyebrow="Product Screenshots" title="A look inside" />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {p.screenshots && p.screenshots.length > 0
                ? p.screenshots.map((src, i) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={src} src={src} alt={`${p.name} screenshot ${i + 1}`} className="w-full rounded-2xl border border-navy-100 shadow-lift" loading="lazy" />)
                : <><ScreenshotMock title={`${p.short ?? p.name} – Overview`} variant={1} /><ScreenshotMock title={`${p.short ?? p.name} – Reports`} variant={2} /></>}
            </div>
          </section>

          {/* 8. Demo form */}
          <section id="demo" className="scroll-mt-32">
            <div className="grid gap-10 rounded-[2rem] border border-navy-100 bg-gradient-to-br from-white to-teal-50/60 p-8 shadow-card lg:grid-cols-[.8fr_1.2fr] lg:p-12">
              <div>
                <span className="eyebrow">Request a Demo</span>
                <h2 className="mt-4 text-3xl font-bold">See {p.short ?? p.name} in action</h2>
                <p className="mt-4 text-navy-600">Share a few details and our team will schedule a personalised demo for your institution.</p>
                <p className="mt-6 text-sm text-navy-500">Prefer to talk? Call <a href={`tel:${company.phoneE164}`} className="font-semibold text-teal-600">{company.phone}</a></p>
              </div>
              <LeadForm formType="demo" productOptions={productNames} defaultProduct={p.name} />
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section bg-navy-50/60 pt-16">
          <div className="container">
            <SectionHeading eyebrow="Related" title={`More in ${cat.name}`} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((r, i) => <ProductCard key={r.slug} p={r} delay={i * 60} />)}</div>
          </div>
        </section>
      )}
      <JsonLd data={schema} />
    </>
  );
}
