
"use client"; 

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';
import type { SiteSettings } from '@/lib/types';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions'; // Import the action

// Static metadata object - can be a fallback
export const staticMetadata: Metadata = {
  title: 'Portfolio', // Default title
  description: 'Personal portfolio of a passionate developer.', // Default description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    async function fetchSettings() {
      try {
        const settings = await getSiteSettingsAction();
        setSiteSettings(settings);
      } catch (error) {
        console.error("Failed to fetch site settings for layout:", error);
        // Use defaults if fetch fails
        setSiteSettings({ 
          siteName: String(staticMetadata.title || 'Portfolio'), 
          defaultMetaDescription: String(staticMetadata.description || 'Default description') 
        });
      }
    }
    fetchSettings();

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Update document title and meta description when siteSettings are loaded/changed
  useEffect(() => {
    if (siteSettings) {
      // Determine page title - could be more sophisticated if pages have own titles
      const pageTitleSegment = pathname.split('/').pop();
      const formattedPageTitle = pageTitleSegment 
        ? pageTitleSegment.charAt(0).toUpperCase() + pageTitleSegment.slice(1)
        : '';
      
      if (pathname === '/') {
         document.title = siteSettings.siteName;
      } else if (formattedPageTitle && !isAdminRoute) {
         document.title = `${siteSettings.siteName} | ${formattedPageTitle}`;
      } else if (!isAdminRoute) {
         document.title = siteSettings.siteName;
      }
      // For admin routes, title is usually handled by the page itself or a generic admin title

      const metaDescriptionTag = document.querySelector('meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', siteSettings.defaultMetaDescription);
      } else {
        const newMetaTag = document.createElement('meta');
        newMetaTag.name = 'description';
        newMetaTag.content = siteSettings.defaultMetaDescription;
        document.head.appendChild(newMetaTag);
      }
    }
  }, [siteSettings, pathname, isAdminRoute]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Initial title and meta description (will be updated by useEffect) */}
        <title>{siteSettings?.siteName || String(staticMetadata.title)}</title>
        <meta name="description" content={siteSettings?.defaultMetaDescription || String(staticMetadata.description)} />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {isMounted && !isAdminRoute && (
          <>
            <div 
              className="light-orb light-orb-1" 
              style={{ 
                transform: `translate(calc(${mousePosition.x}px - 30vw), calc(${mousePosition.y}px - 30vh))`,
              }}
            />
            <div 
              className="light-orb light-orb-2" 
              style={{ 
                transform: `translate(calc(${mousePosition.x}px - 25vw), calc(${mousePosition.y}px - 25vh))`,
                 transitionDelay: '0.05s' 
              }}
            />
          </>
        )}
        
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
