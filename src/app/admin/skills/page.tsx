import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AdminSkillsPage() {
  return (
    <div className="py-6">
       <div className="flex items-center justify-between">
        <PageHeader title="Manage Skills" subtitle="Update your skills, categories, and proficiency levels." className="py-0 md:py-0 pb-8 text-left" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </div>
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Skills management interface will be here.</p>
        <p className="text-sm text-muted-foreground mt-2">You'll be able to manage skill categories and individual skills.</p>
      </div>
    </div>
  );
}
