import { PageHero } from '@/components/ui';
import { company } from '@/data/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Terms of Use', description: 'Terms of use for the AVS InSoTech website.', path: '/terms' });

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" crumbs={[{ label: 'Terms of Use' }]} title="Terms of Use" />
      <div className="container max-w-3xl space-y-5 py-16 leading-relaxed text-navy-700">
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Template – to be reviewed and approved by AVS management / legal counsel before go-live.</p>
        <p>The content of this website is provided for general information about {company.legalName} and its products. Product names, logos and content are the property of {company.legalName}.</p>
        <p>Product capabilities may vary by version and configuration. Please contact our team for specific requirements.</p>
      </div>
    </>
  );
}
