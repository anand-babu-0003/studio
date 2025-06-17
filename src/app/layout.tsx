
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

// Default complete site settings for fallback
const defaultSiteSettings: SiteSettings = {
  siteName: String(staticMetadata.title || 'Portfolio'), 
  defaultMetaDescription: String(staticMetadata.description || 'Default description for my portfolio.'),
  defaultMetaKeywords: '', // Default to empty string
  siteOgImageUrl: '', // Default to empty string
};

// Helper function to create or update a meta tag
function updateMetaTag(name: string, content: string, isProperty: boolean = false) {
  if (typeof document === 'undefined') return; // Guard against server-side execution

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
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    async function fetchSettings() {
      try {
        const settings = await getSiteSettingsAction();
        // Ensure the fetched settings, if partial, are merged with complete defaults
        setSiteSettings({
          ...defaultSiteSettings, // Start with complete defaults
          ...(settings ?? {}),     // Override with fetched settings if they exist
        });
      } catch (error) {
        console.error("Failed to fetch site settings for layout:", error);
        // Use complete defaults if fetch fails
        setSiteSettings(defaultSiteSettings);
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
        ? pageTitleSegment.charAt(0).toUpperCase() + pageTitleSegment.slice(1).replace(/-/g, ' ')
        : '';
      
      if (pathname === '/') {
         document.title = siteSettings.siteName;
      } else if (formattedPageTitle && !isAdminRoute) {
         document.title = `${siteSettings.siteName} | ${formattedPageTitle}`;
      } else if (!isAdminRoute) {
         document.title = siteSettings.siteName;
      }
      // For admin routes, title is usually handled by the page itself or a generic admin title

      // Update Meta Tags
      updateMetaTag('description', siteSettings.defaultMetaDescription);
      updateMetaTag('og:title', siteSettings.siteName, true);
      updateMetaTag('og:description', siteSettings.defaultMetaDescription, true);
      
      if (siteSettings.defaultMetaKeywords && siteSettings.defaultMetaKeywords.trim() !== '') {
        updateMetaTag('keywords', siteSettings.defaultMetaKeywords);
      } else {
        removeMetaTag('keywords');
      }

      if (siteSettings.siteOgImageUrl && siteSettings.siteOgImageUrl.trim() !== '') {
        updateMetaTag('og:image', siteSettings.siteOgImageUrl, true);
      } else {
        removeMetaTag('og:image', true);
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
        {/* Placeholder for other meta tags that will be dynamically added */}
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

