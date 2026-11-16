import { PageHero } from '@/components/ui';
import { company } from '@/data/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Privacy Policy', description: 'How AVS InSoTech collects and uses information submitted through this website.', path: '/privacy-policy' });

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" crumbs={[{ label: 'Privacy Policy' }]} title="Privacy Policy" />
      <div className="container max-w-3xl space-y-5 py-16 leading-relaxed text-navy-700">
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Template – to be reviewed and approved by AVS management / legal counsel before go-live (including Digital Personal Data Protection Act, 2023 requirements).</p>
        <h2 className="text-xl font-bold">Information we collect</h2>
        <p>When you submit an enquiry, we collect your name, organisation, designation, mobile number, email, institution type, product of interest and message.</p>
        <h2 className="text-xl font-bold">How we use it</h2>
        <p>We use this information only to respond to your enquiry, schedule demos and share information about our products that you asked for. We do not sell your data.</p>
        <h2 className="text-xl font-bold">Retention and your rights</h2>
        <p>You may ask us to access, correct or delete your data by writing to {company.email}.</p>
        <h2 className="text-xl font-bold">Contact</h2>
        <p>{company.legalName}, {company.address.full} Phone: {company.phone}.</p>
      </div>
    </>
  );
}
