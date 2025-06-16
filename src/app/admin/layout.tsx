
"use client"; // Required for hooks

import type React from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster'; // Added for admin panel toasts

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Ensure this code runs only on the client-side
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

      if (!isLoggedIn && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else if (isLoggedIn && pathname === '/admin/login') {
        router.replace('/admin/dashboard');
      }
    }
  }, [pathname, router]);
  
  // If not logged in and not on login page, render nothing or a loader to prevent flicker
  if (typeof window !== 'undefined' && localStorage.getItem('isAdminLoggedIn') !== 'true' && pathname !== '/admin/login') {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
             {/* Optional: Add a loader here */}
             <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    ); 
  }


  // Hide admin layout entirely if on the login page
  if (pathname === '/admin/login') {
    return <>{children}<Toaster /></>; // Still need Toaster for login page errors
  }

  return (
    <div className="flex h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster /> {/* Ensure Toaster is available for admin panel actions */}
    </div>
  );
}
