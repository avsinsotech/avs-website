// Server-side content layer. Reads CMS content from the ASP.NET Core API
// (edited in the admin panel) and falls back to the seed data in src/data.
import { fetchContent } from './api';
import { products as seedProducts, featuredOrder, type Product } from '@/data/products';
import { company as seedCompany, solutions as seedSolutions, stats as seedStats, type Solution } from '@/data/site';

const lines = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(String).filter(Boolean) : typeof v === 'string' ? v.split('\n').map((s) => s.trim()).filter(Boolean) : [];

function normalizeProduct(r: Record<string, unknown>): Product & { screenshots?: string[]; brochure?: string; metaTitle?: string; metaDescription?: string } {
  return {
    slug: String(r.slug ?? ''),
    name: String(r.name ?? ''),
    short: r.short ? String(r.short) : undefined,
    category: (r.category as Product['category']) ?? 'core',
    icon: String(r.icon || 'Box'),
    tagline: String(r.tagline ?? ''),
    intro: String(r.intro ?? ''),
    features: lines(r.features),
    benefits: lines(r.benefits),
    modules: lines(r.modules),
    workflow: lines(r.workflow),
    tech: lines(r.tech).length ? lines(r.tech) : undefined,
    featured: !!r.featured,
    screenshots: [r.screenshot1, r.screenshot2].filter(Boolean).map(String),
    brochure: r.brochure ? String(r.brochure) : undefined,
    metaTitle: r.metaTitle ? String(r.metaTitle) : undefined,
    metaDescription: r.metaDescription ? String(r.metaDescription) : undefined,
  };
}

export type CmsProduct = ReturnType<typeof normalizeProduct>;

export async function getProducts(): Promise<CmsProduct[]> {
  const raw = await fetchContent<Record<string, unknown>[] | null>('/api/content/products', null);
  if (!raw || !raw.length) return seedProducts;
  return raw.map(normalizeProduct).filter((p) => p.slug && p.name);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getFeaturedProducts() {
  const all = await getProducts();
  const flagged = all.filter((p) => p.featured);
  const ordered = featuredOrder.map((s) => flagged.find((p) => p.slug === s)).filter(Boolean) as CmsProduct[];
  return [...ordered, ...flagged.filter((p) => !featuredOrder.includes(p.slug))];
}

export async function getSolutions(): Promise<Solution[]> {
  const raw = await fetchContent<Record<string, unknown>[] | null>('/api/content/solutions', null);
  if (!raw || !raw.length) return seedSolutions;
  return raw.map((r) => ({
    slug: String(r.slug), name: String(r.name), icon: String(r.icon || 'Layers'), summary: String(r.summary ?? ''),
    description: String(r.description ?? ''), categoryKey: (r.categoryKey as Solution['categoryKey']) ?? 'core', outcomes: lines(r.outcomes),
  }));
}

export async function getCompany() {
  const s = await fetchContent<Record<string, unknown> | null>('/api/content/settings/company', null);
  if (!s) return seedCompany;
  const phone = String(s.phone || seedCompany.phone);
  const digits = phone.replace(/\D/g, '');
  return {
    ...seedCompany,
    legalName: String(s.legalName || seedCompany.legalName),
    tagline: String(s.tagline || seedCompany.tagline),
    positioning: String(s.positioning || seedCompany.positioning),
    email: String(s.email || seedCompany.email),
    phone,
    phoneE164: `+${digits}`,
    whatsapp: String(s.whatsapp || digits),
    address: { ...seedCompany.address, full: String(s.address || seedCompany.address.full) },
    businessHours: lines(s.businessHours).length
      ? lines(s.businessHours).map((l) => { const [days, ...rest] = l.split(':'); return { days: days.trim(), hours: rest.join(':').trim() }; })
      : seedCompany.businessHours,
  };
}

export type Company = Awaited<ReturnType<typeof getCompany>>;

export async function getStats() {
  return fetchContent('/api/content/stats', seedStats);
}
