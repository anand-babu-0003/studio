
"use client";

import { useEffect } from 'react';
import { useActionState, useFormState as useActionStateReactDom } from 'react'; // useActionState is preferred from React for newer versions
import { useFormStatus } from 'react-dom';
import { useForm, type Path, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Info, UploadCloud, Search, Save, Loader2 } from 'lucide-react';

import type { SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { getSiteSettingsAction, updateSiteSettingsAction, type UpdateSiteSettingsFormState } from '@/actions/admin/settingsActions';

const initialFormState: UpdateSiteSettingsFormState = { message: '', status: 'idle', errors: {}, data: undefined };

const defaultFormValues: SiteSettingsAdminFormData = {
  siteName: '',
  defaultMetaDescription: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </>
      )}
    </Button>
  );
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settingsState, settingsFormAction] = useActionState(updateSiteSettingsAction, initialFormState);

  const form = useForm<SiteSettingsAdminFormData>({
    resolver: zodResolver(siteSettingsAdminSchema),
    defaultValues: defaultFormValues, 
  });

  useEffect(() => {
    async function fetchInitialSettings() {
      try {
        const currentSettings = await getSiteSettingsAction();
        if (currentSettings) {
          form.reset(currentSettings);
        }
      } catch (error) {
        console.error("Failed to fetch initial site settings:", error);
        toast({
          title: "Error",
          description: "Could not load current site settings.",
          variant: "destructive",
        });
      }
    }
    fetchInitialSettings();
  }, [form, toast]);

  useEffect(() => {
    if (settingsState.status === 'success' && settingsState.message) {
      toast({ title: "Success!", description: settingsState.message });
      if (settingsState.data) {
        form.reset(settingsState.data);
      }
    } else if (settingsState.status === 'error') {
      const errorMessage = (typeof settingsState.message === 'string' && settingsState.message.trim() !== '')
        ? settingsState.message : "An error occurred saving site settings.";
      toast({ title: "Error Saving Settings", description: errorMessage, variant: "destructive" });
      
      const dataToResetWith = settingsState.data ? settingsState.data : form.getValues();
      form.reset(dataToResetWith);
      
      if (settingsState.errors && typeof settingsState.errors === 'object') {
        Object.entries(settingsState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            form.setError(fieldName as Path<SiteSettingsAdminFormData>, { type: 'server', message: fieldErrorMessages.join(', ') });
          }
        });
      }
    }
  }, [settingsState, toast, form]);
  

  return (
    <div className="space-y-8">
      <PageHeader
        title="Site Settings"
        subtitle="Manage general configuration, SEO, and other site-wide settings."
        className="py-0 text-left"
      />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Form {...form}>
          <form action={settingsFormAction} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>General Site Information</CardTitle>
                <CardDescription>
                  Basic information about your website. These will be used for the site title and default meta tags.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="siteName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl><Input {...field} placeholder="Your Awesome Portfolio" /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      This will be used in the browser tab title (e.g., Site Name | Page Title).
                    </p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="defaultMetaDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Meta Description</FormLabel>
                    <FormControl><Input {...field} placeholder="A brief description of your site for search engines." /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      A general description for SEO purposes (max 160 characters).
                    </p>
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter className="flex justify-end">
                <SubmitButton />
              </CardFooter>
            </Card>
          </form>
        </Form>

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
                    Comma-separated keywords. Modern SEO largely ignores this, but can be included. (Not implemented)
                </p>
            </div>
             <Alert variant="default" className="mt-4">
              <Search className="h-4 w-4" />
              <AlertTitle>Advanced SEO</AlertTitle>
              <AlertDescription>
                Advanced SEO settings (like sitemap generation, robots.txt management) would typically be handled via Next.js configurations or specialized services. The general settings above cover the basics.
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
    </div>
  );
}
