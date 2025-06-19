
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
import { Info, Search, Save, Loader2 } from 'lucide-react'; // Changed UploadCloud to Info

import type { SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { getSiteSettingsAction, updateSiteSettingsAction, type UpdateSiteSettingsFormState } from '@/actions/admin/settingsActions';

const initialFormState: UpdateSiteSettingsFormState = { message: '', status: 'idle', errors: {}, data: undefined };

const defaultFormValues: SiteSettingsAdminFormData = {
  siteName: '',
  defaultMetaDescription: '',
  defaultMetaKeywords: '',
  siteOgImageUrl: '',
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
          form.reset({
            siteName: currentSettings.siteName || '',
            defaultMetaDescription: currentSettings.defaultMetaDescription || '',
            defaultMetaKeywords: currentSettings.defaultMetaKeywords || '',
            siteOgImageUrl: currentSettings.siteOgImageUrl || '',
          });
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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"> {/* Changed to 1 column for better layout */}
        <Form {...form}>
          <form action={settingsFormAction} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>General Site Information & SEO</CardTitle>
                <CardDescription>
                  Basic information and default SEO settings for your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="siteName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl><Input {...field} placeholder="Your Awesome Portfolio" /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Used in browser tab titles (e.g., Site Name | Page Title) and default Open Graph title.
                    </p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="defaultMetaDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Meta Description</FormLabel>
                    <FormControl><Input {...field} placeholder="A brief description of your site for search engines." /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      General SEO description (max 160 characters) and default Open Graph description.
                    </p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="defaultMetaKeywords" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Meta Keywords (Optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., web developer, portfolio, react" /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                        Comma-separated keywords. Modern SEO largely ignores this, but can be included.
                    </p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="siteOgImageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Open Graph Image URL (Optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="https://example.com/default-og-image.png" /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                        URL for a default image (e.g., 1200x630px) used when sharing your site on social media.
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
            <CardTitle>Favicon Management</CardTitle>
            <CardDescription>
              Information on managing your site's browser icon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mt-0">
              <Info className="h-4 w-4" /> {/* Changed icon here */}
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
