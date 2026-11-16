import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import { PageHero, SectionHeading, CtaBand } from '@/components/ui';
import { securityFeatures, technologies } from '@/data/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Technology & Security – Architecture, APIs and Data Protection',
  description: 'AVS InSoTech technology and security: web and mobile architecture, REST API integration, role-based access, OTP/2FA, encryption, HTTPS, activity logging, backup & disaster recovery and secure data migration.',
  path: '/technology',
});

export default function TechnologyPage() {
  return (
    <>
      <PageHero eyebrow="Technology & Security" crumbs={[{ label: 'Technology' }]} title="Secure, scalable technology for financial institutions" text="How AVS applications are architected, integrated and protected." />
      <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Architecture" title="Solution architecture at a glance" text="Channels, security, application services and data – layered for control and scalability." />
          <Reveal className="mt-12"><ArchitectureDiagram /></Reveal>
        </div>
      </section>
      <section className="section bg-navy-50/60">
        <div className="container">
          <SectionHeading center eyebrow="Security Capabilities" title="Security built into every layer" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {securityFeatures.map((f, i) => (
              <Reveal key={f.title} delay={(i % 5) * 60} className="h-full">
                <div className="card h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-teal-300"><Icon name={f.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Technology Stack" title="Technologies we work with" />
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {technologies.map((t, i) => (
              <Reveal key={t.name} delay={(i % 4) * 50}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-navy-100 p-6 text-center transition hover:border-teal-300 hover:shadow-card">
                  <Icon name={t.icon} className="h-8 w-8 text-teal-500" />
                  <p className="mt-3 text-sm font-semibold text-navy-800">{t.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
