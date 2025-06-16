"use client"; // Required for usePathname

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation'; // Import usePathname
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';

// Metadata can't be dynamic in a client component, so we define it statically.
// If dynamic metadata is needed based on path, it would require a different approach.
export const metadataObject: Metadata = {
  title: 'AnandVerse | Portfolio',
  description: 'Personal portfolio of a passionate developer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>{String(metadataObject.title)}</title>
        {metadataObject.description && <meta name="description" content={metadataObject.description} />}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <div className="light-orb light-orb-1"></div>
        <div className="light-orb light-orb-2"></div>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isAdminRoute && <Navbar />}
          <div className={isAdminRoute ? "flex-grow" : "flex-grow"}>{children}</div>
          {!isAdminRoute && <Footer />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
