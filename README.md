# AVS InSoTech Pvt. Ltd. – Corporate Website

**The Technology Backbone for India's Co-operative Financial Sector.**
*Quality, Not Quantity, Is Our Measure.*

This repository contains the complete source code for the AVS corporate website: the public site, the admin dashboard (CMS), and the ASP.NET Core Web API with its SQL Server database.

```
avs-website/
├── frontend/                  Next.js 15 · React 19 · TypeScript · Tailwind CSS
│   ├── src/app/(site)/        Public pages (Home, About, Solutions, Products, Industries, Technology, Resources, Contact, Demo)
│   ├── src/app/admin/         Admin dashboard (login, enquiries, content, settings)
│   ├── src/components/        UI components (Header + mega menus, forms, hero visual, diagrams…)
│   ├── src/data/              Seed content (products, solutions, industries, FAQs…)
│   ├── src/lib/               API client, CMS content layer, SEO helpers
│   └── scripts/               export-seed-sql.ts → generates the DB seed from src/data
├── backend/AvsWebsite.Api/    ASP.NET Core 8 Web API · C# · ADO.NET (no ORM) · JWT
│   ├── Controllers/           Auth, Leads, Content (public), Admin* (protected)
│   ├── Services/              Email (lead forwarding), JWT, PBKDF2 hashing, reCAPTCHA, audit
│   └── Database/              001_schema.sql, 002_seed_content.sql
├── deploy/                    Nginx, systemd, PM2, IIS configs
├── docs/DEPLOYMENT.md         Step-by-step production deployment
└── docs/CONTENT-REVIEW.md     Items AVS must verify before go-live
```

## What's included

| Area | Delivered |
|---|---|
| Pages | Home (hero, animated stats, who we serve, 6 solutions, 8 featured products, why AVS, 6-step process, technology, CTA) · About · Solutions + 6 solution pages · Products catalogue with category filters & search · **38 individual product landing pages** (Intro, Features, Benefits, Modules, Workflow, Technology, Screenshots, Demo form) · Industries (6 segments) · Technology & Security (architecture diagram) · Resources (articles, FAQs, knowledge centre) · Contact · Request a Demo · Privacy · Terms · 404 |
| Navigation | 8-item main nav, Solutions & Products mega-menus, prominent **Request a Demo** button, mobile menu |
| Lead management | Contact, Demo and Product Enquiry forms → validated → stored in SQL Server → emailed to `sales@avsinsotech.com`. Honeypot + timing check + IP rate limiting + optional reCAPTCHA v3 + mandatory consent |
| Contact | Google Map, WhatsApp floating button & links, business hours. **Only +91 9029088876 is used.** |
| Admin panel | Dashboard, Enquiries & Demos (filter, status workflow, notes, call/email/WhatsApp, CSV export), Homepage content & statistics, Company & contact info, Products, Categories, Solutions, Blogs & Articles, FAQs, Images & Brochures (upload), SEO settings |
| SEO | Per-page meta titles/descriptions, canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`, Organization / SoftwareApplication / FAQPage / Article schema, GA4 and Search Console hooks, target keywords in page copy |
| Security | JWT auth, PBKDF2 passwords, account lockout, rate limiting, CORS allow-list, parameterised SQL, upload type/size checks, security headers, HTTPS/HSTS, audit log |
| Performance | Static generation + 5-min revalidation, self-hosted fonts, ~106 kB first-load JS, image optimisation, API output caching |
| Excluded (per brief) | No investor sections, client lists, leadership names, employee profiles or commercial information |

## Run locally

```bash
# Website (works on its own – admin runs in browser-only DEMO mode without the API)
cd frontend
npm install
cp .env.example .env.local      # leave NEXT_PUBLIC_API_URL empty for demo mode
npm run dev                     # http://localhost:3000   ·   admin: http://localhost:3000/admin

# API (needs SQL Server)
cd backend/AvsWebsite.Api
dotnet run -- migrate                                  # creates tables + seeds content
dotnet run -- create-admin admin@avsinsotech.com "AVS Admin"   # prompts for password
dotnet run --urls http://localhost:5080                 # Swagger at /swagger in Development
```

Then set `NEXT_PUBLIC_API_URL=http://localhost:5080` in `frontend/.env.local` and restart the website.

## How content flows

1. Seed content lives in `frontend/src/data/*`. `npx tsx scripts/export-seed-sql.ts` turns it into `002_seed_content.sql`.
2. After `migrate`, the database holds the content. The AVS team edits it in **/admin**.
3. The website reads from `/api/content/*` and revalidates every 5 minutes. If the API is down, pages fall back to the seed content, so the site never breaks.

## API overview

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/leads` | public (rate-limited) |
| GET | `/api/content/{products,solutions,categories,articles,faqs,media,stats}` · `/api/content/settings/{company,homepage}` | public (cached) |
| POST | `/api/auth/login` | public (rate-limited, lockout) |
| GET | `/api/admin/dashboard` | JWT |
| GET / PATCH | `/api/admin/leads` · `/api/admin/leads/{id}` · `/api/admin/leads/export` | JWT |
| GET / POST / PUT / DELETE | `/api/admin/{products\|categories\|solutions\|articles\|faqs\|media}[/{id}]` | JWT |
| GET / PUT | `/api/admin/settings/{company\|homepage\|seo}` | JWT |
| POST | `/api/admin/uploads` · `/api/admin/me/password` | JWT |
| GET | `/api/health` | public |

See **docs/DEPLOYMENT.md** for production setup and **docs/CONTENT-REVIEW.md** for the go-live checklist.
