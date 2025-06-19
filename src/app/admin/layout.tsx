
"use client"; // Required for hooks

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClientSideLoggedIn, setIsClientSideLoggedIn] = useState<boolean | null>(null); // null: unresolved, true: logged in, false: not logged in

  useEffect(() => {
    // This effect runs only on the client side after hydration
    const loggedInStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsClientSideLoggedIn(loggedInStatus);

    if (!loggedInStatus && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (loggedInStatus && pathname === '/admin/login') {
      // If somehow on login page while logged in, redirect to dashboard
      router.replace('/admin/dashboard');
    }
  }, [pathname, router]);

  // If on the login page, render children directly without the admin layout wrapper.
  // isClientSideLoggedIn check is not strictly needed here because the content of login page
  // itself doesn't depend on this state, but it's consistent.
  if (pathname === '/admin/login') {
    return <>{children}<Toaster /></>;
  }

  // If auth status is still being determined, show a loader.
  // This prevents flashing the admin layout or redirecting prematurely.
  if (isClientSideLoggedIn === null) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
             <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
    );
  }

  // If determined not logged in (and we are not on the login page, which is handled above),
  // the redirect to /admin/login should be in progress. Showing a loader here is a good UX.
  if (isClientSideLoggedIn === false) {
      return (
          <div className="flex h-screen w-screen items-center justify-center bg-background">
               <Loader2 className="animate-spin h-12 w-12 text-primary" />
          </div>
      );
  }

  // If client-side check confirms logged in, render the full admin layout.
  return (
    <div className="flex h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
