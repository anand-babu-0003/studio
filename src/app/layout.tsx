
"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';
import type { SiteSettings } from '@/lib/types';
import { defaultSiteSettingsForClient } from '@/lib/data';
import { AlertTriangle } from 'lucide-react';
import FullScreenLoader from '@/components/shared/FullScreenLoader';
import LiveAnnouncementBanner from '@/components/announcements/LiveAnnouncementBanner';

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
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);

  // Effect for Firestore listener (runs once)
  useEffect(() => {
    if (!firestore) {
      setCurrentSiteSettings(defaultSiteSettingsForClient);
      setIsLayoutLoading(false);
      return;
    }

    const settingsDocRef = doc(firestore, 'app_config', 'siteSettingsDoc');
    const unsubscribe = onSnapshot(settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentSiteSettings({
            siteName: data.siteName || defaultSiteSettingsForClient.siteName,
            defaultMetaDescription: data.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription,
            defaultMetaKeywords: data.defaultMetaKeywords || defaultSiteSettingsForClient.defaultMetaKeywords,
            siteOgImageUrl: data.siteOgImageUrl || defaultSiteSettingsForClient.siteOgImageUrl,
            maintenanceMode: typeof data.maintenanceMode === 'boolean' ? data.maintenanceMode : defaultSiteSettingsForClient.maintenanceMode,
            skillsPageMetaTitle: data.skillsPageMetaTitle || defaultSiteSettingsForClient.skillsPageMetaTitle,
            skillsPageMetaDescription: data.skillsPageMetaDescription || defaultSiteSettingsForClient.skillsPageMetaDescription,
          });
        } else {
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

    return () => unsubscribe();
  }, []);

  // Effect for client-side mounting and event listeners
  useEffect(() => {
    setIsMounted(true);

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

  // Effect for updating meta tags based on route and settings
  useEffect(() => {
    if (typeof document !== 'undefined' && currentSiteSettings && !isLayoutLoading) {
      const pathSegments = pathname.split('/').filter(Boolean);
      let pageTitleSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
      let formattedPageTitle = pageTitleSegment.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const siteNameBase = currentSiteSettings.siteName || defaultSiteSettingsForClient.siteName;
      let title = siteNameBase;
      
      const isSkillsPage = pathname === '/skills';
      
      if (pathname !== '/') {
        if (isAdminRoute) {
          const adminPageTitle = formattedPageTitle || 'Dashboard';
          title = `Admin: ${adminPageTitle} | ${siteNameBase}`;
        } else if (isSkillsPage && currentSiteSettings.skillsPageMetaTitle) {
          title = `${currentSiteSettings.skillsPageMetaTitle} | ${siteNameBase}`;
        } else {
          title = `${formattedPageTitle} | ${siteNameBase}`;
        }
      }
      document.title = title;
      updateMetaTag('og:title', title, true);

      // Other meta tags
      const description = isSkillsPage && currentSiteSettings.skillsPageMetaDescription 
        ? currentSiteSettings.skillsPageMetaDescription 
        : (currentSiteSettings.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription);
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
      
      if (currentSiteSettings.defaultMetaKeywords) updateMetaTag('keywords', currentSiteSettings.defaultMetaKeywords); else removeMetaTag('keywords');
      if (currentSiteSettings.siteOgImageUrl) updateMetaTag('og:image', currentSiteSettings.siteOgImageUrl, true); else removeMetaTag('og:image', true);
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
        {defaultSiteSettingsForClient.defaultMetaKeywords && <meta name="keywords" content={defaultSiteSettingsForClient.defaultMetaKeywords} />}
        {defaultSiteSettingsForClient.siteOgImageUrl && <meta property="og:image" content={defaultSiteSettingsForClient.siteOgImageUrl} />}
        <meta property="og:title" content={defaultSiteSettingsForClient.siteName} />
        <meta property="og:description" content={defaultSiteSettingsForClient.defaultMetaDescription} />
        <meta property="og:type" content="website" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {isMounted && !isAdminRoute && (
          <>
            <div className="light-orb light-orb-1" style={{transform: `translate(calc(${mousePosition.x}px - 30vw), calc(${mousePosition.y}px - 30vh))`}}/>
            <div className="light-orb light-orb-2" style={{transform: `translate(calc(${mousePosition.x}px - 25vw), calc(${mousePosition.y}px - 25vh))`, transitionDelay: '0.05s'}}/>
          </>
        )}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {isLayoutLoading && !isAdminRoute && pathname !== '/admin/login' && <FullScreenLoader />}
          <div style={{ visibility: isLayoutLoading && !isAdminRoute ? 'hidden' : 'visible', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!isAdminRoute && <LiveAnnouncementBanner />}
            {currentSiteSettings.maintenanceMode && !isAdminRoute && (
              <div data-maintenance-banner className="relative z-[60] p-3 bg-destructive text-destructive-foreground shadow-md flex items-center justify-center gap-2 text-center">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">The site is currently under maintenance. Some features may be unavailable.</p>
              </div>
            )}
            {!isAdminRoute && <Navbar />}
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            {!isAdminRoute && <Footer />}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
