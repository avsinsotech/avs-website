'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { adminApi, isDemo } from '@/lib/adminApi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await adminApi.login(email, password); router.replace('/admin'); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 p-5">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/30 blur-[120px]" />
      <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-lift sm:p-10">
        <Image src="/images/avs-logo.png" alt="AVS In-so-Tech Pvt. Ltd." width={784} height={463} className="mx-auto h-20 w-auto" priority />
        <h1 className="mt-6 text-center text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-center text-sm text-navy-500">Manage website content and enquiries</p>
        {isDemo && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Demo mode (API not configured): any email and a password of 4+ characters will sign in.</p>}
        <div className="mt-6 space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></div>
          <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></div>
        </div>
        {err && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="btn-primary mt-6 w-full py-3.5">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}Sign in</button>
      </form>
    </div>
  );
}
