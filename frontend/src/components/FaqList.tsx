'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
      {items.map((f, i) => (
        <div key={f.q}>
          <button className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span className="font-semibold text-navy-900">{f.q}</span>
            <Plus className={`h-5 w-5 shrink-0 text-teal-500 transition ${open === i ? 'rotate-45' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden"><p className="px-6 pb-5 text-sm leading-relaxed text-navy-600">{f.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
