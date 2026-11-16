import { CheckCircle2, Phone } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { PageHero } from '@/components/ui';
import { getCompany, getProducts } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Request a Demo',
  description: 'Schedule a personalised demo of AVS core banking, digital banking, compliance and AI solutions for your co-operative bank, credit society or NBFC.',
  path: '/request-demo',
});

export default async function DemoPage() {
  const [company, products] = await Promise.all([getCompany(), getProducts()]);
  return (
    <>
      <PageHero eyebrow="Request a Demo" crumbs={[{ label: 'Request a Demo' }]} title="See AVS in action" text="A personalised walkthrough for your institution, at your convenience." />
      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold">What to expect</h2>
            <ul className="mt-6 space-y-4">
              {['A short discussion of your institution and current systems', 'A live demo of the products relevant to you', 'Q&A with our banking and technology specialists', 'A clear next-steps plan – no obligation'].map((t) => (
                <li key={t} className="flex gap-3 text-navy-600"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />{t}</li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl bg-navy-950 p-6 text-white">
              <p className="text-sm text-navy-200">Prefer to call?</p>
              <a href={`tel:${company.phoneE164}`} className="mt-1 flex items-center gap-2 font-display text-2xl font-bold hover:text-teal-300"><Phone className="h-5 w-5 text-teal-400" />{company.phone}</a>
              <p className="mt-2 text-sm text-navy-300">{company.email}</p>
            </div>
          </div>
          <div className="card p-6 sm:p-10"><LeadForm formType="demo" productOptions={products.map((p) => p.name)} /></div>
        </div>
      </section>
    </>
  );
}
