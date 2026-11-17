// Mock dataset and types for AVS InSoTech WhatsApp Automation Portal (for Harsha - Frontend)
// Aligned with the CBS specification and extraction stored procedures:
// - ISP_WALoanSanction (Stage 103, Borrower + Linked Guarantors)
// - ISP_WA_KYC (KYC Due vs KYC Not Exist)
// - ISP_WA_AllLoanBalancesList (Loan Overdue > 1)

export type RecipientType = 'BORROWER' | 'GUARANTOR' | 'CUSTOMER';
export type QueueStatus = 'PENDING' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'SUPPRESSED';

export interface BaseEventItem {
  id: string;
  branchCode: string;
  branchName: string;
  accountNo: string;
  customerNo: string;
  customerName: string;
  mobile: string;
  maskedMobile: string;
  recipientType: RecipientType;
  queueStatus: QueueStatus;
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
  providerMessageId?: string;
}

export interface LoanSanctionEvent extends BaseEventItem {
  eventType: 'LOAN_SANCTION';
  sanctionAmount: number;
  sanctionDate: string;
  loanScheme: string; // e.g. Scheme 42 Gold Loan, Scheme 10 Personal Loan
  stage: number; // 103 = Final Sanction
  borrowerName: string;
  guarantors?: Array<{
    name: string;
    mobile?: string;
    status: QueueStatus;
  }>;
}

export interface KycDueEvent extends BaseEventItem {
  eventType: 'KYC_DUE';
  kycDueDate: string;
  daysRemaining: number;
  pendingDocuments: string[];
}

export interface KycNotExistEvent extends BaseEventItem {
  eventType: 'KYC_NOT_EXIST';
  missingDocumentType: 'Aadhaar Card' | 'PAN Card' | 'Both Aadhaar & PAN';
  memberDate: string;
}

export interface LoanOverdueEvent extends BaseEventItem {
  eventType: 'LOAN_OVERDUE';
  overdueAmount: number;
  totalOutstanding: number;
  asOfDate: string;
  overdueDays: number;
  schemeCode: string;
  branchContact: string;
  inboundReply?: {
    type: 'PAYMENT_INTENT' | 'ALREADY_PAID' | 'QUERY';
    text: string;
    receivedAt: string;
    preferredDate?: string;
    followUpStatus: 'NEW' | 'ASSIGNED' | 'RESOLVED';
  };
}

export interface WhatsAppMetrics {
  totalQueued: number;
  sentToday: number;
  delivered: number;
  failed: number;
  pendingApprovals: number;
  inboundReplies: number;
}

export const mockMetrics: WhatsAppMetrics = {
  totalQueued: 142,
  sentToday: 98,
  delivered: 92,
  failed: 4,
  pendingApprovals: 6,
  inboundReplies: 14,
};

export const mockLoanSanctions: LoanSanctionEvent[] = [
  {
    id: 'SAN-101',
    branchCode: '1',
    branchName: 'Main Branch (Mahape)',
    accountNo: 'TL-2026-0812',
    customerNo: 'CUST-8812',
    customerName: 'रमेश विष्णू पाटील (Ramesh Patil)',
    borrowerName: 'रमेश विष्णू पाटील',
    mobile: '9822012345',
    maskedMobile: '98XXXX2345',
    eventType: 'LOAN_SANCTION',
    recipientType: 'BORROWER',
    sanctionAmount: 500000,
    sanctionDate: '2026-08-12',
    loanScheme: 'मध्यम मुदत कर्ज (Scheme 42)',
    stage: 103,
    queueStatus: 'DELIVERED',
    createdAt: '2026-08-12 10:30',
    sentAt: '2026-08-12 10:32',
    deliveredAt: '2026-08-12 10:33',
    readAt: '2026-08-12 10:45',
    guarantors: [
      { name: 'सुरेश नामदेव जाधव', mobile: '9822055667', status: 'DELIVERED' },
      { name: 'गणेश कृष्णा शिंदे', mobile: '', status: 'FAILED' }, // Missing mobile trigger
    ],
  },
  {
    id: 'SAN-102',
    branchCode: '1',
    branchName: 'Main Branch (Mahape)',
    accountNo: 'GL-2026-0941',
    customerNo: 'CUST-9104',
    customerName: 'सुनिता मनोहर देशमुख (Sunita Deshmukh)',
    borrowerName: 'सुनिता मनोहर देशमुख',
    mobile: '9890145678',
    maskedMobile: '98XXXX5678',
    eventType: 'LOAN_SANCTION',
    recipientType: 'BORROWER',
    sanctionAmount: 175000,
    sanctionDate: '2026-08-13',
    loanScheme: 'स्वर्ण कर्ज - Gold Loan (Scheme 42)',
    stage: 103,
    queueStatus: 'READ',
    createdAt: '2026-08-13 11:15',
    sentAt: '2026-08-13 11:16',
    deliveredAt: '2026-08-13 11:17',
    readAt: '2026-08-13 11:20',
    guarantors: [
      { name: 'मनोहर यशवंत देशमुख', mobile: '9890199887', status: 'DELIVERED' },
    ],
  },
  {
    id: 'SAN-103',
    branchCode: '2',
    branchName: 'Vashi Branch',
    accountNo: 'PL-2026-1102',
    customerNo: 'CUST-7729',
    customerName: 'अमोल शांताराम गायकवाड (Amol Gaikwad)',
    borrowerName: 'अमोल शांताराम गायकवाड',
    mobile: '9765432100',
    maskedMobile: '97XXXX2100',
    eventType: 'LOAN_SANCTION',
    recipientType: 'BORROWER',
    sanctionAmount: 350000,
    sanctionDate: '2026-08-13',
    loanScheme: 'वैयक्तिक कर्ज - Personal Loan (Scheme 10)',
    stage: 103,
    queueStatus: 'PENDING',
    createdAt: '2026-08-13 16:45',
    guarantors: [
      { name: 'प्रदीप विठ्ठल कांबळे', mobile: '9765488990', status: 'PENDING' },
      { name: 'राजेश दत्तात्रय माने', mobile: '9765411223', status: 'PENDING' },
    ],
  },
];

export const mockKycDue: KycDueEvent[] = [
  {
    id: 'KYC-201',
    branchCode: '1',
    branchName: 'Main Branch (Mahape)',
    accountNo: 'SB-100234',
    customerNo: 'CUST-3310',
    customerName: 'प्रवीण रघुनाथ कुलकर्णी (Pravin Kulkarni)',
    mobile: '9422033445',
    maskedMobile: '94XXXX3445',
    eventType: 'KYC_DUE',
    recipientType: 'CUSTOMER',
    kycDueDate: '2026-11-20',
    daysRemaining: 3,
    pendingDocuments: ['उत्पन्न दाखला (Income Certificate)', 'Re-KYC अर्ज'],
    queueStatus: 'PENDING',
    createdAt: '2026-11-15 09:00',
  },
  {
    id: 'KYC-202',
    branchCode: '1',
    branchName: 'Main Branch (Mahape)',
    accountNo: 'CA-200918',
    customerNo: 'CUST-4190',
    customerName: 'बालाजी ट्रेडर्स - प्रो. आनंद जोशी (Balaji Traders)',
    mobile: '9822188990',
    maskedMobile: '98XXXX8990',
    eventType: 'KYC_DUE',
    recipientType: 'CUSTOMER',
    kycDueDate: '2026-11-14',
    daysRemaining: -3, // Overdue
    pendingDocuments: ['GST प्रमाणपत्र', 'पॅन कार्ड प्रत'],
    queueStatus: 'SENT',
    createdAt: '2026-11-14 10:00',
    sentAt: '2026-11-14 10:02',
    deliveredAt: '2026-11-14 10:03',
  },
  {
    id: 'KYC-203',
    branchCode: '8',
    branchName: 'Panvel Branch',
    accountNo: 'SB-108842',
    customerNo: 'CUST-5221',
    customerName: 'मंगला एकनाथ सावंत (Mangala Sawant)',
    mobile: '9921044556',
    maskedMobile: '99XXXX4556',
    eventType: 'KYC_DUE',
    recipientType: 'CUSTOMER',
    kycDueDate: '2026-11-28',
    daysRemaining: 11,
    pendingDocuments: ['नवीन पत्ता पुरावा (Address Proof)'],
    queueStatus: 'PENDING',
    createdAt: '2026-11-16 11:30',
  },
];

export const mockKycNotExist: KycNotExistEvent[] = [
  {
    id: 'MKYC-301',
    branchCode: '1',
    branchName: 'Main Branch (Mahape)',
    accountNo: 'SB-109432',
    customerNo: 'CUST-45120',
    customerName: 'विकास दत्तात्रय मोरे (Vikas More)',
    mobile: '9823099112',
    maskedMobile: '98XXXX9112',
    eventType: 'KYC_NOT_EXIST',
    recipientType: 'CUSTOMER',
    missingDocumentType: 'Aadhaar Card',
    memberDate: '2024-02-10',
    queueStatus: 'DELIVERED',
    createdAt: '2026-11-12 14:00',
    sentAt: '2026-11-12 14:02',
    deliveredAt: '2026-11-12 14:04',
  },
  {
    id: 'MKYC-302',
    branchCode: '8',
    branchName: 'Panvel Branch',
    accountNo: 'LA-302119',
    customerNo: 'CUST-48821',
    customerName: 'कविता संभाजी पवार (Kavita Pawar)',
    mobile: '9890877665',
    maskedMobile: '98XXXX7665',
    eventType: 'KYC_NOT_EXIST',
    recipientType: 'CUSTOMER',
    missingDocumentType: 'PAN Card',
    memberDate: '2023-11-18',
    queueStatus: 'PENDING',
    createdAt: '2026-11-16 12:00',
  },
  {
    id: 'MKYC-303',
    branchCode: '2',
    branchName: 'Vashi Branch',
    accountNo: 'SB-110042',
    customerNo: 'CUST-51203',
    customerName: 'दीपक बळवंत घाडगे (Deepak Ghadge)',
    mobile: '9423166554',
    maskedMobile: '94XXXX6554',
    eventType: 'KYC_NOT_EXIST',
    recipientType: 'CUSTOMER',
    missingDocumentType: 'Both Aadhaar & PAN',
    memberDate: '2025-01-05',
    queueStatus: 'FAILED',
    errorMessage: 'अमान्य मोबाईल नंबर (Invalid Number Length)',
    createdAt: '2026-11-15 15:30',
  },
];

export const mockLoanOverdue: LoanOverdueEvent[] = [
  {
    id: 'OVD-401',
    branchCode: '8',
    branchName: 'Panvel Branch',
    accountNo: 'ML-30112',
    customerNo: 'CUST-8021',
    customerName: 'विजय तुकाराम शिंदे (Vijay Shinde)',
    mobile: '9822066778',
    maskedMobile: '98XXXX6778',
    eventType: 'LOAN_OVERDUE',
    recipientType: 'BORROWER',
    overdueAmount: 42500,
    totalOutstanding: 345000,
    asOfDate: '2026-09-30',
    overdueDays: 45,
    schemeCode: 'मध्यम मुदत कृषी कर्ज (Scheme 3)',
    branchContact: '+91 9029088876',
    queueStatus: 'DELIVERED',
    createdAt: '2026-10-01 10:00',
    sentAt: '2026-10-01 10:05',
    deliveredAt: '2026-10-01 10:06',
    readAt: '2026-10-01 10:15',
    inboundReply: {
      type: 'PAYMENT_INTENT',
      text: 'मी येत्या शुक्रवारी दुपारी ४ वाजता शाखेत येऊन रक्कम भरणार आहे.',
      preferredDate: '2026-10-05',
      receivedAt: '2026-10-01 11:20',
      followUpStatus: 'ASSIGNED',
    },
  },
  {
    id: 'OVD-402',
    branchCode: '8',
    branchName: 'Panvel Branch',
    accountNo: 'PL-80221',
    customerNo: 'CUST-9902',
    customerName: 'राहुल सखाराम भोसले (Rahul Bhosale)',
    mobile: '9890122334',
    maskedMobile: '98XXXX2334',
    eventType: 'LOAN_OVERDUE',
    recipientType: 'BORROWER',
    overdueAmount: 12850,
    totalOutstanding: 180000,
    asOfDate: '2026-09-30',
    overdueDays: 18,
    schemeCode: 'वैयक्तिक कर्ज (Scheme 3)',
    branchContact: '+91 9029088876',
    queueStatus: 'READ',
    createdAt: '2026-10-01 10:00',
    sentAt: '2026-10-01 10:05',
    deliveredAt: '2026-10-01 10:06',
    readAt: '2026-10-01 10:30',
    inboundReply: {
      type: 'ALREADY_PAID',
      text: 'मी कालच गुगल पे द्वारे १०,००० भरले आहेत. पावत्या अपडेट करा.',
      receivedAt: '2026-10-01 10:45',
      followUpStatus: 'NEW',
    },
  },
  {
    id: 'OVD-403',
    branchCode: '8',
    branchName: 'Panvel Branch',
    accountNo: 'BL-40109',
    customerNo: 'CUST-6119',
    customerName: 'समर्थ एंटरप्रायझेस - प्रो. सुनिल कदम (Samarth Enterprises)',
    mobile: '9765400998',
    maskedMobile: '97XXXX0998',
    eventType: 'LOAN_OVERDUE',
    recipientType: 'BORROWER',
    overdueAmount: 118000,
    totalOutstanding: 890000,
    asOfDate: '2026-09-30',
    overdueDays: 72,
    schemeCode: 'व्यवसाय कर्ज (Scheme 3)',
    branchContact: '+91 9029088876',
    queueStatus: 'PENDING',
    createdAt: '2026-10-01 10:00',
  },
];
