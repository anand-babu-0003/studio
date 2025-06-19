
"use client"; 

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';
import FullScreenLoader from '@/components/shared/FullScreenLoader'; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClientSideLoggedIn, setIsClientSideLoggedIn] = useState<boolean | null>(null); 

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsClientSideLoggedIn(loggedInStatus);

    if (!loggedInStatus && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (loggedInStatus && pathname === '/admin/login') {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}<Toaster /></>;
  }

  if (isClientSideLoggedIn === null) {
    return <FullScreenLoader />;
  }

  if (isClientSideLoggedIn === false) {
      return <FullScreenLoader />;
  }

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

