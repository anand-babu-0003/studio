
"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';
import type { SiteSettings, AboutMeData } from '@/lib/types';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { defaultSiteSettingsForClient, defaultAboutMeDataForClient } from '@/lib/data';
import { Loader2 } from 'lucide-react';

// Helper function to create or update a meta tag
function updateMetaTag(name: string, content: string, isProperty: boolean = false) {
  if (typeof document === 'undefined') return;

  let element = isProperty
    ? document.querySelector(`meta[property="${name}"]`)
    : document.querySelector(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    if (isProperty) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

// Helper function to remove a meta tag
function removeMetaTag(name: string, isProperty: boolean = false) {
  if (typeof document === 'undefined') return;
  const element = isProperty
    ? document.querySelector(`meta[property="${name}"]`)
    : document.querySelector(`meta[name="${name}"]`);
  if (element) {
    element.remove();
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false); 
  
  const [currentSiteSettings, setCurrentSiteSettings] = useState<SiteSettings>(defaultSiteSettingsForClient);
  const [currentAboutMeData, setCurrentAboutMeData] = useState<AboutMeData>(defaultAboutMeDataForClient);
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);


  useEffect(() => {
    setIsMounted(true); 

    const fetchInitialData = async () => {
      setIsLayoutLoading(true);
      try {
        const settingsPromise = getSiteSettingsAction();
        const aboutPromise = getAboutMeDataAction();
        
        const [settings, aboutData] = await Promise.all([settingsPromise, aboutPromise]);

        setCurrentSiteSettings(settings || defaultSiteSettingsForClient);
        setCurrentAboutMeData(aboutData || defaultAboutMeDataForClient);

      } catch (error) {
        console.error("Failed to fetch initial layout data:", error);
        setCurrentSiteSettings(defaultSiteSettingsForClient); 
        setCurrentAboutMeData(defaultAboutMeDataForClient);
      } finally {
        setIsLayoutLoading(false);
      }
    };

    fetchInitialData(); 

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    if (!isAdminRoute) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (!isAdminRoute) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isAdminRoute]); 


  useEffect(() => {
    if (typeof document !== 'undefined' && currentSiteSettings && !isLayoutLoading) {
        const pathSegments = pathname.split('/').filter(Boolean);
        let pageTitleSegment = '';

        if (pathSegments.length > 0) {
          pageTitleSegment = pathSegments[pathSegments.length - 1]
                              .replace(/-/g, ' ')
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
        }
        
        // Define formattedPageTitle based on the calculated pageTitleSegment
        const formattedPageTitle = pageTitleSegment; // It's already formatted as desired

        const siteNameBase = currentSiteSettings.siteName || defaultSiteSettingsForClient.siteName;

        if (pathname === '/') {
            document.title = siteNameBase;
        } else if (formattedPageTitle && !isAdminRoute) {
            // For public pages with a title segment (e.g., /about -> "About")
            document.title = `${formattedPageTitle} | ${siteNameBase}`;
        } else if (isAdminRoute && pathSegments.length > 1 && pathSegments[0] === 'admin') {
            // For admin subpages (e.g., /admin/settings -> "Settings")
            const adminPageTitle = formattedPageTitle || 'Dashboard'; 
            document.title = `Admin: ${adminPageTitle} | ${siteNameBase}`;
        } else if (isAdminRoute && (pathname === '/admin' || pathname === '/admin/')) {
            // Explicitly for /admin or /admin/ (often the dashboard)
            document.title = `Admin: Dashboard | ${siteNameBase}`;
        } else {
            // Fallback for any other cases
            document.title = formattedPageTitle ? `${formattedPageTitle} | ${siteNameBase}` : siteNameBase;
        }

        updateMetaTag('description', currentSiteSettings.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription);
        updateMetaTag('og:title', document.title, true); // Use the just-set document.title
        updateMetaTag('og:description', currentSiteSettings.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription, true);

        if (currentSiteSettings.defaultMetaKeywords && currentSiteSettings.defaultMetaKeywords.trim() !== '') {
            updateMetaTag('keywords', currentSiteSettings.defaultMetaKeywords);
        } else {
            removeMetaTag('keywords');
        }

        if (currentSiteSettings.siteOgImageUrl && currentSiteSettings.siteOgImageUrl.trim() !== '') {
            updateMetaTag('og:image', currentSiteSettings.siteOgImageUrl, true);
        } else {
            removeMetaTag('og:image', true); 
        }
    }
  }, [currentSiteSettings, pathname, isAdminRoute, isLayoutLoading]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <title>{defaultSiteSettingsForClient.siteName}</title>
        <meta name="description" content={defaultSiteSettingsForClient.defaultMetaDescription} />
        {defaultSiteSettingsForClient.defaultMetaKeywords && (
          <meta name="keywords" content={defaultSiteSettingsForClient.defaultMetaKeywords} />
        )}
        {defaultSiteSettingsForClient.siteOgImageUrl && (
          <meta property="og:image" content={defaultSiteSettingsForClient.siteOgImageUrl} />
        )}
        <meta property="og:title" content={defaultSiteSettingsForClient.siteName} />
        <meta property="og:description" content={defaultSiteSettingsForClient.defaultMetaDescription} />
        <meta property="og:type" content="website" />

      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {isMounted && !isAdminRoute && !isLayoutLoading && (
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {isLayoutLoading && !isAdminRoute ? (
             <div className="flex-grow flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
             </div>
          ) : (
            <>
              {!isAdminRoute && <Navbar />}
              <div className="flex-grow">{children}</div>
              {!isAdminRoute && <Footer aboutMeData={currentAboutMeData} />}
            </>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
