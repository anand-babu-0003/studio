
"use client";

import { useEffect, useState } from 'react'; 
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react'; 

import { notFoundPageAdminSchema, type NotFoundPageAdminFormData } from '@/lib/adminSchemas';
import { getNotFoundPageDataAction, updateNotFoundPageDataAction, type UpdateNotFoundPageDataFormState } from '@/actions/admin/notFoundActions';
import type { NotFoundPageData } from '@/lib/types';


const initialFormState: UpdateNotFoundPageDataFormState = { message: '', status: 'idle', errors: {}, data: undefined };

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
          Save 404 Page Settings
        </>
      )}
    </Button>
  );
}

// Client Component for the form
function NotFoundSettingsAdminClientPage({ initialData }: { initialData: NotFoundPageData }) {
  const { toast } = useToast();
  const [formState, formAction] = useActionState(updateNotFoundPageDataAction, initialFormState);

  const form = useForm<NotFoundPageAdminFormData>({
    resolver: zodResolver(notFoundPageAdminSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (formState.status === 'success' && formState.message) {
      toast({ title: "Success!", description: formState.message });
      if (formState.data) {
        form.reset(formState.data);
      }
    } else if (formState.status === 'error') {
      toast({ title: "Error Saving Settings", description: formState.message || "An error occurred.", variant: "destructive" });
      if (formState.data) {
        form.reset(formState.data);
      }
      if (formState.errors) {
        Object.entries(formState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            form.setError(fieldName as Path<NotFoundPageAdminFormData>, { type: 'server', message: fieldErrorMessages.join(', ') });
          }
        });
      }
    }
  }, [formState, toast, form]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="404 Page Settings"
        subtitle="Customize the content displayed on your 'Page Not Found' page."
        className="py-0 text-left"
      />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Customize 404 Page</CardTitle>
                <CardDescription>
                  Edit the text and image for your 404 error page. The large "404" number is static.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="heading" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Heading</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Oops! Page Not Found." /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">The primary title text below the large "404".</p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descriptive Message</FormLabel>
                    <FormControl><Textarea {...field} rows={3} placeholder="e.g., The page you're looking for seems to have ventured off the map." /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">The subtext message below the main heading.</p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="buttonText" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Go to Homepage" /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">The text for the button that links to the homepage.</p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="imageSrc" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input {...field} placeholder="https://placehold.co/400x300.png" /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">The URL for the main illustration on the 404 page.</p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint (Optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., lost map, confused robot" /></FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">A hint for AI image generation if you plan to use that for this image later.</p>
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter className="flex justify-end">
                <SubmitButton />
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

// Server Component to fetch initial data
export default async function AdminNotFoundSettingsPage() {
  const initialData = await getNotFoundPageDataAction();
  return <NotFoundSettingsAdminClientPage initialData={initialData} />;
}
