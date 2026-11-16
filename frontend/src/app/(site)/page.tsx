import Link from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2 } from 'lucide-react';
import HeroVisual from '@/components/HeroVisual';
import Counter from '@/components/Counter';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import { SectionHeading, CtaBand, ProductCard } from '@/components/ui';
import { audiences, whyChoose, processSteps, technologies } from '@/data/site';
import { getCompany, getFeaturedProducts, getSolutions, getStats } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Core Banking Software for Co-operative Banks & Credit Societies | AVS InSoTech',
  description:
    'AVS InSoTech – the technology backbone for India’s co-operative financial sector. Core Banking, Digital Banking, CKYC, RBI compliance, gold loan and AI recovery software for co-operative banks, credit societies, DCCBs and NBFCs.',
  path: '/',
  keywords: ['Core Banking Software for Co-operative Banks', 'Credit Society Software', 'Co-operative Bank Software', 'CBS Software Maharashtra', 'Banking Software Company India', 'Co-operative Banking Technology'],
});

export default async function HomePage() {
  const [liveStats, featured, solutions, company] = await Promise.all([getStats(), getFeaturedProducts(), getSolutions(), getCompany()]);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" />
        <div className="absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-teal-200/40 blur-[140px]" />
        <div className="container relative grid items-center gap-12 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          <div className="animate-fade-up">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" />Since {company.established} · Navi Mumbai</span>
            <h1 className="mt-6 text-[40px] font-extrabold leading-[1.06] sm:text-5xl lg:text-[60px]">
              Transforming <span className="text-gradient"><span className="nowrap">Co-operative</span> Banking</span> Through Technology, Digital Innovation &amp; AI.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-500">
              AVS InSoTech empowers Co-operative Banks, Credit Societies, DCCBs and NBFCs with integrated Core Banking, Digital Banking, Regulatory Compliance and AI-powered solutions.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/request-demo" className="btn-primary px-7 py-4 text-[15px]"><CalendarCheck className="h-4 w-4" />Request a Demo</Link>
              <Link href="/solutions" className="btn-outline px-7 py-4 text-[15px]">Explore Our Solutions<ArrowRight className="h-4 w-4" /></Link>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-600">
              {['Integrated ecosystem', 'Marathi & English support', 'AI-first approach'].map((t) => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-500" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up [animation-delay:.15s]"><HeroVisual /></div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="relative -mt-6 pb-8">
        <div className="container">
          <div className="grid grid-cols-2 overflow-hidden rounded-3xl bg-navy-950 text-white shadow-lift md:grid-cols-5">
            {liveStats.map((s, i) => (
              <div key={s.label} className={`relative px-6 py-8 text-center ${i ? 'md:border-l md:border-white/10' : ''} ${i === 4 ? 'col-span-2 md:col-span-1' : ''} ${i < 4 ? 'border-b border-white/10 md:border-b-0' : ''} ${i % 2 === 1 ? 'border-l border-white/10' : ''}`}>
                <p className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} plain={'noAnimateFormat' in s && !!s.noAnimateFormat} />
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-teal-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHO WE SERVE ---------------- */}
      <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Who We Serve" title={<>Built for India’s <span className="text-gradient"><span className="nowrap">co-operative</span> financial sector</span></>} text="From village credit societies to state apex banks – AVS solutions are designed around the realities of co-operative institutions." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <Link href={`/industries#${a.slug}`} className="group relative flex h-full items-start gap-5 overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 transition hover:-translate-y-1 hover:border-transparent hover:bg-navy-900 hover:shadow-lift">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white"><Icon name={a.icon} className="h-7 w-7" /></span>
                  <div>
                    <h3 className="text-lg font-semibold transition group-hover:text-white">{a.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-500 transition group-hover:text-navy-200">{a.blurb}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CORE SOLUTIONS ---------------- */}
      <section className="section relative overflow-hidden bg-navy-50/60">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="container relative">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Our Core Solutions" title="An integrated banking technology ecosystem" text="Six solution areas that cover every department of a co-operative financial institution." />
            <Reveal><Link href="/solutions" className="btn-outline">All solutions <ArrowRight className="h-4 w-4" /></Link></Reveal>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70} className="h-full">
                <div className="group card flex h-full flex-col p-7 transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-[0_10px_24px_-10px_rgba(23,143,167,.8)]"><Icon name={s.icon} className="h-7 w-7" /></span>
                    <span className="font-display text-5xl font-bold text-navy-50">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{s.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-500">{s.summary}</p>
                  <Link href={`/solutions/${s.slug}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">Explore More <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Featured Products" title={<>Products that power <span className="text-gradient">modern <span className="nowrap">co-operative</span> banking</span></>} text="Each product works on its own and even better together within the AVS ecosystem." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => <ProductCard key={p.slug} p={p} delay={(i % 4) * 70} />)}
          </div>
          <div className="mt-10 text-center"><Link href="/products" className="btn-dark">View complete product catalogue <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE AVS ---------------- */}
      <section className="section relative overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-teal-500/20 blur-[130px]" />
        <div className="container relative grid gap-14 lg:grid-cols-[.9fr_1.4fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading light eyebrow="Why Choose AVS" title="A long-term technology partner, not just a software vendor." text={<>Our tagline says it best: <em className="text-teal-300 not-italic font-semibold">“{company.tagline}”</em> Every implementation is handled with the care your members deserve.</>} />
            <Reveal className="mt-8"><Link href="/about" className="btn-primary">About AVS <ArrowRight className="h-4 w-4" /></Link></Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyChoose.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:border-teal-400/40 hover:bg-white/[.06]">
                  <Icon name={w.icon} className="h-7 w-7 text-teal-400" />
                  <h3 className="mt-4 text-lg font-semibold text-white">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-200">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- IMPLEMENTATION PROCESS ---------------- */}
      <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Implementation Process" title="A proven path from requirement study to go-live" text="Our dedicated implementation team follows a structured six-step approach." />
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent lg:block" />
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
              {processSteps.map((s, i) => (
                <Reveal as="li" key={s.no} delay={i * 90} className="relative text-center">
                  <span className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-200 bg-white font-display text-xl font-bold text-teal-600 shadow-card">{s.no}</span>
                  <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">{s.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- TECHNOLOGY ---------------- */}
      <section className="section bg-gradient-to-b from-white via-teal-50/50 to-white pt-0 lg:pt-0">
        <div className="container">
          <div className="grid items-center gap-12 rounded-[2rem] border border-navy-100 bg-white p-8 shadow-card lg:grid-cols-[1fr_1.5fr] lg:p-14">
            <div>
              <SectionHeading eyebrow="Technology & Innovation" title="Modern, proven technology – with AI at the core" text="AVS builds on enterprise-grade Microsoft and open-source technologies, with mobile apps, APIs and AI services connected to a secure core." />
              <Reveal className="mt-8"><Link href="/technology" className="btn-outline">Technology & Security <ArrowRight className="h-4 w-4" /></Link></Reveal>
            </div>
            <div className="flex flex-wrap gap-3">
              {technologies.map((t, i) => (
                <Reveal key={t.name} delay={i * 40}>
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-navy-100 bg-white px-4 py-2.5 text-sm font-medium text-navy-800 shadow-sm transition hover:border-teal-300 hover:text-teal-700">
                    <Icon name={t.icon} className="h-4 w-4 text-teal-500" />{t.name}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
