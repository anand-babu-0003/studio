import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { SocialLink } from '@/lib/types';

const socialLinks: SocialLink[] = [
  { id: 'github', name: 'GitHub', url: 'https://github.com', icon: Github },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com', icon: Twitter },
  { id: 'email', name: 'Email', url: 'mailto:hello@example.com', icon: Mail },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} VermaVerse. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1"
              >
                <link.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
