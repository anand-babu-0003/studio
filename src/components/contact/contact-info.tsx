import Link from 'next/link';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';
import type { SocialLink } from '@/lib/types';

const socialLinks: SocialLink[] = [
  { id: 'email', name: 'Email', url: 'mailto:hello@example.com', icon: Mail },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile', icon: Linkedin },
  { id: 'github', name: 'GitHub', url: 'https://github.com/yourusername', icon: Github },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com/yourusername', icon: Twitter },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-xl font-semibold text-primary mb-2">Direct Contact</h3>
        <Link
          href="mailto:hello@example.com"
          className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors group"
        >
          <Mail className="h-5 w-5 text-primary group-hover:text-accent" />
          <span>hello@example.com</span>
        </Link>
      </div>
      
      <div>
        <h3 className="font-headline text-xl font-semibold text-primary mb-3">Find me on Social Media</h3>
        <div className="space-y-3">
          {socialLinks.filter(link => link.id !== 'email').map((link) => (
            <Link
              key={link.id}
              href={link.url}
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

      <div>
         <h3 className="font-headline text-xl font-semibold text-primary mb-2">Location</h3>
         <p className="text-foreground/80">Planet Earth (Usually coding from my desk)</p>
      </div>
    </div>
  );
}
