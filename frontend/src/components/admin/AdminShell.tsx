'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Inbox, Package, FolderTree, Layers, Newspaper, HelpCircle, Image as ImageIcon, Home, Building2, Search, LogOut, Menu, ExternalLink, MessageSquare } from 'lucide-react';
import { auth, isDemo, adminApi } from '@/lib/adminApi';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Enquiries & Demos', icon: Inbox },
  { section: 'Banking Automation' },
  { href: '/admin/whatsapp', label: 'WhatsApp Automation', icon: MessageSquare },
  { section: 'Content' },
  { href: '/admin/settings/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/settings/company', label: 'Company & Contact', icon: Building2 },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Product Categories', icon: FolderTree },
  { href: '/admin/solutions', label: 'Solutions', icon: Layers },
  { href: '/admin/articles', label: 'Blogs & Articles', icon: Newspaper },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/media', label: 'Images & Brochures', icon: ImageIcon },
  { section: 'Settings' },
  { href: '/admin/settings/seo', label: 'SEO Settings', icon: Search },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!isLogin && !auth.token) router.replace('/admin/login');
    else setReady(true);
  }, [isLogin, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (isLogin) return <>{children}</>;
  if (!ready) return <div className="flex min-h-screen items-center justify-center text-sm text-navy-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-navy-50/70">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy-950 text-navy-200 transition lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <span className="rounded-lg bg-white p-1.5"><Image src="/images/avs-logo.png" alt="AVS" width={784} height={463} className="h-8 w-auto" /></span>
          <div><p className="font-display text-sm font-semibold text-white">AVS Admin</p><p className="text-[11px] text-navy-300">Website CMS</p></div>
        </div>
        <nav className="space-y-0.5 overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {nav.map((n, i) => 'section' in n ? (
            <p key={i} className="px-3 pb-1 pt-5 text-[10px] font-bold uppercase tracking-widest text-navy-400">{n.section}</p>
          ) : (
            <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${pathname === n.href ? 'bg-teal-500 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
              <n.icon className="h-4 w-4" />{n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-3">
          <button onClick={() => { auth.clear(); router.replace('/admin/login'); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-navy-950/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-navy-100 bg-white/90 px-5 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                Demo mode – data stored in this browser. <button className="underline" onClick={() => { adminApi.resetDemo(); location.reload(); }}>Reset</button>
              </span>
            )}
          </div>
          <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-teal-600">View website <ExternalLink className="h-3.5 w-3.5" /></Link>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
