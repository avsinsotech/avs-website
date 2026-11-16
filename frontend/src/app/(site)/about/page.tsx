import Image from 'next/image';
import { Eye, Target, CheckCircle2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import Counter from '@/components/Counter';
import { PageHero, SectionHeading, CtaBand } from '@/components/ui';
import { capabilities, company, stats } from '@/data/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'About AVS InSoTech – Banking Software Company in Navi Mumbai',
  description: 'AVS InSoTech Pvt. Ltd., established in 2018 and headquartered in Navi Mumbai, builds banking software, digital transformation, compliance and AI solutions for co-operative financial institutions.',
  path: '/about',
});

const mission = [
  'Deliver bank-grade technology that small and mid-sized institutions can afford and run.',
  'Make co-operative banking paperless, compliant and connected.',
  'Support every client through implementation, migration, training and long-term support.',
  'Lead the sector in practical AI-enabled productivity and customer-service solutions.',
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About AVS" crumbs={[{ label: 'About AVS' }]} title={<>The technology backbone for India’s <span className="text-teal-300">co-operative financial sector</span></>} text="Established in 2018 and headquartered at Millennium Business Park, Mahape, Navi Mumbai." />

      <section className="section">
        <div className="container grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Company Overview" title="Integrated technology for co-operative institutions" />
            <Reveal className="mt-6 space-y-5 text-base leading-relaxed text-navy-600">
              <p>{company.legalName} was established in {company.established} and is headquartered at Millennium Business Park, Mahape, Navi Mumbai.</p>
              <p>The company specialises in banking software, digital transformation, regulatory compliance, automation and AI solutions for co-operative financial institutions.</p>
              <p>AVS provides an integrated technology ecosystem covering core banking, digital onboarding, lending, recovery, compliance, treasury and enterprise automation.</p>
            </Reveal>
          </div>
          <Reveal className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-teal-100 to-navy-100" />
            <div className="relative grid grid-cols-2 gap-4 rounded-[2rem] bg-white p-6 shadow-lift">
              <div className="col-span-2 flex items-center justify-center rounded-2xl border border-navy-100 p-6">
                <Image src="/images/avs-logo.png" alt="AVS In-so-Tech Pvt. Ltd. logo" width={784} height={463} className="h-28 w-auto" />
              </div>
              {stats.slice(0, 4).map((s) => (
                <div key={s.label} className="rounded-2xl bg-navy-50 p-5">
                  <p className="font-display text-3xl font-bold text-navy-900"><Counter value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-navy-500">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-navy-50/60 pt-20">
        <div className="container grid gap-6 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-navy-950 p-10 text-white lg:p-12">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal-500/30 blur-3xl" />
            <Eye className="relative h-10 w-10 text-teal-300" />
            <h2 className="relative mt-6 text-3xl font-bold text-white">Vision</h2>
            <p className="relative mt-5 text-lg leading-relaxed text-navy-100">To become the most trusted technology partner for co-operative financial institutions, making every member’s banking experience digital, secure and as good as any large bank’s.</p>
          </Reveal>
          <Reveal delay={100} className="rounded-[2rem] border border-navy-100 bg-white p-10 shadow-card lg:p-12">
            <Target className="h-10 w-10 text-teal-500" />
            <h2 className="mt-6 text-3xl font-bold">Mission</h2>
            <ul className="mt-5 space-y-4">
              {mission.map((m) => <li key={m} className="flex gap-3 text-navy-600"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />{m}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Our Expertise & Team Capabilities" title="A multidisciplinary team of 51+ professionals" text="Engineering, banking domain, implementation and support specialists working together for every client." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 70}>
                <div className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 transition hover:border-teal-200 hover:shadow-card">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white"><Icon name={c.icon} className="h-6 w-6" /></span>
                  <h3 className="text-base font-semibold">{c.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 grid gap-4 md:grid-cols-3">
            {/* Replace with professional team / office photographs (no identifiable individuals) via Admin → Company Profile → Images */}
            {[{ t: 'Engineering', i: 'Code2' }, { t: 'Implementation', i: 'Rocket' }, { t: 'Support', i: 'Headset' }].map((x, k) => (
              <div key={x.t} className={`relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl p-6 ${k === 1 ? 'bg-gradient-to-br from-teal-500 to-teal-800' : 'bg-gradient-to-br from-navy-700 to-navy-950'}`}>
                <div className="absolute inset-0 bg-grid-dark" />
                <Icon name={x.i} className="absolute right-6 top-6 h-16 w-16 text-white/15" />
                <p className="relative font-display text-xl font-semibold text-white">{x.t}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
