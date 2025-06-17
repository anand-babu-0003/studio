
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, UploadCloud, Search } from 'lucide-react';

// Note: This is a UI-only page for now. 
// Saving these settings would require:
// 1. Updating src/lib/data.json structure.
// 2. Creating server actions to write to data.json.
// 3. Modifying src/app/layout.tsx and potentially individual pages to consume these settings for metadata.

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Site Settings"
        subtitle="Manage general configuration, SEO, and other site-wide settings."
        className="py-0 text-left"
      />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Site Information</CardTitle>
            <CardDescription>
              Basic information about your website. These might be used in metadata or footers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" placeholder="Your Awesome Portfolio" defaultValue="AnandVerse Portfolio" disabled />
              <p className="text-xs text-muted-foreground">
                This would typically be used in the browser tab title.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Default Meta Description</Label>
              <Input id="siteDescription" placeholder="A brief description of your site for search engines." defaultValue="Personal portfolio of a passionate developer." disabled />
               <p className="text-xs text-muted-foreground">
                A general description for SEO purposes (can be overridden per page).
              </p>
            </div>
             <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Coming Soon!</AlertTitle>
              <AlertDescription>
                Saving these general settings is not yet implemented.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO & Favicon</CardTitle>
            <CardDescription>
              Manage Search Engine Optimization basics and your site's browser icon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="seoKeywords">Default Meta Keywords (Optional)</Label>
                <Input id="seoKeywords" placeholder="e.g., web developer, portfolio, react" disabled />
                <p className="text-xs text-muted-foreground">
                    Comma-separated keywords. Modern SEO largely ignores this, but can be included.
                </p>
            </div>
             <Alert variant="default" className="mt-4">
              <Search className="h-4 w-4" />
              <AlertTitle>SEO Management</AlertTitle>
              <AlertDescription>
                Advanced SEO settings (like sitemap generation, robots.txt management) would typically be handled via Next.js configurations or specialized services. Saving these basic meta tags is not yet implemented.
              </AlertDescription>
            </Alert>

            <Alert variant="default" className="mt-4">
              <UploadCloud className="h-4 w-4" />
              <AlertTitle>Favicon Management</AlertTitle>
              <AlertDescription>
                To change your site's favicon:
                <ol className="list-decimal list-inside mt-1 text-xs space-y-1">
                  <li>Create your desired favicon image (usually `favicon.ico`, but other formats like `.png` or `.svg` are also supported).</li>
                  <li>Replace the existing `public/favicon.ico` file (or other relevant icon files in `public/`) with your new icon.</li>
                  <li>Next.js automatically serves files from the `public` directory. You may need to clear your browser cache to see the changes.</li>
                </ol>
                Direct favicon upload via this admin panel is not currently supported.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
       <div className="flex justify-end mt-6">
          <Button disabled>Save All Settings (Not Implemented)</Button>
      </div>
    </div>
  );
}
