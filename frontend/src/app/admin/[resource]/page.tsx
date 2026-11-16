'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search, Check } from 'lucide-react';
import { adminApi, type ResourceKey } from '@/lib/adminApi';
import { resources } from '@/components/admin/config';
import FieldInput from '@/components/admin/FieldInput';

type Row = Record<string, unknown>;

export default function ResourcePage() {
  const { resource } = useParams<{ resource: string }>();
  const cfg = resources[resource as ResourceKey];
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<Row | null>(null);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { if (cfg) setRows(await adminApi.list(cfg.key)); }, [cfg]);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => rows.filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [rows, q]);

  if (!cfg) return <p className="text-navy-500">Unknown section.</p>;

  const onSave = async () => {
    if (!edit) return;
    const missing = cfg.fields.filter((f) => f.required && !edit[f.name]);
    if (missing.length) { setErr(`Please fill: ${missing.map((m) => m.label).join(', ')}`); return; }
    setSaving(true); setErr('');
    try { await adminApi.save(cfg.key, edit); setEdit(null); await load(); } catch (e) { setErr((e as Error).message); } finally { setSaving(false); }
  };

  const onDelete = async (r: Row) => {
    if (!confirm(`Delete this ${cfg.singular.toLowerCase()}? This cannot be undone.`)) return;
    await adminApi.remove(cfg.key, Number(r.id)); await load();
  };

  const cell = (v: unknown) => typeof v === 'boolean' ? (v ? <Check className="h-4 w-4 text-teal-500" /> : <span className="text-navy-300">—</span>) : <span className="line-clamp-1">{String(v ?? '—')}</span>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold">{cfg.title}</h1><p className="text-sm text-navy-500">{rows.length} item{rows.length === 1 ? '' : 's'} · changes appear on the website within 5 minutes.</p></div>
        <button className="btn-primary" onClick={() => setEdit({ published: true })}><Plus className="h-4 w-4" />Add {cfg.singular}</button>
      </div>
      <div className="card p-4"><label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" /><input className="input pl-9" placeholder={`Search ${cfg.title.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} /></label></div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400"><tr>{cfg.columns.map((c) => <th key={c} className="px-5 py-3">{c}</th>)}<th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={String(r.id)} className="border-t border-navy-50 hover:bg-navy-50/40">
                {cfg.columns.map((c, i) => <td key={c} className={`max-w-xs px-5 py-3 ${i === 0 ? 'font-medium text-navy-900' : 'text-navy-600'}`}>{cell(r[c])}</td>)}
                <td className="whitespace-nowrap px-5 py-3 text-right">
                  <button className="rounded-lg p-2 text-navy-500 hover:bg-teal-50 hover:text-teal-600" onClick={() => setEdit({ ...r })} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button className="rounded-lg p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(r)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={cfg.columns.length + 1} className="px-5 py-16 text-center text-navy-400">Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/40" onClick={() => setEdit(null)}>
          <div className="flex h-full w-full max-w-3xl flex-col bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-navy-100 px-7 py-5"><h2 className="text-lg font-bold">{edit.id ? 'Edit' : 'Add'} {cfg.singular}</h2><button onClick={() => setEdit(null)} aria-label="Close"><X className="h-5 w-5" /></button></div>
            <div className="grid flex-1 gap-5 overflow-y-auto px-7 py-6 sm:grid-cols-2">
              {cfg.fields.map((f) => <FieldInput key={f.name} f={f} value={edit[f.name]} onChange={(v) => setEdit((s) => ({ ...s!, [f.name]: v }))} />)}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-navy-100 px-7 py-4">
              <p className="text-sm text-red-600">{err}</p>
              <div className="flex gap-2"><button className="btn-outline" onClick={() => setEdit(null)}>Cancel</button><button className="btn-primary" onClick={onSave} disabled={saving}><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
