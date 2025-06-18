
"use client"; // Required for hooks

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster'; // Added for admin panel toasts
import { Loader2 } from 'lucide-react'; // For loading spinner

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClientSideLoggedIn, setIsClientSideLoggedIn] = useState<boolean | null>(null); // null means unresolved

  useEffect(() => {
    // This effect runs only on the client side after hydration
    const loggedInStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsClientSideLoggedIn(loggedInStatus);

    if (!loggedInStatus && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (loggedInStatus && pathname === '/admin/login') {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router]);
  
  // Show a loader until client-side auth check is complete
  if (isClientSideLoggedIn === null && pathname !== '/admin/login') {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
             <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    ); 
  }

  // If client-side check determined not logged in, and not on login page, also show loader (or null)
  // as router.replace takes a moment.
  if (isClientSideLoggedIn === false && pathname !== '/admin/login') {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
             <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    );
  }


  // Hide admin layout entirely if on the login page
  // This check can remain as it doesn't rely on localStorage for rendering structure
  if (pathname === '/admin/login') {
    return <>{children}<Toaster /></>; // Still need Toaster for login page errors
  }

  // If logged in (or login page), render the full admin layout
  return (
    <div className="flex h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto"> {/* Adjusted padding */}
          {children}
        </main>
      </div>
      <Toaster /> {/* Ensure Toaster is available for admin panel actions */}
    </div>
  );
}
