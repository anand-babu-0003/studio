
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Sparkles, UserCircle, SettingsIcon, Inbox, FileQuestion, Megaphone } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="py-6">
      <PageHeader title="Admin Dashboard" subtitle="Manage your website content from here." className="py-0 md:py-0 pb-8" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Manage Messages
            </CardTitle>
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">View and delete contact form submissions.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/admin/messages">
                Go to Messages <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Announcements
            </CardTitle>
            <Megaphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Publish site-wide announcements.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/admin/announcements">
                Manage Announcements <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Manage Portfolio
            </CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Add, edit, or remove portfolio projects.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/admin/portfolio">
                Go to Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Manage Skills
            </CardTitle>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Update your skills and proficiency levels.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/admin/skills">
                Go to Skills <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Manage About Page
            </CardTitle>
            <UserCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Edit your bio, experience, and education.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/admin/about">
                Go to About Page <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Site Settings
            </CardTitle>
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Configure site-wide settings and SEO.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/admin/settings">
                Manage Settings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              404 Page Settings
            </CardTitle>
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Customize your 'Page Not Found' content.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/admin/not-found-settings">
                Edit 404 Page <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
