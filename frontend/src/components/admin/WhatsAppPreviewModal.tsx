'use client';

import React, { useState } from 'react';
import { X, Send, CheckCheck, Phone, ShieldCheck, Copy, Check } from 'lucide-react';
import type { LoanSanctionEvent, KycDueEvent, KycNotExistEvent, LoanOverdueEvent } from '@/data/whatsappMock';

type AnyWhatsAppEvent = LoanSanctionEvent | KycDueEvent | KycNotExistEvent | LoanOverdueEvent;

interface Props {
  event: AnyWhatsAppEvent | null;
  onClose: () => void;
  onSimulateSend?: (id: string) => void;
}

export default function WhatsAppPreviewModal({ event, onClose, onSimulateSend }: Props) {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!event) return null;

  // Generate populated template text based on event type
  const renderMessageContent = () => {
    switch (event.eventType) {
      case 'LOAN_SANCTION': {
        const e = event as LoanSanctionEvent;
        const isGuarantor = e.recipientType === 'GUARANTOR';
        if (isGuarantor) {
          return (
            <>
              <p className="font-semibold text-gray-900">
                प्रिय {e.customerName.split(' ')[0]},
              </p>
              <p className="mt-2 text-gray-800">
                <span className="font-medium text-emerald-800">AVS Co-op Bank Ltd.</span> मधील <span className="font-medium">{e.borrowerName}</span> यांच्या कर्ज अर्जासाठी आपण जामीनदार म्हणून नोंद आहात.
              </p>
              <p className="mt-1 text-gray-800">
                आनंदाची बातमी! सदर कर्ज मंजुरी प्रक्रिया (Stage 103) पूर्ण झाली आहे.
              </p>
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-xs text-gray-800 space-y-1">
                <p>• <strong>कर्ज खाते क्र:</strong> {e.accountNo}</p>
                <p>• <strong>मंजुरी दिनांक:</strong> {e.sanctionDate}</p>
                <p>• <strong>मंजूर रक्कम:</strong> ₹{e.sanctionAmount.toLocaleString('en-IN')}</p>
                <p>• <strong>मुख्य कर्जदार:</strong> {e.borrowerName}</p>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                अधिक माहितीसाठी आपल्या जवळच्या शाखेशी संपर्क साधावा.
              </p>
            </>
          );
        }
        return (
          <>
            <p className="font-semibold text-gray-900">
              प्रिय {e.customerName.split(' ')[0]},
            </p>
            <p className="mt-2 text-gray-800">
              <span className="font-medium text-emerald-800">AVS Co-op Bank Ltd.</span> कडून आपले कर्ज मंजूर (Sanction) झाले आहे.
            </p>
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-xs text-gray-800 space-y-1">
              <p>• <strong>कर्ज खाते क्र:</strong> {e.accountNo}</p>
              <p>• <strong>योजना:</strong> {e.loanScheme}</p>
              <p>• <strong>मंजुरी दिनांक:</strong> {e.sanctionDate}</p>
              <p>• <strong>मंजूर रक्कम:</strong> ₹{e.sanctionAmount.toLocaleString('en-IN')}</p>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              अभिनंदन! पुढील वितरणासाठी शाखेशी संपर्क साधावा.
            </p>
          </>
        );
      }
      case 'KYC_DUE': {
        const e = event as KycDueEvent;
        return (
          <>
            <p className="font-semibold text-gray-900">
              प्रिय {e.customerName.split(' ')[0]},
            </p>
            <p className="mt-2 text-gray-800">
              <span className="font-medium text-emerald-800">AVS Co-op Bank Ltd.</span> मधील आपल्या खात्याचे KYC नूतनीकरण प्रलंबित आहे.
            </p>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-2.5 text-xs text-gray-800 space-y-1">
              <p>• <strong>खाते क्र:</strong> {e.accountNo}</p>
              <p>• <strong>अंतिम मुदत:</strong> <span className={e.daysRemaining < 0 ? 'text-red-600 font-bold' : 'font-semibold'}>{e.kycDueDate} ({e.daysRemaining < 0 ? 'मुदत संपली' : `${e.daysRemaining} दिवस बाकी`})</span></p>
              <p>• <strong>आवश्यक कागदपत्रे:</strong> {e.pendingDocuments.join(', ')}</p>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              कृपया सेवा अखंडित राहण्यासाठी वेळेत नजीकच्या शाखेत मूळ कागदपत्रांसह संपर्क साधावा.
            </p>
          </>
        );
      }
      case 'KYC_NOT_EXIST': {
        const e = event as KycNotExistEvent;
        return (
          <>
            <p className="font-semibold text-gray-900">
              प्रिय {e.customerName.split(' ')[0]},
            </p>
            <p className="mt-2 text-gray-800">
              <span className="font-medium text-emerald-800">AVS Co-op Bank Ltd.</span> रेकॉर्डनुसार आपल्या खात्यामध्ये आवश्यक ओळख कागदपत्र नोंद आढळली नाही.
            </p>
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50/60 p-2.5 text-xs text-gray-800 space-y-1">
              <p>• <strong>खाते क्र:</strong> {e.accountNo}</p>
              <p>• <strong>अनुपलब्ध कागदपत्र:</strong> <span className="font-bold text-red-600">{e.missingDocumentType}</span></p>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              कृपया आपले आधार / पॅन कार्ड तात्काळ शाखेत जमा करून खाते अद्ययावत करावे.
            </p>
          </>
        );
      }
      case 'LOAN_OVERDUE': {
        const e = event as LoanOverdueEvent;
        return (
          <>
            <p className="font-semibold text-gray-900">
              प्रिय {e.customerName.split(' ')[0]},
            </p>
            <p className="mt-2 text-gray-800">
              <span className="font-medium text-emerald-800">AVS Co-op Bank Ltd.</span> मधील आपल्या कर्ज खात्यावर थकीत (Overdue) रक्कम प्रलंबित आहे.
            </p>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-2.5 text-xs text-gray-800 space-y-1">
              <p>• <strong>कर्ज खाते क्र:</strong> {e.accountNo}</p>
              <p>• <strong>थकीत रक्कम:</strong> <span className="font-bold text-red-600">₹{e.overdueAmount.toLocaleString('en-IN')}</span></p>
              <p>• <strong>एकूण बाकी:</strong> ₹{e.totalOutstanding.toLocaleString('en-IN')}</p>
              <p>• <strong>दिनांक:</strong> {e.asOfDate} ({e.overdueDays} दिवस थकीत)</p>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              दंडात्मक व्याज टाळण्यासाठी त्वरित रक्कम भरावी. शाखा संपर्क: <span className="font-semibold text-emerald-700">{e.branchContact}</span>
            </p>
            {/* WhatsApp Interactive Quick Reply Buttons */}
            <div className="mt-4 border-t border-gray-200 pt-3 space-y-1.5">
              <p className="text-[11px] font-semibold text-gray-500 uppercase">Quick Reply Options:</p>
              <div className="grid gap-1.5 text-center text-xs">
                <button className="rounded-lg border border-emerald-600/30 bg-emerald-50 py-1.5 font-medium text-emerald-800 hover:bg-emerald-100">
                  📅 मी रक्कम भरणार आहे
                </button>
                <button className="rounded-lg border border-navy-200 bg-gray-50 py-1.5 font-medium text-gray-700 hover:bg-gray-100">
                  ✅ मी आधीच भरले आहे
                </button>
                <button className="rounded-lg border border-navy-200 bg-gray-50 py-1.5 font-medium text-gray-700 hover:bg-gray-100">
                  💬 चौकशी / मदत हवी आहे
                </button>
              </div>
            </div>
          </>
        );
      }
    }
  };

  const handleCopy = () => {
    // Generate text representation
    const text = `AVS Co-op Bank WhatsApp Alert\nAccount: ${event.accountNo}\nCustomer: ${event.customerName}\nMobile: ${event.mobile}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      if (onSimulateSend) onSimulateSend(event.id);
      setTimeout(() => setSentSuccess(false), 2500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Metadata & Controls Panel */}
        <div className="flex flex-1 flex-col justify-between border-b border-navy-100 p-6 md:border-b-0 md:border-r">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                Template Preview · Meta Approved
              </span>
              <button onClick={onClose} className="rounded-lg p-1 text-navy-400 hover:bg-navy-50 hover:text-navy-700 md:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-4 font-display text-xl font-bold text-navy-900">
              {event.eventType === 'LOAN_SANCTION' && 'Loan Sanction Alert (Stage 103)'}
              {event.eventType === 'KYC_DUE' && 'KYC Due Reminder'}
              {event.eventType === 'KYC_NOT_EXIST' && 'KYC Document Missing Alert'}
              {event.eventType === 'LOAN_OVERDUE' && 'Loan Overdue Notice (> ₹1)'}
            </h2>
            <p className="mt-1 text-xs text-navy-500">
              Generated by CBS Extraction Procedure for Branch {event.branchCode}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-navy-50/60 p-4 text-xs">
              <div>
                <dt className="text-navy-400">Customer Name</dt>
                <dd className="mt-0.5 font-medium text-navy-900">{event.customerName}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Account Number</dt>
                <dd className="mt-0.5 font-medium text-navy-900">{event.accountNo}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Mobile (Recipient)</dt>
                <dd className="mt-0.5 font-mono font-medium text-navy-900">{event.maskedMobile}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Branch</dt>
                <dd className="mt-0.5 font-medium text-navy-900">{event.branchName}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Queue Status</dt>
                <dd className="mt-0.5 font-semibold text-teal-700">{event.queueStatus}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Language</dt>
                <dd className="mt-0.5 font-medium text-navy-900">मराठी (Marathi) - In-App</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-xl border border-navy-100 p-3.5 text-xs text-navy-600">
              <p className="font-semibold text-navy-800">Compliance & Guardrail Rule:</p>
              <p className="mt-1 leading-relaxed text-navy-500">
                {event.eventType === 'LOAN_SANCTION' && 'Sanction message is informational. Linked guarantors receive customized text with borrower details.'}
                {event.eventType === 'KYC_DUE' && 'Insert-only rule applied. Does not resend until next reminder cycle.'}
                {event.eventType === 'KYC_NOT_EXIST' && 'Triggered if Aadhaar or PAN is absent from Document Master.'}
                {event.eventType === 'LOAN_OVERDUE' && 'Sent to borrower only. Updates existing queue if overdue amount changes on re-run.'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-4">
            <button 
              onClick={handleCopy} 
              className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="btn-outline px-4 py-2 text-xs">
                Close
              </button>
              <button 
                onClick={handleSend}
                disabled={isSending || sentSuccess}
                className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
              >
                <Send className="h-3.5 w-3.5" />
                {isSending ? 'Sending…' : sentSuccess ? 'Message Sent!' : 'Dispatch WhatsApp'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Realistic WhatsApp Mobile Mockup */}
        <div className="flex w-full items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-6 md:w-[380px]">
          <div className="relative w-full max-w-[320px] overflow-hidden rounded-[2.5rem] border-[8px] border-gray-900 bg-[#efeae2] shadow-2xl">
            {/* Phone Top Notch / Speaker */}
            <div className="absolute left-1/2 top-0 z-20 h-4 w-28 -translate-x-1/2 rounded-b-xl bg-gray-900" />

            {/* WhatsApp App Header */}
            <div className="flex items-center justify-between bg-[#075e54] px-3 pb-2.5 pt-6 text-white shadow">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold text-white text-xs">
                  AVS
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold leading-tight">AVS Co-op Bank</p>
                    <ShieldCheck className="h-3 w-3 text-teal-300 fill-teal-300" />
                  </div>
                  <p className="text-[10px] text-teal-100">Official Banking Account</p>
                </div>
              </div>
              <Phone className="h-4 w-4 text-white/80" />
            </div>

            {/* Chat Body */}
            <div className="min-h-[380px] p-3 text-sm space-y-3">
              {/* Security info disclaimer */}
              <div className="mx-auto max-w-[240px] rounded-md bg-[#ffeecd] px-2.5 py-1 text-center text-[10px] text-gray-700 shadow-sm">
                🔒 Messages to this chat are end-to-end encrypted.
              </div>

              {/* Message Bubble */}
              <div className="relative max-w-[92%] rounded-2xl rounded-tl-sm bg-white p-3.5 text-xs shadow-md">
                {renderMessageContent()}

                {/* Message Timestamp & Double Blue Ticks */}
                <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-gray-400">
                  <span>10:32 AM</span>
                  <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Chat Input Bar Mock */}
            <div className="flex items-center gap-2 border-t border-gray-200 bg-[#f0f2f5] p-2 text-xs text-gray-400">
              <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-gray-400">
                Reply message…
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00a884] text-white">
                <Send className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
