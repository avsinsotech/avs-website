import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AVS InSoTech | Core Banking Software for Co-operative Banks & Credit Societies',
    template: '%s | AVS InSoTech',
  },
  description:
    'AVS InSoTech empowers Co-operative Banks, Credit Societies, DCCBs and NBFCs with integrated Core Banking, Digital Banking, Regulatory Compliance and AI-powered solutions. Navi Mumbai, Maharashtra.',
  applicationName: 'AVS InSoTech',
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#178FA7', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en-IN">
      <body>
        {children}
        {ga && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
