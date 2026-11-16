'use client';
// Admin API client.
// • When NEXT_PUBLIC_API_URL is set, every call goes to the ASP.NET Core API
//   with the JWT in the Authorization header.
// • When it is NOT set (local preview), a localStorage-backed DEMO store is used
//   so the dashboard can be reviewed before the backend is deployed.

import { API_URL } from './api';
import { products, type Product } from '@/data/products';
import { solutions, faqs, articles, productCategories, company, stats } from '@/data/site';

export type Lead = {
  id: number; formType: string; name: string; organisation: string; designation: string; mobile: string; email: string;
  institutionType: string; productInterest: string; message: string; status: 'New' | 'Contacted' | 'Demo Scheduled' | 'Qualified' | 'Closed'; notes?: string;
  sourcePage?: string; createdAt: string;
};

export type ResourceKey = 'products' | 'categories' | 'solutions' | 'articles' | 'faqs' | 'media';
export type SettingsGroup = 'company' | 'homepage' | 'seo';

const TOKEN_KEY = 'avs_admin_token';
export const isDemo = !API_URL;

export const auth = {
  get token() { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set(t: string) { try { sessionStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ } },
  clear() { try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } },
};

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (!(init.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`;
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401) { auth.clear(); if (typeof window !== 'undefined') window.location.href = '/admin/login'; throw new Error('Session expired'); }
  if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || `Request failed (${res.status})`); }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get('content-type') || '';
  return (ct.includes('json') ? res.json() : res.text()) as Promise<T>;
}

// ---------------- DEMO STORE ----------------
const DEMO_KEY = 'avs_admin_demo_v1';
type DemoDb = { leads: Lead[]; resources: Record<ResourceKey, Record<string, unknown>[]>; settings: Record<SettingsGroup, Record<string, unknown>> };

function seed(): DemoDb {
  const now = Date.now();
  const sampleLeads: Lead[] = [
    { id: 1, formType: 'demo', name: 'Sample Enquiry 1', organisation: 'Sample Urban Co-op Bank', designation: 'CEO', mobile: '9800000001', email: 'ceo@example.com', institutionType: 'Urban Co-operative Bank', productInterest: 'AVS CBS – Core Banking Solution', message: 'Please schedule a demo.', status: 'New', createdAt: new Date(now - 3600e3).toISOString(), sourcePage: '/request-demo' },
    { id: 2, formType: 'product', name: 'Sample Enquiry 2', organisation: 'Sample Credit Society', designation: 'Manager', mobile: '9800000002', email: 'manager@example.com', institutionType: 'Co-operative Credit Society', productInterest: 'Vasuli360° – AI Recovery & Calling', message: 'Pricing details required.', status: 'Contacted', createdAt: new Date(now - 86400e3).toISOString(), sourcePage: '/products/vasuli360-ai-recovery' },
    { id: 3, formType: 'contact', name: 'Sample Enquiry 3', organisation: 'Sample NBFC Ltd', designation: 'IT Head', mobile: '9800000003', email: 'it@example.com', institutionType: 'NBFC', productInterest: 'Swarna Pay – Gold Loan Management', message: '', status: 'Demo Scheduled', createdAt: new Date(now - 3 * 86400e3).toISOString(), sourcePage: '/contact' },
  ];
  return {
    leads: sampleLeads,
    resources: {
      products: products.map((p: Product, i) => ({ id: i + 1, ...p, features: p.features.join('\n'), benefits: p.benefits.join('\n'), modules: p.modules.join('\n'), workflow: p.workflow.join('\n'), published: true, sortOrder: i })),
      categories: productCategories.map((c, i) => ({ id: i + 1, ...c, sortOrder: i })),
      solutions: solutions.map((s, i) => ({ id: i + 1, ...s, outcomes: s.outcomes.join('\n'), sortOrder: i })),
      articles: articles.map((a, i) => ({ id: i + 1, ...a, body: '', published: true })),
      faqs: faqs.map((f, i) => ({ id: i + 1, question: f.q, answer: f.a, sortOrder: i, published: true })),
      media: [],
    },
    settings: {
      company: { ...company, address: company.address.full, businessHours: company.businessHours.map((b) => `${b.days}: ${b.hours}`).join('\n') },
      homepage: {
        heroHeadline: 'Transforming Co-operative Banking Through Technology, Digital Innovation & AI.',
        heroSubheadline: 'AVS InSoTech empowers Co-operative Banks, Credit Societies, DCCBs and NBFCs with integrated Core Banking, Digital Banking, Regulatory Compliance and AI-powered solutions.',
        statClients: stats[0].value, statCustomersLakh: stats[1].value, statProfessionals: stats[2].value, statProducts: stats[3].value, established: stats[4].value,
        ctaTitle: 'Ready to Digitally Transform Your Financial Institution?',
      },
      seo: { defaultTitle: 'AVS InSoTech | Core Banking Software for Co-operative Banks & Credit Societies', defaultDescription: '', gaMeasurementId: '', gscVerification: '', keywords: 'Core Banking Software for Co-operative Banks, Credit Society Software, CBS Software Maharashtra' },
    },
  };
}
function db(): DemoDb {
  try { const raw = localStorage.getItem(DEMO_KEY); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  const s = seed(); save(s); return s;
}
function save(d: DemoDb) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(d)); } catch { /* ignore */ } }
const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));

// ---------------- PUBLIC ADMIN API ----------------
export const adminApi = {
  async login(email: string, password: string) {
    if (isDemo) { await wait(); if (!email || password.length < 4) throw new Error('Invalid credentials'); auth.set('demo-token'); return { name: 'Demo Admin', email }; }
    const r = await http<{ token: string; user: { name: string; email: string } }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    auth.set(r.token); return r.user;
  },

  async dashboard() {
    if (isDemo) {
      await wait(); const d = db();
      const by = (s: string) => d.leads.filter((l) => l.status === s).length;
      return { totalLeads: d.leads.length, newLeads: by('New'), demoRequests: d.leads.filter((l) => l.formType === 'demo').length, products: d.resources.products.length, articles: d.resources.articles.length, recent: d.leads.slice(0, 5) };
    }
    return http<{ totalLeads: number; newLeads: number; demoRequests: number; products: number; articles: number; recent: Lead[] }>('/api/admin/dashboard');
  },

  async leads(filter: { q?: string; status?: string; formType?: string } = {}) {
    if (isDemo) {
      await wait(); const q = (filter.q || '').toLowerCase();
      return db().leads.filter((l) => (!filter.status || l.status === filter.status) && (!filter.formType || l.formType === filter.formType) && (!q || `${l.name} ${l.organisation} ${l.email} ${l.mobile}`.toLowerCase().includes(q)))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    const p = new URLSearchParams(Object.entries(filter).filter(([, v]) => v) as [string, string][]);
    const r = await http<{ items: Lead[] }>(`/api/admin/leads?${p}`);
    return r.items;
  },

  async updateLead(id: number, patch: Partial<Pick<Lead, 'status' | 'notes'>>) {
    if (isDemo) { const d = db(); d.leads = d.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)); save(d); return; }
    await http(`/api/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
  },

  async exportLeadsCsv(): Promise<string> {
    if (isDemo) {
      const rows = db().leads; const cols: (keyof Lead)[] = ['id', 'createdAt', 'formType', 'status', 'name', 'organisation', 'designation', 'mobile', 'email', 'institutionType', 'productInterest', 'message', 'sourcePage'];
      const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
    }
    return http<string>('/api/admin/leads/export');
  },

  async list(resource: ResourceKey) {
    if (isDemo) { await wait(); return db().resources[resource]; }
    return http<Record<string, unknown>[]>(`/api/admin/${resource}`);
  },

  async save(resource: ResourceKey, item: Record<string, unknown>) {
    if (isDemo) {
      const d = db(); const list = d.resources[resource];
      if (item.id) d.resources[resource] = list.map((x) => (x.id === item.id ? item : x));
      else d.resources[resource] = [...list, { ...item, id: Math.max(0, ...list.map((x) => Number(x.id))) + 1 }];
      save(d); return;
    }
    if (item.id) await http(`/api/admin/${resource}/${item.id}`, { method: 'PUT', body: JSON.stringify(item) });
    else await http(`/api/admin/${resource}`, { method: 'POST', body: JSON.stringify(item) });
  },

  async remove(resource: ResourceKey, id: number) {
    if (isDemo) { const d = db(); d.resources[resource] = d.resources[resource].filter((x) => x.id !== id); save(d); return; }
    await http(`/api/admin/${resource}/${id}`, { method: 'DELETE' });
  },

  async getSettings(group: SettingsGroup) {
    if (isDemo) { await wait(); return db().settings[group]; }
    return http<Record<string, unknown>>(`/api/admin/settings/${group}`);
  },

  async saveSettings(group: SettingsGroup, values: Record<string, unknown>) {
    if (isDemo) { const d = db(); d.settings[group] = values; save(d); return; }
    await http(`/api/admin/settings/${group}`, { method: 'PUT', body: JSON.stringify(values) });
  },

  async upload(file: File): Promise<string> {
    if (isDemo) { await wait(); return URL.createObjectURL(file); }
    const fd = new FormData(); fd.append('file', file);
    const r = await http<{ url: string }>('/api/admin/uploads', { method: 'POST', body: fd });
    return r.url;
  },

  resetDemo() { if (isDemo) { localStorage.removeItem(DEMO_KEY); } },
};
