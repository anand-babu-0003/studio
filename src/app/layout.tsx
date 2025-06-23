
"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';
import type { SiteSettings, AboutMeData } from '@/lib/types';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { defaultSiteSettingsForClient, defaultAboutMeDataForClient } from '@/lib/data';
import { AlertTriangle } from 'lucide-react';
import FullScreenLoader from '@/components/shared/FullScreenLoader';

import { firestore } from '@/lib/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';


function updateMetaTag(name: string, content: string, isProperty: boolean = false) {
  if (typeof document === 'undefined') return;
  let element = isProperty
    ? document.querySelector(`meta[property="${name}"]`)
    : document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    if (isProperty) element.setAttribute('property', name);
    else element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function removeMetaTag(name: string, isProperty: boolean = false) {
  if (typeof document === 'undefined') return;
  const element = isProperty
    ? document.querySelector(`meta[property="${name}"]`)
    : document.querySelector(`meta[name="${name}"]`);
  if (element) element.remove();
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

  const fetchInitialAboutData = useCallback(async () => {
    try {
      const aboutData = await getAboutMeDataAction();
      setCurrentAboutMeData(aboutData || defaultAboutMeDataForClient);
    } catch (error) {
      console.error("Failed to fetch initial About Me data:", error);
      setCurrentAboutMeData(defaultAboutMeDataForClient);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    let settingsUnsubscribe: (() => void) | undefined;

    if (firestore) {
      const settingsDocRef = doc(firestore, 'app_config', 'siteSettingsDoc');
      settingsUnsubscribe = onSnapshot(settingsDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as SiteSettings;
            setCurrentSiteSettings({
              siteName: data.siteName || defaultSiteSettingsForClient.siteName,
              defaultMetaDescription: data.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription,
              defaultMetaKeywords: data.defaultMetaKeywords || defaultSiteSettingsForClient.defaultMetaKeywords,
              siteOgImageUrl: data.siteOgImageUrl || defaultSiteSettingsForClient.siteOgImageUrl,
              maintenanceMode: typeof data.maintenanceMode === 'boolean' ? data.maintenanceMode : defaultSiteSettingsForClient.maintenanceMode,
              skillsPageMetaTitle: data.skillsPageMetaTitle || defaultSiteSettingsForClient.skillsPageMetaTitle,
              skillsPageMetaDescription: data.skillsPageMetaDescription || defaultSiteSettingsForClient.skillsPageMetaDescription
            });
          } else {
            console.warn("Site settings document not found in Firestore for live listener. Using defaults.");
            setCurrentSiteSettings(defaultSiteSettingsForClient);
          }
          setIsLayoutLoading(false);
        },
        (error) => {
          console.error("Error listening to site settings:", error);
          setCurrentSiteSettings(defaultSiteSettingsForClient);
          setIsLayoutLoading(false);
        }
      );
    } else {
      console.warn("RootLayout: Firestore not available for live settings updates. Using defaults and marking as loaded.");
      setCurrentSiteSettings(defaultSiteSettingsForClient);
      setIsLayoutLoading(false);
    }

    fetchInitialAboutData();

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
      if (settingsUnsubscribe) {
        settingsUnsubscribe();
      }
    };
  }, [isAdminRoute, fetchInitialAboutData]);


  useEffect(() => {
    if (typeof document !== 'undefined' && currentSiteSettings && !isLayoutLoading) {
        const pathSegments = pathname.split('/').filter(Boolean);
        let pageTitleSegment = '';
        let formattedPageTitle = '';

        if (pathSegments.length > 0) {
          pageTitleSegment = pathSegments[pathSegments.length - 1];
          formattedPageTitle = pageTitleSegment
                              .replace(/-/g, ' ')
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
        }

        const siteNameBase = currentSiteSettings.siteName || defaultSiteSettingsForClient.siteName;
        let title = siteNameBase;

        if (pathname === '/') {
            title = siteNameBase;
        } else if (formattedPageTitle && !isAdminRoute) {
            title = `${formattedPageTitle} | ${siteNameBase}`;
        } else if (isAdminRoute && pathSegments.length > 1 && pathSegments[0] === 'admin') {
            const adminPageTitle = formattedPageTitle || 'Dashboard';
            title = `Admin: ${adminPageTitle} | ${siteNameBase}`;
        } else if (isAdminRoute && (pathname === '/admin' || pathname === '/admin/')) {
            title = `Admin: Dashboard | ${siteNameBase}`;
        } else if (formattedPageTitle) {
             title = `${formattedPageTitle} | ${siteNameBase}`;
        }
        document.title = title;

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
        <link href="https://fonts.googleapis.com/css?family=Arvo&display=swap" rel="stylesheet" />


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
          {currentSiteSettings.maintenanceMode && !isAdminRoute && (
            <div data-maintenance-banner className="fixed top-0 left-0 right-0 z-[101] p-3 bg-destructive text-destructive-foreground shadow-md flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                The site is currently under maintenance. Some features may be unavailable.
              </p>
            </div>
          )}

          {isLayoutLoading && !isAdminRoute && pathname !== '/admin/login' ? (
             <FullScreenLoader />
          ) : (
            <>
              {!isAdminRoute && <Navbar />}
              <div className={`flex-grow ${currentSiteSettings.maintenanceMode && !isAdminRoute ? 'pt-12' : ''} ${!isAdminRoute && !currentSiteSettings.maintenanceMode ? 'pt-10' : 'pt-0'}`}>
                {children}
              </div>
              {!isAdminRoute && <Footer aboutMeData={currentAboutMeData} />}
            </>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
