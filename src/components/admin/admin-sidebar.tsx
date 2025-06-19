
"use client"; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Sparkles, UserCircle, Settings, Inbox, FileQuestion } from 'lucide-react'; // Removed Megaphone
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  // { href: '/admin/announcements', label: 'Announcements', icon: Megaphone }, // Removed
  { href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Sparkles },
  { href: '/admin/about', label: 'About Page', icon: UserCircle },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings }, 
  { href: '/admin/not-found-settings', label: '404 Page', icon: FileQuestion },
];

export function AdminSidebarContent() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="">Admin Panel</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1 py-4">
          {adminNavItems.map((item) => {
            const isActive = (pathname === item.href) || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                  isActive && "bg-muted text-primary font-semibold"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden border-r bg-card md:block w-60 lg:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <AdminSidebarContent />
      </div>
    </aside>
  );
}
