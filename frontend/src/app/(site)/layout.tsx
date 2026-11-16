import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { JsonLd } from '@/components/ui';
import { getCompany, getSolutions, getProducts, getFeaturedProducts } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

const buildOrgSchema = (company: Awaited<ReturnType<typeof getCompany>>) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  alternateName: ['AVS', 'AVS In-so-Tech'],
  url: SITE_URL,
  logo: `${SITE_URL}/images/avs-logo.png`,
  slogan: company.tagline,
  foundingDate: String(company.established),
  email: company.email,
  telephone: company.phoneE164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${company.address.line1}, ${company.address.line2}`,
    addressLocality: company.address.city,
    postalCode: company.address.pin,
    addressRegion: company.address.state,
    addressCountry: 'IN',
  },
  areaServed: ['Maharashtra', 'India'],
  contactPoint: [{ '@type': 'ContactPoint', telephone: company.phoneE164, email: company.email, contactType: 'sales', availableLanguage: ['English', 'Marathi'] }],
});

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [company, solutions, products, featured] = await Promise.all([getCompany(), getSolutions(), getProducts(), getFeaturedProducts()]);
  const lite = (p: { slug: string; name: string; short?: string; category: string }) => ({ slug: p.slug, name: p.name, short: p.short, category: p.category });
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-teal-500 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <Header
        solutions={solutions.map((s) => ({ slug: s.slug, name: s.name, summary: s.summary, icon: s.icon }))}
        products={products.map(lite)}
        featured={featured.map(lite)}
        company={{ phone: company.phone, phoneE164: company.phoneE164, email: company.email, positioning: company.positioning }}
      />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton number={company.whatsapp} />
      <JsonLd data={buildOrgSchema(company)} />
    </>
  );
}
