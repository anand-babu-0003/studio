
"use client"; // Footer remains a client component for now

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { SocialLink, AboutMeData } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';

const mainNavItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

const defaultAboutMe: AboutMeData = {
    name: "AnandVerse", // Default name for footer brand
    title: "", bio: "", profileImage: "", dataAiHint: "", experience: [], education: [],
    email: "hello@example.com", // Default email
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
};


export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [aboutMeData, setAboutMeData] = useState<AboutMeData>(defaultAboutMe);

  useEffect(() => {
    async function fetchData() {
      const data = await getAboutMeDataAction();
      setAboutMeData(data || defaultAboutMe);
    }
    fetchData();
  }, []);

  const socialLinksToDisplay: SocialLink[] = [
    ...(aboutMeData.githubUrl ? [{ id: 'github', name: 'GitHub', url: aboutMeData.githubUrl, icon: Github }] : []),
    ...(aboutMeData.linkedinUrl ? [{ id: 'linkedin', name: 'LinkedIn', url: aboutMeData.linkedinUrl, icon: Linkedin }] : []),
    ...(aboutMeData.twitterUrl ? [{ id: 'twitter', name: 'Twitter', url: aboutMeData.twitterUrl, icon: Twitter }] : []),
    ...(aboutMeData.email ? [{ id: 'email', name: 'Email', url: `mailto:${aboutMeData.email}`, icon: Mail }] : []),
  ];


  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 mb-10">
          {/* Brand Section */}
          <div className="md:col-span-1 lg:col-span-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 mb-4 group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background rounded-md"
              aria-label="Back to homepage"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:text-accent transition-colors">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-headline text-xl font-bold text-primary group-hover:text-accent transition-colors">{aboutMeData.name ? aboutMeData.name.split(' ')[0] + 'Verse' : 'AnandVerse'}</span>
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
          {socialLinksToDisplay.length > 0 && (
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-4">
                Connect
              </h3>
              <div className="flex space-x-3">
                {socialLinksToDisplay.map((link) => (
                  <Link
                    key={link.id}
                    href={link.url!}
                    target={link.id === 'email' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full p-2 hover:bg-muted"
                  >
                    <link.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright Section */}
        <div className="mt-10 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {aboutMeData.name ? aboutMeData.name.split(' ')[0] + 'Verse' : 'AnandVerse'}. All rights reserved.
            <span className="mx-1">|</span>
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
