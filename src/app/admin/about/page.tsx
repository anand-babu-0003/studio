
"use client";

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

import { aboutMe as initialAboutMeData } from '@/lib/data';
import type { AboutMeData } from '@/lib/types'; 
import { updateAboutDataAction, type UpdateAboutDataFormState, aboutMeSchema } from '@/actions/admin/aboutActions';

const initialState: UpdateAboutDataFormState = {
  message: '',
  status: 'idle',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="mr-2 h-4 w-4" />
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save Changes'
      )}
    </Button>
  );
}

export default function AdminAboutPage() {
  const [state, formAction] = useFormState(updateAboutDataAction, initialState);
  const { toast } = useToast();

  const form = useForm<AboutMeData>({
    resolver: zodResolver(aboutMeSchema),
    defaultValues: initialAboutMeData, // Load initial data from lib/data.ts
  });

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      toast({
        title: "Success!",
        description: state.message,
      });
      // Optionally reset form if needed, or re-fetch data if it were from a DB
      // form.reset(state.data); // If action returned updated data
    } else if (state.status === 'error' && state.message) {
      toast({
        title: "Error Saving",
        description: state.message,
        variant: "destructive",
      });
      if (state.errors) {
        Object.entries(state.errors).forEach(([key, value]) => {
          if (value && value.length > 0) {
            form.setError(key as keyof AboutMeData, { type: 'server', message: value.join(', ') });
          }
        });
      }
    }
  }, [state, toast, form]);
  
  // Handle experience and education changes locally if needed for UI before save
  // For a real DB, these would also be part of the form submission or separate actions
  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const currentExperience = form.getValues('experience');
    const newExperience = [...currentExperience];
    // @ts-ignore - For nested structure, direct assignment works with react-hook-form
    newExperience[index][name as keyof typeof newExperience[0]] = value;
    form.setValue('experience', newExperience, { shouldValidate: true });
  };
  
  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const currentEducation = form.getValues('education');
    const newEducation = [...currentEducation];
    // @ts-ignore
    newEducation[index][name as keyof typeof newEducation[0]] = value;
    form.setValue('education', newEducation, { shouldValidate: true });
  };


  return (
    <div className="py-6">
      <Form {...form}>
        <form action={formAction} className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <PageHeader
              title="Manage About Page"
              subtitle="Edit your bio, profile, experience, and education details."
              className="py-0 md:py-0 text-left"
            />
            <SubmitButton />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Update your name, title, and profile picture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title / Tagline</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://placehold.co/400x400.png" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataAiHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image AI Hint</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., developer portrait" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Bio</CardTitle>
                <CardDescription>Tell your story. This will appear on your About page and homepage.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biography</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={10}
                          placeholder="Write about yourself..."
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Experience Section - Placeholder for full editing */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Manage your professional experience. (Full editing functionality is a next step)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch('experience').map((exp, index) => (
                  <div key={exp.id} className="p-4 border rounded-md space-y-2">
                    <FormField
                        control={form.control}
                        name={`experience.${index}.role`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`experience.${index}.company`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`experience.${index}.period`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Period</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`experience.${index}.description`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea {...field} rows={3} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => {
                  const newExperience = [...form.getValues('experience'), {id: `new_exp_${Date.now()}`, role: '', company: '', period: '', description: ''}];
                  form.setValue('experience', newExperience);
                }}>Add New Experience</Button>
              </CardContent>
            </Card>

            {/* Education Section - Placeholder for full editing */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Manage your academic background. (Full editing functionality is a next step)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch('education').map((edu, index) => (
                  <div key={edu.id} className="p-4 border rounded-md space-y-2">
                     <FormField
                        control={form.control}
                        name={`education.${index}.degree`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`education.${index}.institution`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Institution</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`education.${index}.period`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Period</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => {
                  const newEducation = [...form.getValues('education'), {id: `new_edu_${Date.now()}`, degree: '', institution: '', period: ''}];
                  form.setValue('education', newEducation);
                }}>Add New Education</Button>
              </CardContent>
            </Card>

          </div>
        </form>
      </Form>
    </div>
  );
}

    