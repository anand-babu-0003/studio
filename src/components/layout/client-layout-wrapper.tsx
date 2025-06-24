
"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/layout/theme-provider';
import type { SiteSettings } from '@/lib/types';
import { defaultSiteSettingsForClient } from '@/lib/data';
import { AlertTriangle } from 'lucide-react';
import FullScreenLoader from '@/components/shared/FullScreenLoader';
import LiveAnnouncementBanner from '@/components/announcements/LiveAnnouncementBanner';
import { cn } from '@/lib/utils';

import { firestore } from '@/lib/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export function ClientLayoutWrapper({
  children,
  footer,
}: Readonly<{
  children: React.ReactNode;
  footer: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const [currentSiteSettings, setCurrentSiteSettings] = useState<SiteSettings | null>(null);

  // Effect for Firestore listener to get live updates
  useEffect(() => {
    if (!firestore) {
      setCurrentSiteSettings(defaultSiteSettingsForClient);
      return;
    }

    const settingsDocRef = doc(firestore, 'app_config', 'siteSettingsDoc');
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentSiteSettings(docSnap.data() as SiteSettings);
      } else {
        setCurrentSiteSettings(defaultSiteSettingsForClient);
      }
    }, (error) => {
      console.error("Error listening to site settings:", error);
      setCurrentSiteSettings(defaultSiteSettingsForClient);
    });

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

  // A simple loading state until settings are fetched on the client for the first time.
  // This prevents seeing default content flash before the real content loads for banners etc.
  if (currentSiteSettings === null) {
      return <FullScreenLoader />;
  }
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {isMounted && !isAdminRoute && (
        <>
          <div className="light-orb light-orb-1" style={{transform: `translate(calc(${mousePosition.x}px - 30vw), calc(${mousePosition.y}px - 30vh))`}}/>
          <div className="light-orb light-orb-2" style={{transform: `translate(calc(${mousePosition.x}px - 25vw), calc(${mousePosition.y}px - 25vh))`, transitionDelay: '0.05s'}}/>
        </>
      )}

      <div className={cn("flex flex-col min-h-screen")}>
        {!isAdminRoute && <LiveAnnouncementBanner />}
        {currentSiteSettings?.maintenanceMode && !isAdminRoute && (
          <div data-maintenance-banner className="relative z-[60] p-3 bg-destructive text-destructive-foreground shadow-md flex items-center justify-center gap-2 text-center">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">The site is currently under maintenance. Some features may be unavailable.</p>
          </div>
        )}
        {!isAdminRoute && <Navbar />}
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        {!isAdminRoute && footer}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
