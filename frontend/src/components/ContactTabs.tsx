'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LeadForm from './LeadForm';

const tabs = [
  { key: 'contact', label: 'Contact Form' },
  { key: 'demo', label: 'Request a Demo' },
  { key: 'product', label: 'Product Enquiry' },
] as const;

export default function ContactTabs({ productOptions }: { productOptions: string[] }) {
  const params = useSearchParams();
  const preset = params.get('product') ?? '';
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>(preset ? 'product' : (params.get('form') as 'demo') || 'contact');
  return (
    <div>
      <div className="mb-8 inline-flex flex-wrap gap-1 rounded-full bg-navy-50 p-1" role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t.key ? 'bg-white text-teal-700 shadow-card' : 'text-navy-500 hover:text-navy-800'}`}>{t.label}</button>
        ))}
      </div>
      <LeadForm key={tab} formType={tab} productOptions={productOptions} defaultProduct={preset} />
    </div>
  );
}
