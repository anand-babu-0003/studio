
"use client"; 

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { SocialLink, AboutMeData } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'; 
import { defaultAboutMeDataForClient } from '@/lib/data'; 

const mainNavItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

interface FooterProps {
  aboutMeData: AboutMeData | null; 
}

export default function Footer({ aboutMeData }: FooterProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear()); 
  }, []);

  const displayedAboutMe = isMounted && aboutMeData ? aboutMeData : defaultAboutMeDataForClient;

  const socialLinksToDisplay: SocialLink[] = [
    ...(displayedAboutMe.githubUrl ? [{ id: 'github', name: 'GitHub', url: displayedAboutMe.githubUrl, icon: Github }] : []),
    ...(displayedAboutMe.linkedinUrl ? [{ id: 'linkedin', name: 'LinkedIn', url: displayedAboutMe.linkedinUrl, icon: Linkedin }] : []),
    ...(displayedAboutMe.twitterUrl ? [{ id: 'twitter', name: 'Twitter', url: displayedAboutMe.twitterUrl, icon: Twitter }] : []),
    ...(displayedAboutMe.email ? [{ id: 'email', name: 'Email', url: `mailto:${displayedAboutMe.email}`, icon: Mail }] : []),
  ].filter(link => link.url && link.url.trim() !== '');


  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 mb-10">
          <div className="md:col-span-1 lg:col-span-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 mb-4 group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background rounded-md"
              aria-label="Go to Homepage" 
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:text-accent transition-colors">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-headline text-xl font-bold text-primary group-hover:text-accent transition-colors">
                {displayedAboutMe.name ? `${displayedAboutMe.name.split(' ')[0]}'s Verse` : "VermaVerse"} 
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Crafting digital experiences, one line of code at a time. Passionate about building intuitive and performant web solutions.
            </p>
          </div>

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

          {socialLinksToDisplay.length > 0 && ( 
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

        <div className="mt-10 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear}{' '}
            {displayedAboutMe.name || defaultAboutMeDataForClient.name}. All rights reserved. 
          </p>
          <p className="text-sm text-muted-foreground mt-2">
             Built with Next.js, Tailwind CSS, and Firebase by{' '}
            {displayedAboutMe.name ? (
              <Button asChild variant="link" className="p-0 h-auto text-sm text-primary hover:text-accent focus:outline-none focus:ring-1 focus:ring-ring rounded">
                <Link href={displayedAboutMe.githubUrl || "/"} target="_blank" rel="noopener noreferrer">
                 <span>{displayedAboutMe.name}</span>
                </Link>
              </Button>
            ) : (
              defaultAboutMeDataForClient.name 
            )}
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
