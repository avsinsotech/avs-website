import type { ResourceKey, SettingsGroup } from '@/lib/adminApi';

export type Field = {
  name: string; label: string;
  type?: 'text' | 'textarea' | 'lines' | 'select' | 'number' | 'checkbox' | 'date' | 'image' | 'file' | 'richtext';
  options?: string[]; required?: boolean; help?: string; col?: 'full';
};

export type ResourceConfig = { key: ResourceKey; title: string; singular: string; columns: string[]; fields: Field[] };

const categoryKeys = ['core', 'kyc', 'lending', 'ai', 'treasury', 'hr'];

export const resources: Record<ResourceKey, ResourceConfig> = {
  products: {
    key: 'products', title: 'Products', singular: 'Product', columns: ['name', 'category', 'featured', 'published'],
    fields: [
      { name: 'name', label: 'Product name', required: true },
      { name: 'short', label: 'Short name' },
      { name: 'slug', label: 'URL slug', required: true, help: 'e.g. core-banking-solution → /products/core-banking-solution' },
      { name: 'category', label: 'Category', type: 'select', options: categoryKeys, required: true },
      { name: 'icon', label: 'Icon name (lucide)', help: 'e.g. Landmark, ShieldCheck, Bot' },
      { name: 'tagline', label: 'Tagline', col: 'full' },
      { name: 'intro', label: '1. Product introduction', type: 'textarea', col: 'full' },
      { name: 'features', label: '2. Key features (one per line)', type: 'lines', col: 'full' },
      { name: 'benefits', label: '3. Business benefits (one per line)', type: 'lines', col: 'full' },
      { name: 'modules', label: '4. Modules (one per line)', type: 'lines', col: 'full' },
      { name: 'workflow', label: '5. Workflow steps (one per line)', type: 'lines', col: 'full' },
      { name: 'tech', label: '6. Technology (one per line – blank uses category default)', type: 'lines', col: 'full' },
      { name: 'screenshot1', label: '7. Screenshot 1', type: 'image' },
      { name: 'screenshot2', label: '7. Screenshot 2', type: 'image' },
      { name: 'brochure', label: 'Brochure (PDF)', type: 'file' },
      { name: 'metaTitle', label: 'SEO meta title', col: 'full' },
      { name: 'metaDescription', label: 'SEO meta description', type: 'textarea', col: 'full' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
      { name: 'featured', label: 'Featured on homepage', type: 'checkbox' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  categories: {
    key: 'categories', title: 'Product Categories', singular: 'Category', columns: ['name', 'key', 'sortOrder'],
    fields: [
      { name: 'name', label: 'Category name', required: true },
      { name: 'key', label: 'Key', required: true },
      { name: 'icon', label: 'Icon name' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  solutions: {
    key: 'solutions', title: 'Solutions', singular: 'Solution', columns: ['name', 'slug', 'categoryKey'],
    fields: [
      { name: 'name', label: 'Solution name', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'icon', label: 'Icon name' },
      { name: 'categoryKey', label: 'Product category', type: 'select', options: categoryKeys },
      { name: 'summary', label: 'Summary (cards)', type: 'textarea', col: 'full' },
      { name: 'description', label: 'Description', type: 'textarea', col: 'full' },
      { name: 'outcomes', label: 'Outcomes (one per line)', type: 'lines', col: 'full' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  articles: {
    key: 'articles', title: 'Blogs & Articles', singular: 'Article', columns: ['title', 'category', 'date', 'published'],
    fields: [
      { name: 'title', label: 'Title', required: true, col: 'full' },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Banking Technology Articles', 'Co-operative Banking Updates', 'RBI Compliance Updates', 'Case Studies', 'Knowledge Centre', 'Product Videos'] },
      { name: 'date', label: 'Publish date', type: 'date' },
      { name: 'readMins', label: 'Read time (mins)', type: 'number' },
      { name: 'coverImage', label: 'Cover image', type: 'image' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', col: 'full' },
      { name: 'body', label: 'Body (Markdown / HTML)', type: 'richtext', col: 'full' },
      { name: 'metaDescription', label: 'SEO meta description', type: 'textarea', col: 'full' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  faqs: {
    key: 'faqs', title: 'FAQs', singular: 'FAQ', columns: ['question', 'sortOrder', 'published'],
    fields: [
      { name: 'question', label: 'Question', required: true, col: 'full' },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true, col: 'full' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  media: {
    key: 'media', title: 'Images & Brochures', singular: 'File', columns: ['title', 'kind', 'url'],
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'kind', label: 'Type', type: 'select', options: ['Brochure', 'Product Image', 'Team / Office Photo', 'Video Link', 'Other'] },
      { name: 'product', label: 'Related product slug (optional)' },
      { name: 'url', label: 'File', type: 'file', col: 'full' },
    ],
  },
};

export const settingsGroups: Record<SettingsGroup, { title: string; fields: Field[] }> = {
  homepage: {
    title: 'Homepage Content',
    fields: [
      { name: 'heroHeadline', label: 'Hero headline', type: 'textarea', col: 'full' },
      { name: 'heroSubheadline', label: 'Hero sub-headline', type: 'textarea', col: 'full' },
      { name: 'statClients', label: 'Client institutions', type: 'number' },
      { name: 'statCustomersLakh', label: 'End customers (lakh)', type: 'number' },
      { name: 'statProfessionals', label: 'Professionals', type: 'number' },
      { name: 'statProducts', label: 'Products & modules', type: 'number' },
      { name: 'established', label: 'Established (year)', type: 'number' },
      { name: 'ctaTitle', label: 'Final CTA title', col: 'full' },
    ],
  },
  company: {
    title: 'Company Profile & Contact',
    fields: [
      { name: 'legalName', label: 'Legal name' },
      { name: 'tagline', label: 'Tagline' },
      { name: 'positioning', label: 'Positioning statement', col: 'full' },
      { name: 'email', label: 'Sales email', help: 'Also receives lead notifications' },
      { name: 'phone', label: 'Phone (display)', help: 'Official number: +91 9029088876' },
      { name: 'whatsapp', label: 'WhatsApp number (digits only)', help: '919029088876' },
      { name: 'address', label: 'Head office address', type: 'textarea', col: 'full' },
      { name: 'businessHours', label: 'Business hours (one per line)', type: 'lines', col: 'full' },
    ],
  },
  seo: {
    title: 'SEO Settings',
    fields: [
      { name: 'defaultTitle', label: 'Default meta title', col: 'full' },
      { name: 'defaultDescription', label: 'Default meta description', type: 'textarea', col: 'full' },
      { name: 'keywords', label: 'Target keywords (comma separated)', type: 'textarea', col: 'full' },
      { name: 'gaMeasurementId', label: 'Google Analytics 4 ID' },
      { name: 'gscVerification', label: 'Search Console verification token' },
    ],
  },
};
