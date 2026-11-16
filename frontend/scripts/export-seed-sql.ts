// Generates backend/AvsWebsite.Api/Database/002_seed_content.sql from the website seed data.
// Run:  npx tsx scripts/export-seed-sql.ts
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { products } from '../src/data/products';
import { solutions, productCategories, articles, faqs, company, stats } from '../src/data/site';

const q = (s: string) => `N'${s.replace(/'/g, "''")}'`;
const rows: string[] = [];
const add = (type: string, slug: string | null, title: string, sort: number, data: object) =>
  rows.push(`IF NOT EXISTS (SELECT 1 FROM dbo.ContentItems WHERE ContentType='${type}' AND ${slug ? `Slug=${q(slug)}` : `Title=${q(title)}`})\n  INSERT INTO dbo.ContentItems (ContentType, Slug, Title, SortOrder, IsPublished, DataJson) VALUES ('${type}', ${slug ? q(slug) : 'NULL'}, ${q(title)}, ${sort}, 1, ${q(JSON.stringify(data))});`);

const j = (a?: string[]) => (a ?? []).join('\n');
products.forEach((p, i) => add('products', p.slug, p.name, i, { ...p, features: j(p.features), benefits: j(p.benefits), modules: j(p.modules), workflow: j(p.workflow), tech: j(p.tech), featured: !!p.featured }));
productCategories.forEach((c, i) => add('categories', c.key, c.name, i, c));
solutions.forEach((s, i) => add('solutions', s.slug, s.name, i, { ...s, outcomes: j(s.outcomes) }));
articles.forEach((a, i) => add('articles', a.slug, a.title, i, { ...a, body: '' }));
faqs.forEach((f, i) => add('faqs', null, f.q, i, { question: f.q, answer: f.a }));

const settings = {
  company: { legalName: company.legalName, tagline: company.tagline, positioning: company.positioning, email: company.email, phone: company.phone, whatsapp: company.whatsapp, address: company.address.full, businessHours: company.businessHours.map((b) => `${b.days}: ${b.hours}`).join('\n') },
  homepage: { heroHeadline: 'Transforming Co-operative Banking Through Technology, Digital Innovation & AI.', heroSubheadline: 'AVS InSoTech empowers Co-operative Banks, Credit Societies, DCCBs and NBFCs with integrated Core Banking, Digital Banking, Regulatory Compliance and AI-powered solutions.', statClients: stats[0].value, statCustomersLakh: stats[1].value, statProfessionals: stats[2].value, statProducts: stats[3].value, established: stats[4].value, ctaTitle: 'Ready to Digitally Transform Your Financial Institution?' },
  seo: { defaultTitle: 'AVS InSoTech | Core Banking Software for Co-operative Banks & Credit Societies', defaultDescription: '', keywords: 'Core Banking Software for Co-operative Banks, Credit Society Software, Co-operative Bank Software, CBS Software Maharashtra, CKYC Automation Software, Digital Banking Solutions, AI Recovery Calling Software, NBFC Gold Loan Software, RBI Compliance Software, Banking Software Company India, Co-operative Banking Technology', gaMeasurementId: '', gscVerification: '' },
};
for (const [k, v] of Object.entries(settings))
  rows.push(`IF NOT EXISTS (SELECT 1 FROM dbo.SiteSettings WHERE GroupKey='${k}')\n  INSERT INTO dbo.SiteSettings (GroupKey, ValueJson) VALUES ('${k}', ${q(JSON.stringify(v))});`);

const out = `/* Seed content generated from the website seed data (scripts/export-seed-sql.ts).\n   Only inserts rows that don't exist yet – never overwrites admin edits. */\nSET NOCOUNT ON;\nGO\n${rows.join('\nGO\n')}\nGO\n`;
writeFileSync(resolve(__dirname, '../../backend/AvsWebsite.Api/Database/002_seed_content.sql'), out);
console.log(`Wrote ${rows.length} seed statements.`);
