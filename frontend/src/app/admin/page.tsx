'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Inbox, Sparkles, CalendarCheck, Package, Newspaper, ArrowRight } from 'lucide-react';
import { adminApi, type Lead } from '@/lib/adminApi';
import { StatusBadge } from '@/components/admin/StatusBadge';

type Dash = Awaited<ReturnType<typeof adminApi.dashboard>>;

export default function Dashboard() {
  const [d, setD] = useState<Dash | null>(null);
  useEffect(() => { adminApi.dashboard().then(setD).catch(() => setD(null)); }, []);
  const cards = d ? [
    { label: 'Total enquiries', value: d.totalLeads, icon: Inbox },
    { label: 'New (unactioned)', value: d.newLeads, icon: Sparkles },
    { label: 'Demo requests', value: d.demoRequests, icon: CalendarCheck },
    { label: 'Products', value: d.products, icon: Package },
    { label: 'Articles', value: d.articles, icon: Newspaper },
  ] : [];
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-sm text-navy-500">Website enquiries and content at a glance.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <c.icon className="h-5 w-5 text-teal-500" />
            <p className="mt-4 font-display text-3xl font-bold text-navy-900">{c.value}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-navy-400">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
          <h2 className="text-base font-semibold">Recent enquiries</h2>
          <Link href="/admin/leads" className="flex items-center gap-1 text-sm font-semibold text-teal-600">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {(d?.recent ?? []).map((l: Lead) => (
              <tr key={l.id} className="border-b border-navy-50 last:border-0">
                <td className="px-6 py-3"><p className="font-medium text-navy-900">{l.name}</p><p className="text-xs text-navy-400">{l.organisation}</p></td>
                <td className="hidden px-6 py-3 text-navy-600 md:table-cell">{l.productInterest || '—'}</td>
                <td className="px-6 py-3"><StatusBadge status={l.status} /></td>
                <td className="hidden px-6 py-3 text-right text-xs text-navy-400 sm:table-cell">{new Date(l.createdAt).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
