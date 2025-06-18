
"use client"; 

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { SocialLink, AboutMeData } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { Button } from '@/components/ui/button'; 

const mainNavItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

// Default AboutMeData specifically for footer's needs if fetch fails or before client mounts
// Only include fields directly used by the footer for its fallbacks.
const defaultAboutMeForFooter: Pick<AboutMeData, 'name' | 'email' | 'githubUrl' | 'linkedinUrl' | 'twitterUrl'> = {
    name: "B.Anand", // To be used in "by B.Anand"
    email: "hello@example.com", 
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
};


export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [aboutMeData, setAboutMeData] = useState<AboutMeData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear()); // Ensure year is client-side

    async function fetchData() {
      try {
        const data = await getAboutMeDataAction();
        setAboutMeData(data);
      } catch (error) {
        console.error("Failed to fetch about me data for footer:", error);
        // Data will remain null, displayedAboutMe will use defaultAboutMeForFooter
      }
    }
    fetchData();
  }, []);

  // Use fetched data if available and mounted, otherwise use defaults
  const displayedAboutMe = isMounted && aboutMeData ? aboutMeData : defaultAboutMeForFooter;

  const socialLinksToDisplay: SocialLink[] = [
    ...(displayedAboutMe.githubUrl ? [{ id: 'github', name: 'GitHub', url: displayedAboutMe.githubUrl, icon: Github }] : []),
    ...(displayedAboutMe.linkedinUrl ? [{ id: 'linkedin', name: 'LinkedIn', url: displayedAboutMe.linkedinUrl, icon: Linkedin }] : []),
    ...(displayedAboutMe.twitterUrl ? [{ id: 'twitter', name: 'Twitter', url: displayedAboutMe.twitterUrl, icon: Twitter }] : []),
    ...(displayedAboutMe.email ? [{ id: 'email', name: 'Email', url: `mailto:${displayedAboutMe.email}`, icon: Mail }] : []),
  ];


  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 mb-10">
          {/* Brand Section */}
          <div className="md:col-span-1 lg:col-span-2">
            <Link 
              href="/admin/dashboard" // Static link to admin
              className="inline-flex items-center gap-2 mb-4 group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background rounded-md"
              aria-label="Go to Admin Panel" // Static aria-label
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:text-accent transition-colors">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-headline text-xl font-bold text-primary group-hover:text-accent transition-colors">
                AnandVerse {/* Static Brand Name */}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Crafting digital experiences, one line of code at a time. Passionate about building intuitive and performant web solutions.
            </p>
          </div>

          {/* Navigation Links Section */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Section */}
          {(isMounted && socialLinksToDisplay.length > 0) && ( // Only render if mounted and links exist
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-4">
                Connect
              </h3>
              <div className="flex items-center space-x-2">
                {socialLinksToDisplay.map((link) => (
                  <Button 
                    key={link.id}
                    asChild 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-primary hover:bg-muted rounded-full focus:ring-offset-background"
                    aria-label={link.name}
                  >
                    <Link
                      href={link.url!}
                      target={link.id === 'email' ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                    >
                      <span><link.icon className="h-5 w-5" /></span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright Section */}
        <div className="mt-10 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {isMounted ? currentYear : new Date().getFullYear()}{' '}
            AnandVerse. All rights reserved. {/* Static Brand Name */}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            💻 Made with caffeine, code, and mild chaos — by{' '}
            {isMounted ? (
              <Button asChild variant="link" className="p-0 h-auto text-sm text-primary hover:text-accent focus:outline-none focus:ring-1 focus:ring-ring rounded">
                <Link href="/admin/dashboard">
                 <span>{displayedAboutMe.name || 'B.Anand'}</span>
                </Link>
              </Button>
            ) : (
              defaultAboutMeForFooter.name // Server render / initial client render
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

