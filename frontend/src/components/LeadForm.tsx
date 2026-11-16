'use client';

import { useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { submitLead, type LeadPayload } from '@/lib/api';

const institutionTypes = [
  'Co-operative Credit Society',
  'Urban Co-operative Bank',
  'District Central Co-operative Bank',
  'State Co-operative Bank',
  'NBFC',
  'Co-operative Federation',
  'Other',
];

type Props = {
  formType: LeadPayload['formType'];
  productOptions: string[];
  defaultProduct?: string;
  submitLabel?: string;
  dark?: boolean;
};

type Errors = Partial<Record<keyof LeadPayload, string>>;

export default function LeadForm({ formType, productOptions, defaultProduct = '', submitLabel, dark = false }: Props) {
  const pathname = usePathname();
  const startedAt = useRef<number>(Date.now());
  const [values, setValues] = useState<LeadPayload>({
    formType, name: '', organisation: '', designation: '', mobile: '', email: '',
    institutionType: '', productInterest: defaultProduct, message: '', consent: false, website: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  const label = submitLabel ?? (formType === 'demo' ? 'Request a Demo' : formType === 'product' ? 'Send Product Enquiry' : 'Send Message');

  const set = (k: keyof LeadPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = (v: LeadPayload): Errors => {
    const er: Errors = {};
    if (v.name.trim().length < 2) er.name = 'Please enter your full name.';
    if (v.organisation.trim().length < 2) er.organisation = 'Please enter your organisation.';
    if (v.designation.trim().length < 2) er.designation = 'Please enter your designation.';
    const mobile = v.mobile.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '');
    if (!/^[6-9]\d{9}$/.test(mobile)) er.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) er.email = 'Enter a valid email address.';
    if (!v.institutionType) er.institutionType = 'Please select your institution type.';
    if (formType !== 'contact' && !v.productInterest) er.productInterest = 'Please select a product.';
    if (v.message.length > 2000) er.message = 'Message is too long (max 2000 characters).';
    if (!v.consent) er.consent = 'Please provide consent so we can contact you.';
    return er;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate(values);
    setErrors(er);
    if (Object.keys(er).length) return;
    // Basic bot protection: honeypot must be empty and form must take > 3 s.
    if (values.website || Date.now() - startedAt.current < 3000) {
      setStatus('done');
      setServerMsg('Thank you! Our team will contact you shortly.');
      return;
    }
    setStatus('sending');
    const res = await submitLead({ ...values, sourcePage: pathname });
    setServerMsg(res.message);
    setStatus(res.ok ? 'done' : 'error');
  };

  const inputCls = useMemo(() => (dark ? 'input border-white/10 bg-white/5 text-white placeholder:text-white/40' : 'input'), [dark]);
  const labelCls = dark ? 'label text-navy-200' : 'label';

  if (status === 'done') {
    return (
      <div className={`flex flex-col items-center rounded-2xl p-10 text-center ${dark ? 'bg-white/5 text-white' : 'bg-teal-50'}`}>
        <CheckCircle2 className="h-12 w-12 text-teal-500" />
        <p className={`mt-4 font-display text-xl font-semibold ${dark ? 'text-white' : 'text-navy-900'}`}>Enquiry received</p>
        <p className={`mt-2 max-w-sm text-sm ${dark ? 'text-navy-200' : 'text-navy-600'}`}>{serverMsg}</p>
      </div>
    );
  }

  const Field = ({ k, label, children }: { k: keyof LeadPayload; label: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={`${formType}-${k}`} className={labelCls}>{label}</label>
      {children}
      {errors[k] && <p className="mt-1 text-xs text-red-500" role="alert">{errors[k]}</p>}
    </div>
  );

  const id = (k: string) => `${formType}-${k}`;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {Field({ k: 'name', label: 'Full Name *', children: <input id={id('name')} className={inputCls} value={values.name} onChange={set('name')} autoComplete="name" maxLength={100} /> })}
      {Field({ k: 'organisation', label: 'Organisation *', children: <input id={id('organisation')} className={inputCls} value={values.organisation} onChange={set('organisation')} autoComplete="organization" maxLength={150} /> })}
      {Field({ k: 'designation', label: 'Designation *', children: <input id={id('designation')} className={inputCls} value={values.designation} onChange={set('designation')} autoComplete="organization-title" maxLength={100} /> })}
      {Field({ k: 'mobile', label: 'Mobile Number *', children: <input id={id('mobile')} className={inputCls} value={values.mobile} onChange={set('mobile')} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" maxLength={15} /> })}
      {Field({ k: 'email', label: 'Email *', children: <input id={id('email')} type="email" className={inputCls} value={values.email} onChange={set('email')} autoComplete="email" maxLength={150} /> })}
      {Field({
        k: 'institutionType', label: 'Institution Type *', children: (
          <select id={id('institutionType')} className={inputCls} value={values.institutionType} onChange={set('institutionType')}>
            <option value="">Select…</option>
            {institutionTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        ),
      })}
      <div className="sm:col-span-2">
        {Field({
          k: 'productInterest', label: formType === 'contact' ? 'Product Interested In' : 'Product Interested In *', children: (
            <select id={id('productInterest')} className={inputCls} value={values.productInterest} onChange={set('productInterest')}>
              <option value="">Select a product…</option>
              <option>Complete Banking Ecosystem / Multiple Products</option>
              {productOptions.map((p) => <option key={p}>{p}</option>)}
            </select>
          ),
        })}
      </div>
      <div className="sm:col-span-2">
        {Field({ k: 'message', label: 'Message', children: <textarea id={id('message')} rows={4} className={inputCls} value={values.message} onChange={set('message')} maxLength={2000} placeholder="Tell us about your institution and requirements" /> })}
      </div>
      {/* Honeypot – hidden from humans */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>
      </div>
      <div className="sm:col-span-2">
        <label className={`flex items-start gap-3 text-xs leading-relaxed ${dark ? 'text-navy-200' : 'text-navy-600'}`}>
          <input type="checkbox" checked={values.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 rounded border-navy-200 accent-teal-500" />
          <span>I consent to AVS InSoTech Pvt. Ltd. storing my details and contacting me by phone, email or WhatsApp regarding this enquiry. My data will be used only for this purpose, as described in the <a href="/privacy-policy" className="underline hover:text-teal-500">Privacy Policy</a>.</span>
        </label>
        {errors.consent && <p className="mt-1 text-xs text-red-500" role="alert">{errors.consent}</p>}
      </div>
      {status === 'error' && <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{serverMsg}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-3.5 disabled:opacity-60 sm:w-auto">
          {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {status === 'sending' ? 'Sending…' : label}
        </button>
      </div>
    </form>
  );
}
