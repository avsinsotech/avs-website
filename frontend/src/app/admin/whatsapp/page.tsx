'use client';

import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, Send, CheckCircle2, Clock, AlertTriangle, 
  Search, Eye, RefreshCw, AlertCircle, Users, FileText, 
  ShieldAlert, BadgePercent, ChevronRight, MessageCircle, 
  UserCheck, Download, Filter
} from 'lucide-react';
import { 
  mockMetrics, mockLoanSanctions, mockKycDue, 
  mockKycNotExist, mockLoanOverdue, type LoanSanctionEvent, 
  type KycDueEvent, type KycNotExistEvent, type LoanOverdueEvent, 
  type QueueStatus 
} from '@/data/whatsappMock';
import WhatsAppPreviewModal from '@/components/admin/WhatsAppPreviewModal';

type ActiveTab = 'SANCTIONS' | 'KYC_DUE' | 'KYC_NOT_EXIST' | 'OVERDUE' | 'REPLIES';
type AnyEvent = LoanSanctionEvent | KycDueEvent | KycNotExistEvent | LoanOverdueEvent;

export default function WhatsAppAutomationPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('SANCTIONS');
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [previewEvent, setPreviewEvent] = useState<AnyEvent | null>(null);

  // Local state so Harsha can simulate actions in real-time
  const [sanctions, setSanctions] = useState(mockLoanSanctions);
  const [kycDueList, setKycDueList] = useState(mockKycDue);
  const [kycNotExistList, setKycNotExistList] = useState(mockKycNotExist);
  const [overdueList, setOverdueList] = useState(mockLoanOverdue);
  const [metrics, setMetrics] = useState(mockMetrics);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Simulate dispatching a single item
  const handleSimulateSend = (id: string) => {
    setSanctions(prev => prev.map(item => item.id === id ? { ...item, queueStatus: 'SENT', sentAt: 'Just now' } : item));
    setKycDueList(prev => prev.map(item => item.id === id ? { ...item, queueStatus: 'SENT', sentAt: 'Just now' } : item));
    setKycNotExistList(prev => prev.map(item => item.id === id ? { ...item, queueStatus: 'SENT', sentAt: 'Just now' } : item));
    setOverdueList(prev => prev.map(item => item.id === id ? { ...item, queueStatus: 'SENT', sentAt: 'Just now' } : item));
    
    setMetrics(m => ({
      ...m,
      sentToday: m.sentToday + 1,
      totalQueued: Math.max(0, m.totalQueued - 1),
    }));

    showNotification('WhatsApp message successfully dispatched via Meta Cloud API.');
  };

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'DELIVERED':
      case 'READ':
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-3 w-3" />{status}</span>;
      case 'SENT':
      case 'QUEUED':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"><Clock className="h-3 w-3" />{status}</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"><Clock className="h-3 w-3" />PENDING</span>;
      case 'FAILED':
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800"><AlertTriangle className="h-3 w-3" />FAILED</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">{status}</span>;
    }
  };

  // Filter helper
  const filterList = <T extends AnyEvent>(list: T[]): T[] => {
    return list.filter(item => {
      const matchSearch = !search || 
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.accountNo.toLowerCase().includes(search.toLowerCase()) ||
        item.mobile.includes(search);
      const matchBranch = selectedBranch === 'ALL' || item.branchCode === selectedBranch;
      const matchStatus = selectedStatus === 'ALL' || item.queueStatus === selectedStatus;
      return matchSearch && matchBranch && matchStatus;
    });
  };

  const filteredSanctions = useMemo(() => filterList(sanctions), [sanctions, search, selectedBranch, selectedStatus]);
  const filteredKycDue = useMemo(() => filterList(kycDueList), [kycDueList, search, selectedBranch, selectedStatus]);
  const filteredKycNotExist = useMemo(() => filterList(kycNotExistList), [kycNotExistList, search, selectedBranch, selectedStatus]);
  const filteredOverdue = useMemo(() => filterList(overdueList), [overdueList, search, selectedBranch, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold text-navy-950">
              WhatsApp Banking Automation
            </h1>
          </div>
          <p className="mt-1 text-sm text-navy-500">
            Automated event triggers for Loan Sanction (Stage 103), KYC Compliance, and Overdue Collections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Meta API Online · 99.8% SLA
          </span>
          <button 
            onClick={() => showNotification('Queue refreshed from CBS Stored Procedures.')}
            className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync with CBS
          </button>
        </div>
      </div>

      {notification && (
        <div className="rounded-xl border border-teal-300 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900 shadow-sm transition">
          ✅ {notification}
        </div>
      )}

      {/* 1. Top Metrics KPI Bar */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-400">Total In Queue</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-900">{metrics.totalQueued}</p>
          <p className="mt-0.5 text-[11px] text-teal-600">Pending dispatch</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-400">Sent Today</p>
          <p className="mt-1 font-display text-2xl font-bold text-blue-600">{metrics.sentToday}</p>
          <p className="mt-0.5 text-[11px] text-navy-400">Batched by worker</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-400">Delivered / Read</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{metrics.delivered}</p>
          <p className="mt-0.5 text-[11px] text-emerald-600">94% delivery rate</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-400">Failed / Invalid</p>
          <p className="mt-1 font-display text-2xl font-bold text-rose-600">{metrics.failed}</p>
          <p className="mt-0.5 text-[11px] text-rose-600">Action required</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-400">Pending Approval</p>
          <p className="mt-1 font-display text-2xl font-bold text-amber-600">{metrics.pendingApprovals}</p>
          <p className="mt-0.5 text-[11px] text-navy-400">Guardrail held</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-400">Customer Inbound</p>
          <p className="mt-1 font-display text-2xl font-bold text-purple-600">{metrics.inboundReplies}</p>
          <p className="mt-0.5 text-[11px] text-purple-600">Payment intents & queries</p>
        </div>
      </div>

      {/* 2. Search & Branch Filter Bar */}
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input 
              className="input pl-9 text-xs" 
              placeholder="Search by customer name, account number, or mobile..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-navy-500">Branch:</span>
            <select 
              className="input w-auto text-xs py-1.5"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="ALL">All Branches</option>
              <option value="1">Branch 1 (Mahape - Main)</option>
              <option value="2">Branch 2 (Vashi)</option>
              <option value="8">Branch 8 (Panvel)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-navy-500">Status:</span>
            <select 
              className="input w-auto text-xs py-1.5"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SENT">Sent</option>
              <option value="DELIVERED">Delivered</option>
              <option value="READ">Read</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => showNotification('Exporting currently filtered view to CSV…')}
          className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* 3. Event Tabs Navigation */}
      <div className="border-b border-navy-100">
        <nav className="-mb-px flex space-x-6 overflow-x-auto text-sm font-semibold">
          <button
            onClick={() => setActiveTab('SANCTIONS')}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 transition ${
              activeTab === 'SANCTIONS'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-navy-400 hover:border-navy-200 hover:text-navy-600'
            }`}
          >
            <Users className="h-4 w-4" />
            1. Loan Sanction (Stage 103)
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
              {filteredSanctions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('KYC_DUE')}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 transition ${
              activeTab === 'KYC_DUE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-navy-400 hover:border-navy-200 hover:text-navy-600'
            }`}
          >
            <FileText className="h-4 w-4" />
            2. KYC Due Reminders
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
              {filteredKycDue.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('KYC_NOT_EXIST')}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 transition ${
              activeTab === 'KYC_NOT_EXIST'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-navy-400 hover:border-navy-200 hover:text-navy-600'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            3. KYC Missing (Aadhaar / PAN)
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-800">
              {filteredKycNotExist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('OVERDUE')}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 transition ${
              activeTab === 'OVERDUE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-navy-400 hover:border-navy-200 hover:text-navy-600'
            }`}
          >
            <BadgePercent className="h-4 w-4" />
            4. Loan Overdue (&gt; ₹1)
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
              {filteredOverdue.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('REPLIES')}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 transition ${
              activeTab === 'REPLIES'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-navy-400 hover:border-navy-200 hover:text-navy-600'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            5. Inbound Customer Replies
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
              2 Active
            </span>
          </button>
        </nav>
      </div>

      {/* 4. Tab 1: Loan Sanction Content */}
      {activeTab === 'SANCTIONS' && (
        <div className="card overflow-hidden">
          <div className="border-b border-navy-50 bg-navy-50/40 px-5 py-3 text-xs text-navy-600">
            Showing records extracted via <strong>`ISP_WALoanSanction`</strong>. Triggered at final CBS Stage 103. Separate personalized alerts are generated for borrowers and each linked guarantor.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
                <tr>
                  <th className="px-5 py-3">Account & Sanction Date</th>
                  <th className="px-5 py-3">Borrower / Primary</th>
                  <th className="px-5 py-3">Sanction Amount</th>
                  <th className="px-5 py-3">Linked Guarantors</th>
                  <th className="px-5 py-3">Branch</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filteredSanctions.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-50/30">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-navy-900">{item.accountNo}</p>
                      <p className="text-xs text-navy-400">{item.sanctionDate} · Stage {item.stage}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy-900">{item.customerName}</p>
                      <p className="text-xs text-navy-400 font-mono">📱 {item.maskedMobile}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-700">
                      ₹{item.sanctionAmount.toLocaleString('en-IN')}
                      <p className="text-[11px] font-normal text-navy-400">{item.loanScheme}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {item.guarantors && item.guarantors.length > 0 ? (
                        <div className="space-y-1">
                          {item.guarantors.map((g, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs">
                              <span className="font-medium text-navy-800">{g.name}</span>
                              {g.mobile ? (
                                <span className="font-mono text-[10px] text-navy-400">({g.mobile.slice(0, 4)}...{g.mobile.slice(-2)})</span>
                              ) : (
                                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 flex items-center gap-0.5">
                                  <AlertCircle className="h-3 w-3" /> No Mobile
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-navy-300">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-navy-600">
                      Br {item.branchCode} ({item.branchName.split(' ')[0]})
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(item.queueStatus)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setPreviewEvent(item)}
                        className="btn-outline inline-flex items-center gap-1 px-3 py-1.5 text-xs text-navy-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Tab 2: KYC Due Reminders Content */}
      {activeTab === 'KYC_DUE' && (
        <div className="card overflow-hidden">
          <div className="border-b border-navy-50 bg-navy-50/40 px-5 py-3 text-xs text-navy-600">
            Extracted via <strong>`ISP_WA_KYC @Flag='All'`</strong>. Inserts once per KYC cycle. Never updates existing records silently.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
                <tr>
                  <th className="px-5 py-3">Account & Customer</th>
                  <th className="px-5 py-3">Mobile Number</th>
                  <th className="px-5 py-3">KYC Due Date</th>
                  <th className="px-5 py-3">Pending Documents</th>
                  <th className="px-5 py-3">Branch</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filteredKycDue.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-50/30">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-navy-900">{item.customerName}</p>
                      <p className="text-xs text-navy-400">{item.accountNo}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-700">
                      {item.maskedMobile}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-navy-900">{item.kycDueDate}</p>
                      <p className={`text-xs font-medium ${item.daysRemaining < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.daysRemaining < 0 ? `Overdue by ${Math.abs(item.daysRemaining)} days` : `${item.daysRemaining} days remaining`}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {item.pendingDocuments.map((doc, idx) => (
                          <span key={idx} className="rounded-md border border-navy-100 bg-navy-50 px-2 py-0.5 text-xs text-navy-700">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-navy-600">
                      Br {item.branchCode}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(item.queueStatus)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setPreviewEvent(item)}
                        className="btn-outline inline-flex items-center gap-1 px-3 py-1.5 text-xs text-navy-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: KYC Not Exist (Missing Documents) Content */}
      {activeTab === 'KYC_NOT_EXIST' && (
        <div className="card overflow-hidden">
          <div className="border-b border-navy-50 bg-navy-50/40 px-5 py-3 text-xs text-navy-600">
            Identifies customers whose mandatory <strong>Aadhaar</strong> and/or <strong>PAN</strong> entry is completely absent in CBS Document Master.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
                <tr>
                  <th className="px-5 py-3">Customer & Member ID</th>
                  <th className="px-5 py-3">Account No</th>
                  <th className="px-5 py-3">Missing Document Type</th>
                  <th className="px-5 py-3">Mobile Number</th>
                  <th className="px-5 py-3">Branch</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filteredKycNotExist.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-50/30">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-navy-900">{item.customerName}</p>
                      <p className="text-xs text-navy-400">{item.customerNo} · Joined {item.memberDate}</p>
                    </td>
                    <td className="px-5 py-3.5 text-navy-700 font-mono text-xs">
                      {item.accountNo}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {item.missingDocumentType} Missing
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-700">
                      {item.maskedMobile}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-navy-600">
                      Br {item.branchCode}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(item.queueStatus)}
                      {item.errorMessage && (
                        <p className="text-[10px] text-red-500 mt-0.5">{item.errorMessage}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setPreviewEvent(item)}
                        className="btn-outline inline-flex items-center gap-1 px-3 py-1.5 text-xs text-navy-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Loan Overdue Content */}
      {activeTab === 'OVERDUE' && (
        <div className="card overflow-hidden">
          <div className="border-b border-navy-50 bg-navy-50/40 px-5 py-3 text-xs text-navy-600">
            Extracted via <strong>`ISP_WA_AllLoanBalancesList @EDate='2026-09-30'`</strong>. Includes loan accounts with Overdue Amount &gt; ₹1.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
                <tr>
                  <th className="px-5 py-3">Loan Account & Borrower</th>
                  <th className="px-5 py-3">Overdue Amount</th>
                  <th className="px-5 py-3">Total Outstanding</th>
                  <th className="px-5 py-3">Overdue Ageing</th>
                  <th className="px-5 py-3">Inbound Reply</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filteredOverdue.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-50/30">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-navy-900">{item.customerName}</p>
                      <p className="text-xs text-navy-400">{item.accountNo} · 📱 {item.maskedMobile}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-rose-600">
                      ₹{item.overdueAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-navy-700">
                      ₹{item.totalOutstanding.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.overdueDays > 60 
                          ? 'bg-red-100 text-red-800' 
                          : item.overdueDays > 30 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.overdueDays} Days
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {item.inboundReply ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                          <MessageCircle className="h-3 w-3" />
                          {item.inboundReply.type === 'PAYMENT_INTENT' ? 'Will Pay' : 'Already Paid'}
                        </span>
                      ) : (
                        <span className="text-xs text-navy-300">No reply yet</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(item.queueStatus)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setPreviewEvent(item)}
                        className="btn-outline inline-flex items-center gap-1 px-3 py-1.5 text-xs text-navy-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Inbound Replies Desk */}
      {activeTab === 'REPLIES' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display text-base font-bold text-navy-900">
              Interactive Inbound Responses from Borrowers
            </h3>
            <p className="mt-1 text-xs text-navy-500">
              When customers click quick reply buttons or send text in WhatsApp, webhooks route their response here for staff action.
            </p>

            <div className="mt-5 space-y-3">
              {overdueList.filter(o => o.inboundReply).map((item) => (
                <div key={item.id} className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm hover:border-purple-200 transition">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                        {item.customerName[0]}
                      </span>
                      <div>
                        <p className="font-semibold text-sm text-navy-900">{item.customerName}</p>
                        <p className="text-xs text-navy-400">{item.accountNo} · {item.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                        {item.inboundReply?.type === 'PAYMENT_INTENT' ? '📅 Payment Intent' : '✅ Already Paid Claim'}
                      </span>
                      <span className="text-xs text-navy-400">
                        Received: {item.inboundReply?.receivedAt}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="rounded-xl bg-purple-50/60 p-3 text-xs text-purple-950 flex-1">
                      <p className="font-semibold text-purple-900">Customer Message / Reply:</p>
                      <p className="mt-1 italic">&ldquo;{item.inboundReply?.text}&rdquo;</p>
                      {item.inboundReply?.preferredDate && (
                        <p className="mt-1.5 font-medium text-emerald-800">
                          🎯 Promised Payment Date: {item.inboundReply.preferredDate}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={() => showNotification(`Assigned ${item.customerName} follow-up to Recovery Officer.`)}
                        className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-navy-600" />
                        Assign to Officer
                      </button>
                      <button 
                        onClick={() => showNotification(`Customer query for ${item.accountNo} marked resolved.`)}
                        className="btn-primary flex items-center gap-1.5 px-3 py-2 text-xs bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Preview Modal */}
      {previewEvent && (
        <WhatsAppPreviewModal 
          event={previewEvent} 
          onClose={() => setPreviewEvent(null)}
          onSimulateSend={handleSimulateSend}
        />
      )}
    </div>
  );
}
