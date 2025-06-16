import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function AdminAboutPage() {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage About Page" subtitle="Edit your bio, experience, and education details." className="py-0 md:py-0 pb-8 text-left" />
        <Button>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">About page content management form will be here.</p>
         <p className="text-sm text-muted-foreground mt-2">You'll be able to edit text areas for bio, and manage experience/education entries.</p>
      </div>
    </div>
  );
}
