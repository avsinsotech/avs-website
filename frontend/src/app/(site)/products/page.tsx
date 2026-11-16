import { Suspense } from 'react';
import Icon from '@/components/Icon';
import ProductCatalog from '@/components/ProductCatalog';
import { PageHero, CtaBand } from '@/components/ui';
import { productCategories } from '@/data/site';
import { getProducts } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Products – Core Banking, CKYC, Gold Loan, AI Recovery & More',
  description: 'Explore the AVS product catalogue: Core Banking Solution, Digital & Mobile Banking, e-KYC, CKYC Automation, AML, Loan Origination, Swarna Pay Gold Loan, Vasuli360° AI Recovery, AI360, Treasury, HRMS and more.',
  path: '/products',
  keywords: ['CKYC Automation Software', 'AI Recovery Calling Software', 'NBFC Gold Loan Software', 'Core Banking Software for Co-operative Banks'],
});

export default async function ProductsPage() {
  const products = await getProducts();
  const items = products.map((p) => ({ slug: p.slug, name: p.name, tagline: p.tagline, category: p.category, featured: p.featured, icon: <Icon name={p.icon} className="h-6 w-6" /> }));
  return (
    <>
      <PageHero eyebrow="Products" crumbs={[{ label: 'Products' }]} title="The complete AVS product catalogue" text={`${products.length} products and modules across core banking, compliance, lending, AI, treasury and enterprise operations.`} />
      <section className="section pt-10">
        <div className="container">
          <Suspense fallback={null}><ProductCatalog items={items} categories={productCategories} /></Suspense>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
