import Link from 'next/link';
import { ArrowRight, ChevronRight, CalendarCheck, PhoneCall } from 'lucide-react';
import Icon from './Icon';
import Reveal from './Reveal';
import type { Product } from '@/data/products';

export function SectionHeading({ eyebrow, title, text, center = false, light = false }: { eyebrow?: string; title: React.ReactNode; text?: React.ReactNode; center?: boolean; light?: boolean }) {
  return (
    <Reveal className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <span className={light ? 'eyebrow border-white/15 bg-white/5 text-teal-300' : 'eyebrow'}>{eyebrow}</span>}
      <h2 className={`mt-4 text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[44px] ${light ? 'text-white' : ''}`}>{title}</h2>
      {text && <p className={`mt-5 text-base leading-relaxed sm:text-lg ${light ? 'text-navy-200' : 'text-navy-500'}`}>{text}</p>}
    </Reveal>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-navy-300">
      <Link href="/" className="hover:text-teal-300">Home</Link>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          {it.href ? <Link href={it.href} className="hover:text-teal-300">{it.label}</Link> : <span className="text-navy-100">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({ eyebrow, title, text, crumbs, children }: { eyebrow: string; title: React.ReactNode; text?: React.ReactNode; crumbs: { label: string; href?: string }[]; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-teal-500/25 blur-[120px]" />
      <div className="absolute -bottom-40 left-1/4 h-[300px] w-[300px] rounded-full bg-navy-500/40 blur-[120px]" />
      <div className="container relative py-16 lg:py-24">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 max-w-3xl animate-fade-up">
          <span className="eyebrow border-white/15 bg-white/5 text-teal-300">{eyebrow}</span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[56px]">{title}</h1>
          {text && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title = 'Ready to Digitally Transform Your Financial Institution?', text = 'Connect with AVS to discover how our integrated banking technology and AI solutions can improve your operations.' }: { title?: string; text?: string }) {
  return (
    <section className="section pt-0">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-900 to-teal-800 px-8 py-14 text-white sm:px-14 lg:py-20">
          <div className="absolute inset-0 bg-grid-dark opacity-60" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-400/30 blur-[100px]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px]">{title}</h2>
              <p className="mt-5 max-w-xl text-lg text-navy-100">{text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/request-demo" className="btn-primary px-7 py-4"><CalendarCheck className="h-4 w-4" />Schedule a Demo</Link>
              <Link href="/contact" className="btn-ghost-light px-7 py-4"><PhoneCall className="h-4 w-4" />Contact Our Team</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ProductCard({ p, delay = 0 }: { p: Product; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link href={`/products/${p.slug}`} className="group card relative flex h-full flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lift">
        <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal-500 to-teal-300 transition-transform duration-500 group-hover:scale-x-100" />
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 transition group-hover:from-teal-500 group-hover:to-teal-600 group-hover:text-white">
          <Icon name={p.icon} className="h-6 w-6" />
        </span>
        <h3 className="mt-5 text-lg font-semibold leading-snug">{p.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{p.tagline}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">View product <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </Link>
    </Reveal>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
