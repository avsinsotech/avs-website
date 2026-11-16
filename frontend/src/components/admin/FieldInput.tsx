'use client';
import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import type { Field } from './config';

export default function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  const [busy, setBusy] = useState(false);
  const id = `f-${f.name}`;
  const str = value == null ? '' : Array.isArray(value) ? value.join('\n') : String(value);
  let input: React.ReactNode;
  switch (f.type) {
    case 'textarea': input = <textarea id={id} rows={3} className="input" value={str} onChange={(e) => onChange(e.target.value)} />; break;
    case 'lines': input = <textarea id={id} rows={5} className="input font-mono text-[13px]" value={str} onChange={(e) => onChange(e.target.value)} />; break;
    case 'richtext': input = <textarea id={id} rows={14} className="input font-mono text-[13px]" value={str} onChange={(e) => onChange(e.target.value)} placeholder="Write in Markdown or HTML" />; break;
    case 'number': input = <input id={id} type="number" className="input" value={str} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />; break;
    case 'date': input = <input id={id} type="date" className="input" value={str.slice(0, 10)} onChange={(e) => onChange(e.target.value)} />; break;
    case 'select': input = <select id={id} className="input" value={str} onChange={(e) => onChange(e.target.value)}><option value="">Select…</option>{f.options?.map((o) => <option key={o}>{o}</option>)}</select>; break;
    case 'checkbox': return (
      <label className="flex items-center gap-3 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 accent-teal-500" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{f.label}</label>
    );
    case 'image': case 'file': input = (
      <div className="flex items-center gap-3">
        {f.type === 'image' && str && /* eslint-disable-next-line @next/next/no-img-element */ <img src={str} alt="" className="h-12 w-16 rounded-lg border border-navy-100 object-cover" />}
        <input id={id} className="input flex-1" value={str} onChange={(e) => onChange(e.target.value)} placeholder="URL or upload" />
        <label className="btn-outline cursor-pointer px-4 py-2.5">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Upload
          <input type="file" className="hidden" accept={f.type === 'image' ? 'image/*' : '.pdf,image/*,.mp4'} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setBusy(true); try { onChange(await adminApi.upload(file)); } finally { setBusy(false); } }} />
        </label>
      </div>
    ); break;
    default: input = <input id={id} className="input" value={str} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div className={f.col === 'full' ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="label">{f.label}{f.required && ' *'}</label>
      {input}
      {f.help && <p className="mt-1 text-xs text-navy-400">{f.help}</p>}
    </div>
  );
}
