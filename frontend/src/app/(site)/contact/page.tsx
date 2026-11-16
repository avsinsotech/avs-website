import { Suspense } from 'react';
import { MapPin, Mail, Phone, Clock, MessageCircle } from 'lucide-react';
import ContactTabs from '@/components/ContactTabs';
import { PageHero } from '@/components/ui';
import { getCompany, getProducts } from '@/lib/content';
import { company as seedCompany } from '@/data/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Contact AVS InSoTech – Navi Mumbai',
  description: `Contact AVS InSoTech Pvt. Ltd., Office 409, Rupa Solitaire, Millennium Business Park, Mahape, Navi Mumbai. Call ${seedCompany.phone} or email ${seedCompany.email}.`,
  path: '/contact',
});

export default async function ContactPage() {
  const [company, products] = await Promise.all([getCompany(), getProducts()]);
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hello AVS InSoTech, I would like to know more about your solutions.')}`;
  const cards = [
    { icon: Phone, title: 'Call us', value: company.phone, href: `tel:${company.phoneE164}` },
    { icon: Mail, title: 'Email', value: company.email, href: `mailto:${company.email}` },
    { icon: MessageCircle, title: 'WhatsApp Enquiry', value: 'Chat with our team', href: wa },
  ];
  return (
    <>
      <PageHero eyebrow="Contact Us" crumbs={[{ label: 'Contact Us' }]} title="Let’s talk about your institution" text="Our team will get back to you within one business day." />
      <section className="relative z-10 -mt-10">
        <div className="container grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <a key={c.title} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group card flex items-center gap-4 p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-white"><c.icon className="h-5 w-5" /></span>
              <div><p className="text-xs font-semibold uppercase tracking-wider text-navy-400">{c.title}</p><p className="mt-0.5 font-semibold text-navy-900 group-hover:text-teal-600">{c.value}</p></div>
            </a>
          ))}
        </div>
      </section>
      <section className="section pt-16">
        <div className="container grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="card p-6 sm:p-10">
            <h2 className="text-2xl font-bold">Send us an enquiry</h2>
            <p className="mb-8 mt-2 text-sm text-navy-500">Fields marked * are required.</p>
            <Suspense fallback={null}><ContactTabs productOptions={products.map((p) => p.name)} /></Suspense>
          </div>
          <div className="space-y-6">
            <div className="card p-8">
              <h2 className="text-lg font-bold">{company.legalName}</h2>
              <ul className="mt-5 space-y-4 text-sm text-navy-600">
                <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />{company.address.full}</li>
                <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-teal-500" /><a href={`tel:${company.phoneE164}`} className="hover:text-teal-600">{company.phone}</a></li>
                <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-teal-500" /><a href={`mailto:${company.email}`} className="hover:text-teal-600">{company.email}</a></li>
                <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" /><div>{company.businessHours.map((b) => <p key={b.days}><span className="font-medium text-navy-800">{b.days}:</span> {b.hours}</p>)}</div></li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-navy-100 shadow-card">
              <iframe title="AVS InSoTech office location on Google Maps" src={company.mapEmbed} className="h-80 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
