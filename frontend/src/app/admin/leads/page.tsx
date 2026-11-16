'use client';
import { useCallback, useEffect, useState } from 'react';
import { Download, Search, X, Mail, Phone, MessageCircle } from 'lucide-react';
import { adminApi, type Lead } from '@/lib/adminApi';
import { StatusBadge } from '@/components/admin/StatusBadge';

const statuses: Lead['status'][] = ['New', 'Contacted', 'Demo Scheduled', 'Qualified', 'Closed'];
const types = [{ v: '', l: 'All forms' }, { v: 'demo', l: 'Demo requests' }, { v: 'product', l: 'Product enquiries' }, { v: 'contact', l: 'Contact form' }];

export default function LeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [formType, setFormType] = useState('');
  const [sel, setSel] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => { setLoading(true); setItems(await adminApi.leads({ q, status, formType })); setLoading(false); }, [q, status, formType]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const update = async (patch: Partial<Lead>) => {
    if (!sel) return;
    await adminApi.updateLead(sel.id, patch);
    const next = { ...sel, ...patch } as Lead; setSel(next); setItems((xs) => xs.map((x) => (x.id === next.id ? next : x)));
  };

  const exportCsv = async () => {
    const csv = await adminApi.exportLeadsCsv();
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `avs-enquiries-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Enquiries & Demo Requests</h1><p className="text-sm text-navy-500">Every website form submission is stored here and emailed to the sales inbox.</p></div>
        <button onClick={exportCsv} className="btn-outline"><Download className="h-4 w-4" />Export CSV</button>
      </div>
      <div className="card flex flex-wrap gap-3 p-4">
        <label className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" /><input className="input pl-9" placeholder="Search name, organisation, email, mobile" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <select className="input w-auto" value={formType} onChange={(e) => setFormType(e.target.value)}>{types.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
            <tr><th className="px-5 py-3">Received</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Institution</th><th className="px-5 py-3">Product</th><th className="px-5 py-3">Form</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} onClick={() => setSel(l)} className="cursor-pointer border-t border-navy-50 hover:bg-teal-50/40">
                <td className="whitespace-nowrap px-5 py-3 text-xs text-navy-500">{new Date(l.createdAt).toLocaleString('en-IN')}</td>
                <td className="px-5 py-3"><p className="font-medium text-navy-900">{l.name}</p><p className="text-xs text-navy-400">{l.designation}</p></td>
                <td className="px-5 py-3"><p>{l.organisation}</p><p className="text-xs text-navy-400">{l.institutionType}</p></td>
                <td className="px-5 py-3 text-navy-600">{l.productInterest || '—'}</td>
                <td className="px-5 py-3 capitalize text-navy-600">{l.formType}</td>
                <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={6} className="px-5 py-16 text-center text-navy-400">No enquiries found.</td></tr>}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/40" onClick={() => setSel(null)}>
          <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-7 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">{sel.name}</h2><p className="text-sm text-navy-500">{sel.designation}, {sel.organisation}</p></div><button onClick={() => setSel(null)} aria-label="Close"><X className="h-5 w-5" /></button></div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`tel:${sel.mobile}`} className="btn-outline px-4 py-2"><Phone className="h-4 w-4" />Call</a>
              <a href={`mailto:${sel.email}`} className="btn-outline px-4 py-2"><Mail className="h-4 w-4" />Email</a>
              <a href={`https://wa.me/91${sel.mobile.replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-4 py-2"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {[['Mobile', sel.mobile], ['Email', sel.email], ['Institution type', sel.institutionType], ['Product', sel.productInterest || '—'], ['Form', sel.formType], ['Source page', sel.sourcePage || '—'], ['Received', new Date(sel.createdAt).toLocaleString('en-IN')]].map(([k, v]) => (
                <div key={k}><dt className="text-xs uppercase tracking-wide text-navy-400">{k}</dt><dd className="mt-0.5 break-words font-medium text-navy-800">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-6"><p className="label">Message</p><p className="whitespace-pre-wrap rounded-xl bg-navy-50 p-4 text-sm text-navy-700">{sel.message || '—'}</p></div>
            <div className="mt-6"><label className="label">Status</label><select className="input" value={sel.status} onChange={(e) => update({ status: e.target.value as Lead['status'] })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="mt-4"><label className="label">Internal notes</label><textarea className="input" rows={4} defaultValue={sel.notes} onBlur={(e) => update({ notes: e.target.value })} placeholder="Follow-up notes (saved when you click away)" /></div>
          </div>
        </div>
      )}
    </div>
  );
}
