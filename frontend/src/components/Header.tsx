'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ChevronDown, Menu, X, ArrowRight, Landmark, Smartphone, ShieldCheck, HandCoins, Sparkles, LineChart, Briefcase, Phone, Mail,
} from 'lucide-react';
import { productCategories } from '@/data/site';

type NavSolution = { slug: string; name: string; summary: string; icon: string };
type NavProduct = { slug: string; name: string; short?: string; category: string };
type NavCompany = { phone: string; phoneE164: string; email: string; positioning: string };

const catIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, Smartphone, ShieldCheck, HandCoins, Sparkles, LineChart, Briefcase,
};

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About AVS' },
  { href: '/solutions', label: 'Solutions', menu: 'solutions' as const },
  { href: '/products', label: 'Products', menu: 'products' as const },
  { href: '/industries', label: 'Industries' },
  { href: '/technology', label: 'Technology' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header({ solutions, products, featured, company }: { solutions: NavSolution[]; products: NavProduct[]; featured: NavProduct[]; company: NavCompany }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<null | 'solutions' | 'products'>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-white/90 shadow-[0_1px_0_rgba(8,21,43,.06)] backdrop-blur-xl' : 'bg-white'}`}>
      {/* Utility bar */}
      <div className="hidden border-b border-navy-50 bg-navy-950 text-xs text-navy-100 lg:block">
        <div className="container flex h-9 items-center justify-between">
          <p className="opacity-80">{company.positioning}</p>
          <div className="flex items-center gap-6">
            <a href={`tel:${company.phoneE164}`} className="flex items-center gap-1.5 hover:text-teal-300"><Phone className="h-3.5 w-3.5" />{company.phone}</a>
            <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:text-teal-300"><Mail className="h-3.5 w-3.5" />{company.email}</a>
          </div>
        </div>
      </div>

      <div className="container flex h-[76px] items-center justify-between gap-6" onMouseLeave={() => setOpen(null)}>
        <Link href="/" aria-label="AVS InSoTech – Home" className="shrink-0">
          <Image src="/images/avs-logo.png" alt="AVS In-so-Tech Pvt. Ltd. logo" width={784} height={463} priority className="h-14 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {nav.map((item) => (
            <div key={item.href} className="relative" onMouseEnter={() => setOpen(item.menu ?? null)}>
              <Link
                href={item.href}
                className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition ${isActive(item.href) ? 'text-teal-600' : 'text-navy-700 hover:text-teal-600'}`}
                aria-expanded={item.menu ? open === item.menu : undefined}
              >
                {item.label}
                {item.menu && <ChevronDown className={`h-3.5 w-3.5 transition ${open === item.menu ? 'rotate-180' : ''}`} />}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/request-demo" className="btn-primary hidden sm:inline-flex">Request a Demo</Link>
          <button className="rounded-full p-2 text-navy-800 xl:hidden" onClick={() => setMobile((v) => !v)} aria-label="Toggle menu">
            {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mega menus */}
        {open && (
          <div className="absolute inset-x-0 top-full hidden xl:block" onMouseEnter={() => setOpen(open)}>
            <div className="container">
              <div className="mt-1 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-lift animate-fade-up [animation-duration:.25s]">
                {open === 'solutions' ? (
                  <div className="grid grid-cols-[1fr_300px]">
                    <div className="grid grid-cols-3 gap-1 p-6">
                      {solutions.map((s) => {
                        const I = catIcons[s.icon] ?? Sparkles;
                        return (
                          <Link key={s.slug} href={`/solutions/${s.slug}`} className="group rounded-2xl p-4 transition hover:bg-teal-50">
                            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white"><I className="h-5 w-5" /></span>
                            <p className="font-semibold text-navy-900">{s.name}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy-500">{s.summary}</p>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="relative flex flex-col justify-end overflow-hidden bg-navy-900 p-7 text-white">
                      <div className="absolute inset-0 bg-grid-dark" />
                      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-teal-500/30 blur-3xl" />
                      <p className="relative text-xs font-semibold uppercase tracking-widest text-teal-300">Integrated ecosystem</p>
                      <p className="relative mt-2 font-display text-xl font-semibold leading-snug">One partner for every department of your institution.</p>
                      <Link href="/solutions" className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-white">All solutions <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_340px]">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-6 p-7">
                      {productCategories.map((c) => {
                        const I = catIcons[c.icon] ?? Sparkles;
                        const items = products.filter((p) => p.category === c.key).slice(0, 5);
                        return (
                          <div key={c.key}>
                            <Link href={`/products?category=${c.key}`} className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 hover:text-teal-500">
                              <I className="h-4 w-4" />{c.name}
                            </Link>
                            <ul className="space-y-1">
                              {items.map((p) => (
                                <li key={p.slug}><Link href={`/products/${p.slug}`} className="block rounded-lg px-2 py-1 text-[13px] text-navy-600 hover:bg-navy-50 hover:text-navy-900">{p.short ?? p.name}</Link></li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-l border-navy-100 bg-navy-50/60 p-7">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">Featured products</p>
                      <ul className="space-y-1">
                        {featured.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/products/${p.slug}`} className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-navy-800 hover:bg-white hover:shadow-card">
                              {p.short ?? p.name}<ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 text-teal-500" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href="/products" className="mt-4 inline-flex items-center gap-2 px-3 text-sm font-semibold text-teal-600">View full catalogue <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-navy-100 bg-white xl:hidden">
          <nav className="container flex flex-col py-4" aria-label="Mobile">
            {nav.map((item) => (
              <div key={item.href} className="border-b border-navy-50">
                <Link href={item.href} className={`block py-3.5 text-base font-medium ${isActive(item.href) ? 'text-teal-600' : 'text-navy-800'}`}>{item.label}</Link>
                {item.menu === 'solutions' && (
                  <div className="grid grid-cols-1 gap-1 pb-3 pl-3 sm:grid-cols-2">
                    {solutions.map((s) => <Link key={s.slug} href={`/solutions/${s.slug}`} className="py-1.5 text-sm text-navy-500">{s.name}</Link>)}
                  </div>
                )}
                {item.menu === 'products' && (
                  <div className="grid grid-cols-1 gap-1 pb-3 pl-3 sm:grid-cols-2">
                    {featured.map((p) => <Link key={p.slug} href={`/products/${p.slug}`} className="py-1.5 text-sm text-navy-500">{p.short ?? p.name}</Link>)}
                  </div>
                )}
              </div>
            ))}
            <Link href="/request-demo" className="btn-primary mt-5">Request a Demo</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
