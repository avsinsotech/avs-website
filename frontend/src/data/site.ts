// ---------------------------------------------------------------------------
// AVS InSoTech – site-wide content.
// Everything in this file is the SEED / FALLBACK content. At runtime the site
// fetches the same shapes from the ASP.NET Core API (see src/lib/api.ts) so the
// AVS team can edit it from the admin panel without touching source code.
// ---------------------------------------------------------------------------

export const company = {
  legalName: 'AVS InSoTech Pvt. Ltd.',
  brand: 'AVS',
  tagline: 'Quality, Not Quantity, Is Our Measure.',
  positioning: "The Technology Backbone for India's Co-operative Financial Sector.",
  brandMessage:
    'Empowering Co-operative Financial Institutions Through Integrated Banking Technology, Digital Innovation and Artificial Intelligence.',
  established: 2018,
  address: {
    line1: 'Office 409, Rupa Solitaire',
    line2: 'Millennium Business Park, Mahape',
    city: 'Navi Mumbai',
    pin: '400710',
    state: 'Maharashtra',
    country: 'India',
    full: 'Office 409, Rupa Solitaire, Millennium Business Park, Mahape, Navi Mumbai – 400710, Maharashtra, India.',
  },
  email: 'sales@avsinsotech.com',
  // The ONLY official contact number. Used for all tel: and WhatsApp links.
  phone: '+91 9029088876',
  phoneE164: '+919029088876',
  whatsapp: '919029088876',
  businessHours: [
    { days: 'Monday – Saturday', hours: '10:00 AM – 7:00 PM' },
    { days: 'Sunday & Public Holidays', hours: 'Closed' },
  ],
  mapEmbed:
    'https://www.google.com/maps?q=Rupa+Solitaire,+Millennium+Business+Park,+Mahape,+Navi+Mumbai+400710&output=embed',
  social: {
    linkedin: '',
    youtube: '',
  },
};

export const stats = [
  { value: 386, suffix: '', label: 'Client Institutions' },
  { value: 27, suffix: ' Lakh+', label: 'End Customers Served' },
  { value: 51, suffix: '+', label: 'Professionals' },
  { value: 20, suffix: '+', label: 'Products & Modules' },
  { value: 2018, suffix: '', label: 'Established', noAnimateFormat: true },
];

export type Audience = { slug: string; name: string; short: string; icon: string; blurb: string };

export const audiences: Audience[] = [
  {
    slug: 'credit-societies',
    name: 'Co-operative Credit Societies',
    short: 'Credit Societies',
    icon: 'Users',
    blurb: 'Complete society automation – deposits, loans, recovery, member services and statutory reporting.',
  },
  {
    slug: 'urban-cooperative-banks',
    name: 'Urban Co-operative Banks',
    short: 'Urban Co-op Banks',
    icon: 'Building2',
    blurb: 'Bank-grade core banking, digital channels and RBI regulatory reporting for UCBs.',
  },
  {
    slug: 'dccbs',
    name: 'District Central Co-operative Banks',
    short: 'DCCBs',
    icon: 'Landmark',
    blurb: 'Multi-branch operations, PACS connectivity, treasury and consolidated MIS across the district.',
  },
  {
    slug: 'state-cooperative-banks',
    name: 'State Co-operative Banks',
    short: 'State Co-op Banks',
    icon: 'Building',
    blurb: 'Scalable platforms for apex institutions – investment, ALM, compliance and enterprise reporting.',
  },
  {
    slug: 'nbfcs',
    name: 'NBFCs',
    short: 'NBFCs',
    icon: 'BadgeIndianRupee',
    blurb: 'Loan origination, gold loan, collections and KYC automation built for lending businesses.',
  },
  {
    slug: 'cooperative-federations',
    name: 'Co-operative Federations',
    short: 'Federations',
    icon: 'Network',
    blurb: 'Centralised technology and shared services for member institutions under one federation.',
  },
];

export type Solution = {
  slug: string;
  name: string;
  icon: string;
  summary: string;
  description: string;
  categoryKey: ProductCategoryKey;
  outcomes: string[];
};

export type ProductCategoryKey = 'core' | 'kyc' | 'lending' | 'ai' | 'treasury' | 'hr';

export const productCategories: { key: ProductCategoryKey; name: string; icon: string }[] = [
  { key: 'core', name: 'Core Banking & Digital Banking', icon: 'Landmark' },
  { key: 'kyc', name: 'KYC & Compliance', icon: 'ShieldCheck' },
  { key: 'lending', name: 'Lending & Recovery', icon: 'HandCoins' },
  { key: 'ai', name: 'AI & Automation', icon: 'Sparkles' },
  { key: 'treasury', name: 'Treasury & Regulatory Reporting', icon: 'LineChart' },
  { key: 'hr', name: 'HR & Enterprise', icon: 'Briefcase' },
];

export const solutions: Solution[] = [
  {
    slug: 'core-banking',
    name: 'Core Banking Solutions',
    icon: 'Landmark',
    categoryKey: 'core',
    summary: 'A centralised, integrated core banking platform for deposits, loans, accounting and branch operations.',
    description:
      'AVS CBS brings every branch, product and ledger of your institution onto one centralised platform – with digital account opening, agency banking and mobile banking connected to the same core.',
    outcomes: ['Single centralised database for all branches', 'Real-time accounting and day-end processes', 'Connected digital channels on the same core'],
  },
  {
    slug: 'digital-banking',
    name: 'Digital Banking Solutions',
    icon: 'Smartphone',
    categoryKey: 'core',
    summary: 'Mobile banking, digital onboarding and agency banking that bring your members online.',
    description:
      'Give members the convenience of a large bank – mobile banking, digital account opening and doorstep banking through agents – all running on your AVS core.',
    outcomes: ['Mobile-first member experience', 'Paperless account opening', 'Doorstep and agency banking'],
  },
  {
    slug: 'kyc-compliance',
    name: 'KYC & Regulatory Compliance',
    icon: 'ShieldCheck',
    categoryKey: 'kyc',
    summary: 'e-KYC, CKYC, AML/STR, FIU reporting and RBI regulatory MIS in one compliance stack.',
    description:
      'Automate KYC verification, CKYC uploads, AML monitoring and regulatory reporting so your compliance team spends less time on manual work and more on oversight.',
    outcomes: ['Faster, verified customer onboarding', 'Automated CKYC and FIU workflows', 'Ready regulatory MIS'],
  },
  {
    slug: 'lending-recovery',
    name: 'Lending & Recovery Management',
    icon: 'HandCoins',
    categoryKey: 'lending',
    summary: 'From loan origination and gold loans to AI-assisted and field recovery.',
    description:
      'Manage the full loan lifecycle – application, appraisal, documentation, disbursal and recovery – with field recovery apps and AI-powered recovery calling.',
    outcomes: ['Structured loan origination', 'Gold loan management', 'AI and field-based recovery'],
  },
  {
    slug: 'ai-automation',
    name: 'AI & Intelligent Automation',
    icon: 'Sparkles',
    categoryKey: 'ai',
    summary: 'Practical AI for calling, marketing, recovery and staff productivity.',
    description:
      'AVS brings practical, AI-first automation to co-operative institutions – AI calling, AI marketing, business process automation and knowledge tools that save staff time every day.',
    outcomes: ['AI-powered calling and outreach', 'Automated routine operations', 'Productivity insights'],
  },
  {
    slug: 'investment-treasury',
    name: 'Investment & Treasury Management',
    icon: 'LineChart',
    categoryKey: 'treasury',
    summary: 'Investment, ALM and regulatory returns for better balance-sheet control.',
    description:
      'Track investments, manage asset-liability positions and prepare regulatory returns such as CIMS, OSS, NBS and XBRL-related reporting from one place.',
    outcomes: ['Consolidated investment register', 'ALM monitoring', 'Regulatory return preparation'],
  },
];

export const whyChoose = [
  { icon: 'Award', title: 'Banking Domain Expertise', text: 'A team that understands co-operative banking operations, regulations and member expectations.' },
  { icon: 'Layers', title: 'Integrated Banking Ecosystem', text: 'Core banking, digital, compliance, lending and AI products that work together.' },
  { icon: 'Boxes', title: '20+ Products & Modules', text: 'One technology partner for every department of your institution.' },
  { icon: 'UserCheck', title: 'Dedicated Implementation Team', text: 'Structured on-site and remote implementation led by experienced specialists.' },
  { icon: 'DatabaseZap', title: 'Professional Data Migration', text: 'Careful migration of legacy data with reconciliation and validation.' },
  { icon: 'ShieldCheck', title: 'Regulatory Compliance Solutions', text: 'KYC, AML, FIU and RBI reporting built into the ecosystem.' },
  { icon: 'Languages', title: 'Marathi & English Customer Support', text: 'Support in the language your staff is most comfortable with.' },
  { icon: 'BrainCircuit', title: 'AI-First Technology Approach', text: 'Practical AI built into products to improve productivity and service.' },
];

export const processSteps = [
  { no: '01', title: 'Requirement Study', text: 'We study your products, branches, workflows and reporting needs.' },
  { no: '02', title: 'Configuration & Customisation', text: 'The platform is configured to your products, rules and parameters.' },
  { no: '03', title: 'Data Migration', text: 'Legacy data is migrated, reconciled and validated with your team.' },
  { no: '04', title: 'Training & Testing', text: 'Staff are trained and the system is tested on real scenarios.' },
  { no: '05', title: 'Go-Live', text: 'A planned cut-over with our team on hand for a smooth start.' },
  { no: '06', title: 'Ongoing Support', text: 'Continuous support, updates and enhancements in Marathi & English.' },
];

export const technologies = [
  { name: 'Artificial Intelligence', icon: 'BrainCircuit' },
  { name: 'Machine Learning', icon: 'Cpu' },
  { name: 'C# / .NET', icon: 'Code2' },
  { name: 'ASP.NET', icon: 'Globe' },
  { name: 'React.js', icon: 'Atom' },
  { name: 'Flutter', icon: 'Smartphone' },
  { name: 'Microsoft SQL Server', icon: 'Database' },
  { name: 'PostgreSQL', icon: 'DatabaseBackup' },
  { name: 'REST APIs', icon: 'Webhook' },
  { name: 'Cloud & Server Infrastructure', icon: 'Cloud' },
  { name: 'Cybersecurity & Data Protection', icon: 'Lock' },
];

export const capabilities = [
  { icon: 'Code2', title: 'Software Architecture & Engineering' },
  { icon: 'Landmark', title: 'Banking Domain Expertise' },
  { icon: 'Boxes', title: 'Product Development' },
  { icon: 'Database', title: 'Data Migration & Database Administration' },
  { icon: 'Rocket', title: 'Banking Implementation' },
  { icon: 'Headset', title: 'Customer Support & Operations' },
  { icon: 'BadgeCheck', title: 'Quality Assurance & Testing' },
  { icon: 'TrendingUp', title: 'Sales & Business Development' },
  { icon: 'BrainCircuit', title: 'AI Research & Innovation' },
];

export const securityFeatures = [
  { icon: 'Globe', title: 'Web-Based Application Architecture', text: 'Centralised, browser-based applications – no client installations at branches.' },
  { icon: 'Smartphone', title: 'Mobile Application Architecture', text: 'Mobile apps connect to the core through secured APIs.' },
  { icon: 'Webhook', title: 'API Integration', text: 'REST APIs for integration with verification services, payment systems and third parties.' },
  { icon: 'UserCog', title: 'Role-Based Access Control', text: 'Users see and do only what their role permits.' },
  { icon: 'KeyRound', title: 'OTP / Two-Factor Authentication', text: 'An additional verification layer for sensitive actions and logins.' },
  { icon: 'Lock', title: 'Data Encryption', text: 'Sensitive data protected using encryption.' },
  { icon: 'ShieldCheck', title: 'HTTPS', text: 'All application traffic served over HTTPS.' },
  { icon: 'ScrollText', title: 'Activity Logging', text: 'User activity is logged for audit and traceability.' },
  { icon: 'DatabaseBackup', title: 'Backup & Disaster Recovery', text: 'Scheduled backups and recovery procedures to protect data.' },
  { icon: 'DatabaseZap', title: 'Secure Data Migration', text: 'Controlled, validated migration of legacy data.' },
];

export const industries = [
  {
    slug: 'credit-societies',
    name: 'Co-operative Credit Societies',
    icon: 'Users',
    intro: 'Credit societies need affordable technology that handles high transaction volumes, strict recovery and growing compliance – often with small teams.',
    challenges: [
      'Manual or legacy systems that slow down daily operations',
      'Rising KYC and regulatory reporting requirements',
      'Loan recovery that depends heavily on field staff',
      'Members expecting mobile and digital services',
    ],
    solutions: ['core-banking-solution', 'mobile-banking', 'e-kyc', 'vasuli360-ai-recovery', 'field-recovery-app', 'swarna-pay-gold-loan'],
  },
  {
    slug: 'urban-cooperative-banks',
    name: 'Urban Co-operative Banks',
    icon: 'Building2',
    intro: 'UCBs operate under close RBI supervision and compete with large banks for the same customers.',
    challenges: [
      'RBI regulatory MIS and returns under tight timelines',
      'AML/STR monitoring and FIU reporting',
      'Delivering digital banking on par with larger banks',
      'Treasury and ALM oversight',
    ],
    solutions: ['core-banking-solution', 'digital-banking', 'aml-str', 'fiu-finnet', 'rbi-regulatory-mis', 'asset-liability-management'],
  },
  {
    slug: 'dccbs',
    name: 'District Central Co-operative Banks',
    icon: 'Landmark',
    intro: 'DCCBs serve large rural geographies through many branches and PACS, making connectivity and consolidated reporting critical.',
    challenges: [
      'Consolidating data across many branches',
      'Reaching rural members outside branch hours',
      'Large loan portfolios needing structured recovery',
      'Investment and treasury tracking',
    ],
    solutions: ['core-banking-solution', 'agency-bc-banking', 'loan-origination-system', 'field-recovery-app', 'investment-treasury', 'enterprise-reporting'],
  },
  {
    slug: 'state-cooperative-banks',
    name: 'State Co-operative Banks',
    icon: 'Building',
    intro: 'As apex institutions, State Co-operative Banks need scalable platforms for treasury, compliance and enterprise-wide reporting.',
    challenges: [
      'Enterprise-scale reporting and MIS',
      'Investment, ALM and regulatory returns',
      'Compliance across a large customer base',
      'Workforce and HR administration at scale',
    ],
    solutions: ['investment-treasury', 'asset-liability-management', 'xbrl-reporting', 'rbi-regulatory-mis', 'hrms', 'enterprise-reporting'],
  },
  {
    slug: 'nbfcs',
    name: 'NBFCs',
    icon: 'BadgeIndianRupee',
    intro: 'NBFCs need fast onboarding, disciplined credit processes and efficient collections to grow profitably.',
    challenges: [
      'Quick, verified customer onboarding',
      'Gold loan valuation, tracking and auctions',
      'Scaling collections without scaling headcount',
      'Document handling and audit readiness',
    ],
    solutions: ['loan-origination-system', 'swarna-pay-gold-loan', 'smartverify', 'vasuli360-ai-recovery', 'ai-calling', 'document-management-system'],
  },
  {
    slug: 'cooperative-federations',
    name: 'Co-operative Federations',
    icon: 'Network',
    intro: 'Federations can raise the technology level of every member institution through shared, centralised platforms.',
    challenges: [
      'Member institutions at very different levels of technology',
      'Cost of individual systems for small members',
      'Need for consolidated information across members',
      'Training and support at scale',
    ],
    solutions: ['core-banking-solution', 'ckyc-automation', 'knowledge-base-portal', 'ai360', 'enterprise-reporting', 'digital-banking'],
  },
];

export const faqs = [
  { q: 'Which institutions does AVS work with?', a: 'AVS works with Co-operative Credit Societies, Urban Co-operative Banks, District Central Co-operative Banks, State Co-operative Banks, NBFCs and Co-operative Federations.' },
  { q: 'Can AVS migrate data from our existing software?', a: 'Yes. Data migration is a standard part of every AVS implementation, carried out by our dedicated data migration and database team with reconciliation and validation.' },
  { q: 'Do you provide support in Marathi?', a: 'Yes. AVS provides customer support in both Marathi and English.' },
  { q: 'Is the AVS Core Banking Solution web-based?', a: 'Yes. AVS applications are web-based and centralised, so branches access the system through a browser.' },
  { q: 'How long does an implementation take?', a: 'Timelines depend on the size of the institution, number of branches, modules chosen and the condition of legacy data. Our team shares a plan after the requirement study.' },
  { q: 'How do we request a demo?', a: 'Use the Request a Demo form on this website, email sales@avsinsotech.com or call +91 9029088876.' },
];

export const articles = [
  {
    slug: 'why-cooperative-banks-need-centralised-core-banking',
    title: 'Why Co-operative Banks Need a Centralised Core Banking System',
    category: 'Banking Technology Articles',
    date: '2026-10-20',
    excerpt: 'How moving every branch onto a single core improves control, speed and member service.',
    readMins: 5,
  },
  {
    slug: 'ckyc-automation-for-credit-societies',
    title: 'CKYC Automation: Reducing Manual Effort for Credit Societies',
    category: 'RBI Compliance Updates',
    date: '2026-09-28',
    excerpt: 'Where time goes in manual CKYC processes – and how automation helps compliance teams.',
    readMins: 4,
  },
  {
    slug: 'practical-ai-in-cooperative-banking',
    title: 'Practical AI in Co-operative Banking: Where to Start',
    category: 'Co-operative Banking Updates',
    date: '2026-09-05',
    excerpt: 'AI calling, recovery reminders and productivity tools that deliver value quickly.',
    readMins: 6,
  },
];

export const resourceSections = [
  { icon: 'Newspaper', title: 'Banking Technology Articles', text: 'Insights on core banking, digital channels and technology strategy.' },
  { icon: 'Megaphone', title: 'Co-operative Banking Updates', text: 'News and developments relevant to the co-operative sector.' },
  { icon: 'ShieldCheck', title: 'RBI Compliance Updates', text: 'Regulatory updates and what they mean for your operations.' },
  { icon: 'FileText', title: 'Product Brochures', text: 'Download brochures for AVS products and solutions.' },
  { icon: 'PlayCircle', title: 'Product Videos', text: 'Walkthroughs and demos of AVS products.' },
  { icon: 'BookOpenCheck', title: 'Case Studies', text: 'How institutions have transformed operations with AVS.' },
  { icon: 'HelpCircle', title: 'FAQs', text: 'Answers to common questions about AVS and our implementations.' },
  { icon: 'Library', title: 'Knowledge Centre', text: 'Guides and learning resources for banking teams.' },
];
