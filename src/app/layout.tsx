
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { defaultSiteSettingsForClient } from '@/lib/data';
import { ClientLayoutWrapper } from '@/components/layout/client-layout-wrapper';
import Footer from '@/components/layout/footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettingsAction();
  const settings = siteSettings || defaultSiteSettingsForClient;

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultMetaDescription,
    keywords: settings.defaultMetaKeywords ? settings.defaultMetaKeywords.split(',').map(k => k.trim()) : [],
    openGraph: {
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      images: settings.siteOgImageUrl ? [{ url: settings.siteOgImageUrl }] : [],
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClientLayoutWrapper footer={<Footer />}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
