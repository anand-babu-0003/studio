
import Link from 'next/link';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';
import type { SocialLink, AboutMeData } from '@/lib/types';

interface ContactInfoProps {
  aboutMeData: AboutMeData;
}

export function ContactInfo({ aboutMeData }: ContactInfoProps) {
  const { 
    email = 'your-email@example.com', // Default fallback
    linkedinUrl, 
    githubUrl, 
    twitterUrl 
  } = aboutMeData;

  const definedSocialLinks: SocialLink[] = [
    // Email is handled separately below as "Direct Contact"
    ...(linkedinUrl ? [{ id: 'linkedin', name: 'LinkedIn', url: linkedinUrl, icon: Linkedin }] : []),
    ...(githubUrl ? [{ id: 'github', name: 'GitHub', url: githubUrl, icon: Github }] : []),
    ...(twitterUrl ? [{ id: 'twitter', name: 'Twitter', url: twitterUrl, icon: Twitter }] : []),
  ];

  return (
    <div className="space-y-6">
      {email && (
        <div>
          <h3 className="font-headline text-xl font-semibold text-primary mb-2">Direct Contact</h3>
          <Link
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors group"
          >
            <Mail className="h-5 w-5 text-primary group-hover:text-accent" />
            <span>{email}</span>
          </Link>
        </div>
      )}
      
      {definedSocialLinks.length > 0 && (
        <div>
          <h3 className="font-headline text-xl font-semibold text-primary mb-3">Find me on Social Media</h3>
          <div className="space-y-3">
            {definedSocialLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url!} // URL is guaranteed to be present due to filter
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors group p-2 rounded-md hover:bg-primary/5"
              >
                <link.icon className="h-6 w-6 text-primary group-hover:text-accent" />
                <span className="text-md">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
         <h3 className="font-headline text-xl font-semibold text-primary mb-2">Location</h3>
         <p className="text-foreground/80">Planet Earth (Usually coding from my desk)</p>
      </div>
    </div>
  );
}
