'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { adminApi, type SettingsGroup } from '@/lib/adminApi';
import { settingsGroups } from '@/components/admin/config';
import FieldInput from '@/components/admin/FieldInput';

export default function SettingsPage() {
  const { group } = useParams<{ group: string }>();
  const cfg = settingsGroups[group as SettingsGroup];
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { if (cfg) adminApi.getSettings(group as SettingsGroup).then((v) => setValues(v || {})); }, [cfg, group]);
  if (!cfg) return <p>Unknown settings group.</p>;
  const save = async () => {
    setErr('');
    try { await adminApi.saveSettings(group as SettingsGroup, values); setSaved(true); setTimeout(() => setSaved(false), 2500); } catch (e) { setErr((e as Error).message); }
  };
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold">{cfg.title}</h1><p className="text-sm text-navy-500">Update without changing source code. Changes go live within 5 minutes.</p></div>
        <button onClick={save} className="btn-primary">{saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}{saved ? 'Saved' : 'Save changes'}</button>
      </div>
      {err && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{err}</p>}
      <div className="card grid gap-5 p-7 sm:grid-cols-2">
        {cfg.fields.map((f) => <FieldInput key={f.name} f={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />)}
      </div>
    </div>
  );
}
