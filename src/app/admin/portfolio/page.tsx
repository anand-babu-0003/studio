import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AdminPortfolioPage() {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Portfolio" subtitle="Add, edit, or delete your portfolio projects." className="py-0 md:py-0 pb-8 text-left" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>
      {/* Placeholder for portfolio management UI (e.g., a table of projects) */}
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Portfolio management interface with a table of projects will be here.</p>
        <p className="text-sm text-muted-foreground mt-2">You'll be able to Create, Read, Update, and Delete projects.</p>
      </div>
    </div>
  );
}
