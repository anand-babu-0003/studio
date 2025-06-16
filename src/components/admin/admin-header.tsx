import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { AdminSidebarContent } from './admin-sidebar'; // Re-use sidebar content for mobile


export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <AdminSidebarContent />
        </SheetContent>
      </Sheet>
      {/* Placeholder for breadcrumbs or search */}
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            View Site
          </Link>
        </Button>
        {/* Placeholder for user menu/logout in future */}
        {/* <Button variant="outline" size="icon"> <User className="h-5 w-5" /> </Button> */}
      </div>
    </header>
  );
}
