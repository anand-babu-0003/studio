
import { PageHeader } from '@/components/shared/page-header';
import AdminAnnouncementPanel from '@/components/announcements/AdminAnnouncementPanel';

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Announcements" 
        subtitle="Publish and oversee site-wide announcements." 
        className="py-0 text-left" 
      />
      <AdminAnnouncementPanel />
      {/* Future: Add a list of past announcements with options to edit/delete */}
    </div>
  );
}
