'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';

type Item = { slug: string; name: string; tagline: string; category: string; icon: React.ReactNode; featured?: boolean };
type Cat = { key: string; name: string };

export default function ProductCatalog({ items, categories }: { items: Item[]; categories: Cat[] }) {
  const params = useSearchParams();
  const [cat, setCat] = useState<string>('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    const c = params.get('category');
    if (c && categories.some((x) => x.key === c)) setCat(c);
  }, [params, categories]);

  const list = useMemo(() => items.filter((p) => (cat === 'all' || p.category === cat) && (q === '' || `${p.name} ${p.tagline}`.toLowerCase().includes(q.toLowerCase()))), [items, cat, q]);

  return (
    <div>
      <div className="sticky top-[76px] z-20 -mx-5 border-b border-navy-100 bg-white/90 px-5 py-4 backdrop-blur-xl lg:mx-0 lg:rounded-2xl lg:border lg:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0" role="tablist">
            {[{ key: 'all', name: 'All Products' }, ...categories].map((c) => (
              <button key={c.key} role="tab" aria-selected={cat === c.key} onClick={() => setCat(c.key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${cat === c.key ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}`}>
                {c.name}
              </button>
            ))}
          </div>
          <label className="relative block lg:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="input rounded-full py-2.5 pl-10" aria-label="Search products" />
          </label>
        </div>
      </div>

      <p className="mt-8 text-sm text-navy-400">{list.length} product{list.length === 1 ? '' : 's'}</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="group card relative flex flex-col p-6 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lift animate-fade-up [animation-duration:.4s]">
            {p.featured && <span className="absolute right-4 top-4 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700">Featured</span>}
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white">{p.icon}</span>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-navy-400">{categories.find((c) => c.key === p.category)?.name}</p>
            <h3 className="mt-1 text-base font-semibold leading-snug">{p.name}</h3>
            <p className="mt-2 flex-1 text-sm text-navy-500">{p.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600">Details <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </div>
      {list.length === 0 && <p className="py-20 text-center text-navy-400">No products match your search.</p>}
    </div>
  );
}
