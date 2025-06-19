
"use client"; 

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation'; 
import { useEffect, useState, useCallback } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';
import type { SiteSettings, AboutMeData } from '@/lib/types'; // Added AboutMeData
import { getSiteSettingsAction } from '@/actions/admin/settingsActions'; 
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';


// Static metadata object - can be a fallback or initial state
export const staticMetadata: Metadata = {
  title: 'Portfolio', // Default title
  description: 'Personal portfolio of a passionate developer.', // Default description
};

// Default complete site settings for fallback
const defaultSiteSettingsInitial: SiteSettings = {
  siteName: String(staticMetadata.title || 'Portfolio'), 
  defaultMetaDescription: String(staticMetadata.description || 'Default description for my portfolio.'),
  defaultMetaKeywords: '', 
  siteOgImageUrl: '', 
};

const defaultAboutMeDataInitial: AboutMeData = {
  name: 'User Name',
  title: 'User Title',
  bio: 'Default bio.',
  profileImage: 'https://placehold.co/300x300.png',
  dataAiHint: 'profile picture',
  experience: [],
  education: [],
  email: 'user@example.com',
  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
};

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
  const [currentSiteSettings, setCurrentSiteSettings] = useState<SiteSettings>(defaultSiteSettingsInitial);
  const [currentAboutMeData, setCurrentAboutMeData] = useState<AboutMeData>(defaultAboutMeDataInitial); // For Footer

  const fetchInitialData = useCallback(async () => {
    try {
      const settings = await getSiteSettingsAction();
      setCurrentSiteSettings({
        ...defaultSiteSettingsInitial,
        ...(settings ?? {}),
      });
    } catch (error) {
      console.error("Failed to fetch site settings for layout:", error);
      setCurrentSiteSettings(defaultSiteSettingsInitial);
    }

    try { // Fetch about me data for footer, etc.
      const aboutData = await getAboutMeDataAction();
      setCurrentAboutMeData({
          ...defaultAboutMeDataInitial,
          ...(aboutData ?? {})
      });
    } catch (error) {
        console.error("Failed to fetch about me data for layout:", error);
        setCurrentAboutMeData(defaultAboutMeDataInitial);
    }
  }, []);


  useEffect(() => {
    setIsMounted(true);
    fetchInitialData();

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    if (typeof window !== 'undefined' && !isAdminRoute) { 
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (typeof window !== 'undefined' && !isAdminRoute) { 
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isAdminRoute, fetchInitialData]); 

  
  useEffect(() => {
    if (currentSiteSettings) {
      const pageTitleSegment = pathname.split('/').pop();
      const formattedPageTitle = pageTitleSegment 
        ? pageTitleSegment.charAt(0).toUpperCase() + pageTitleSegment.slice(1).replace(/-/g, ' ')
        : '';
      
      if (pathname === '/') {
         document.title = currentSiteSettings.siteName;
      } else if (formattedPageTitle && !isAdminRoute) {
         document.title = `${currentSiteSettings.siteName} | ${formattedPageTitle}`;
      } else if (!isAdminRoute) {
         document.title = currentSiteSettings.siteName;
      }

      updateMetaTag('description', currentSiteSettings.defaultMetaDescription);
      updateMetaTag('og:title', currentSiteSettings.siteName, true);
      updateMetaTag('og:description', currentSiteSettings.defaultMetaDescription, true);
      
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
  }, [currentSiteSettings, pathname, isAdminRoute]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        <title>{currentSiteSettings?.siteName || defaultSiteSettingsInitial.siteName}</title>
        <meta name="description" content={currentSiteSettings?.defaultMetaDescription || defaultSiteSettingsInitial.defaultMetaDescription} />
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
          <div className={isAdminRoute ? "flex-grow" : "flex-grow"}>{children}</div>
          {!isAdminRoute && <Footer aboutMeData={currentAboutMeData} />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

