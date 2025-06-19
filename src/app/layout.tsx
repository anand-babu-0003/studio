
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
  const [isMounted, setIsMounted] = useState(false); // For client-side only effects
  
  // Initialize with default values to prevent undefined errors during initial render
  const [currentSiteSettings, setCurrentSiteSettings] = useState<SiteSettings>(defaultSiteSettingsForClient);
  const [currentAboutMeData, setCurrentAboutMeData] = useState<AboutMeData>(defaultAboutMeDataForClient);

  useEffect(() => {
    setIsMounted(true); 

    const fetchInitialData = async () => {
      try {
        const settings = await getSiteSettingsAction();
        setCurrentSiteSettings(settings || defaultSiteSettingsForClient);
      } catch (error) {
        console.error("Failed to fetch site settings for layout:", error);
        setCurrentSiteSettings(defaultSiteSettingsForClient); // Fallback
      }

      try {
        const aboutData = await getAboutMeDataAction();
        setCurrentAboutMeData(aboutData || defaultAboutMeDataForClient);
      } catch (error) {
          console.error("Failed to fetch about me data for layout:", error);
          setCurrentAboutMeData(defaultAboutMeDataForClient); // Fallback
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
    if (typeof document !== 'undefined' && currentSiteSettings) {
        const pathSegments = pathname.split('/').filter(Boolean);
        const pageTitleSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length -1].replace(/-/g, ' ') : '';
        
        const formattedPageTitle = pageTitleSegment
            ? pageTitleSegment.charAt(0).toUpperCase() + pageTitleSegment.slice(1)
            : '';

        const siteNameBase = currentSiteSettings.siteName || defaultSiteSettingsForClient.siteName;

        if (pathname === '/') {
            document.title = siteNameBase;
        } else if (formattedPageTitle && !isAdminRoute) {
            document.title = `${formattedPageTitle} | ${siteNameBase}`;
        } else if (isAdminRoute && formattedPageTitle && pathSegments[0] === 'admin' && pathSegments.length > 1) {
             document.title = `Admin: ${formattedPageTitle} | ${siteNameBase}`;
        } else if (isAdminRoute && pathSegments[0] === 'admin' && pathSegments.length === 1) { // for /admin or /admin/
             document.title = `Admin Dashboard | ${siteNameBase}`;
        }
         else {
            document.title = siteNameBase;
        }

        updateMetaTag('description', currentSiteSettings.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription);
        updateMetaTag('og:title', document.title, true);
        updateMetaTag('og:description', currentSiteSettings.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription, true);

        if (currentSiteSettings.defaultMetaKeywords && currentSiteSettings.defaultMetaKeywords.trim() !== '') {
            updateMetaTag('keywords', currentSiteSettings.defaultMetaKeywords);
        } else {
            removeMetaTag('keywords');
        }

        if (currentSiteSettings.siteOgImageUrl && currentSiteSettings.siteOgImageUrl.trim() !== '') {
            updateMetaTag('og:image', currentSiteSettings.siteOgImageUrl, true);
        } else {
            removeMetaTag('og:image', true); // Or set to a default fallback image URL
        }
    }
  }, [currentSiteSettings, pathname, isAdminRoute]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon links are static and don't depend on fetched data */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* Default title and meta for initial load / JS disabled, will be updated by useEffect */}
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {!isAdminRoute && <Navbar />}
          <div className="flex-grow">{children}</div>
          {!isAdminRoute && <Footer aboutMeData={currentAboutMeData} />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
