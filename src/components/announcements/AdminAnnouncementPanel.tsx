
"use client";

import { useEffect } from 'react';
import { useActionState } from 'react'; // Corrected import
import { useFormStatus } from 'react-dom'; // This import is correct
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitAnnouncementAction, type AnnouncementFormState } from '@/actions/admin/announcementActions';
import { Loader2, Send } from 'lucide-react';

const announcementSchema = z.object({
  message: z.string().min(5, { message: "Announcement message must be at least 5 characters." }).max(500, { message: "Announcement cannot exceed 500 characters." }),
});
type AnnouncementFormData = z.infer<typeof announcementSchema>;

const initialFormState: AnnouncementFormState = { message: '', status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Publish Announcement
        </>
      )}
    </Button>
  );
}

export default function AdminAnnouncementPanel() {
  const [state, formAction] = useActionState(submitAnnouncementAction, initialFormState);
  const { toast } = useToast();

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    if (state.status === 'success') {
      toast({ title: "Success!", description: state.message });
      form.reset(); // Reset form on successful submission
    } else if (state.status === 'error' && state.message) {
      toast({ title: "Error", description: state.message, variant: "destructive" });
      if (state.errors?.message) {
        form.setError("message", { type: "server", message: state.errors.message.join(', ') });
      }
    }
  }, [state, toast, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish New Announcement</CardTitle>
        <CardDescription>
          Type your announcement below. It will appear live to users.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form action={formAction}>
          <CardContent>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="announcement-message">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      id="announcement-message"
                      placeholder="Enter your announcement here..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

