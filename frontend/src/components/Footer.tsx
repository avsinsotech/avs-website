import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { getCompany, getSolutions, getFeaturedProducts } from '@/lib/content';

export default async function Footer() {
  const [company, solutions, featured] = await Promise.all([getCompany(), getSolutions(), getFeaturedProducts()]);
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-200">
      <div className="absolute inset-0 bg-grid-dark opacity-50" />
      <div className="container relative grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <div className="inline-block rounded-2xl bg-white p-3">
            <Image src="/images/avs-logo.png" alt="AVS In-so-Tech Pvt. Ltd. logo" width={784} height={463} className="h-16 w-auto" />
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed">{company.positioning}</p>
          <p className="mt-4 text-sm font-semibold italic text-teal-300">“{company.tagline}”</p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Solutions</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {solutions.map((s) => <li key={s.slug}><Link href={`/solutions/${s.slug}`} className="hover:text-teal-300">{s.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Products</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {featured.map((p) => <li key={p.slug}><Link href={`/products/${p.slug}`} className="hover:text-teal-300">{p.short ?? p.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Head Office</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" /><span>{company.address.full}</span></li>
            <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-teal-400" /><a href={`tel:${company.phoneE164}`} className="hover:text-teal-300">{company.phone}</a></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-teal-400" /><a href={`mailto:${company.email}`} className="hover:text-teal-300">{company.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" /><span>{company.businessHours.map((b) => `${b.days}: ${b.hours}`).join(' · ')}</span></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs sm:flex-row">
          <p>© {year} {company.legalName} All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/about" className="hover:text-teal-300">About</Link>
            <Link href="/industries" className="hover:text-teal-300">Industries</Link>
            <Link href="/resources" className="hover:text-teal-300">Resources</Link>
            <Link href="/privacy-policy" className="hover:text-teal-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-teal-300">Terms of Use</Link>
            <Link href="/sitemap.xml" className="hover:text-teal-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
