
"use client";

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

import { aboutMe as initialAboutMeDataFromLib } from '@/lib/data';
import type { AboutMeData, Experience, Education } from '@/lib/types';
import { updateAboutDataAction, type UpdateAboutDataFormState } from '@/actions/admin/aboutActions';
import { aboutMeSchema } from '@/lib/adminSchemas';

const initialState: UpdateAboutDataFormState = {
  message: '',
  status: 'idle',
  errors: {},
  data: undefined,
};

interface SubmitButtonProps {
  form?: string; // HTML form attribute to associate button with a form
}

function SubmitButton({ form: formId }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} form={formId}>
      <Save className="mr-2 h-4 w-4" />
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save All Changes'
      )}
    </Button>
  );
}

export default function AdminAboutPage() {
  const [state, formAction] = useActionState(updateAboutDataAction, initialState);
  const { toast } = useToast();

  const form = useForm<AboutMeData>({
    resolver: zodResolver(aboutMeSchema),
    defaultValues: {
      ...initialAboutMeDataFromLib,
      experience: initialAboutMeDataFromLib.experience || [],
      education: initialAboutMeDataFromLib.education || [],
      email: initialAboutMeDataFromLib.email || '',
      linkedinUrl: initialAboutMeDataFromLib.linkedinUrl || '',
      githubUrl: initialAboutMeDataFromLib.githubUrl || '',
      twitterUrl: initialAboutMeDataFromLib.twitterUrl || '',
    },
  });

  useEffect(() => {
    // Helper to transform data for form.reset
    const prepareDataForForm = (data: AboutMeData): AboutMeData => {
      return {
        ...data,
        experience: data.experience || [],
        education: data.education || [],
        email: data.email || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        twitterUrl: data.twitterUrl || '',
      };
    };
    
    if (state.status === 'success' && state.message) {
      toast({
        title: "Success!",
        description: state.message,
      });
      if (state.data) {
        form.reset(prepareDataForForm(state.data));
      }
    } else if (state.status === 'error') {
      console.error("AdminAboutPage: Error from server action (raw object):", state);
      console.error("AdminAboutPage: Error from server action (JSON.stringify):", JSON.stringify(state));

      const errorMessage = typeof state.message === 'string' && state.message.trim() !== ''
        ? state.message
        : "An unspecified error occurred. Please check server logs for more details.";
      toast({
        title: "Error Saving",
        description: errorMessage,
        variant: "destructive",
      });

      // If server returned data (even if it's the erroneous data), reset form with it
      if (state.data) {
        console.log("AdminAboutPage: Resetting form with data returned from server on error:", state.data);
        form.reset(prepareDataForForm(state.data));
      }

      if (state.errors) {
        console.log("AdminAboutPage: Server returned errors, attempting to set on form:", JSON.stringify(state.errors, null, 2));
        Object.entries(state.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            console.log(`AdminAboutPage: Calling form.setError for field: '${fieldName}', message: '${fieldErrorMessages.join(', ')}'`);
            form.setError(fieldName as Path<AboutMeData>, {
              type: 'server',
              message: fieldErrorMessages.join(', '),
            });
          }
        });
      }
    }
  }, [state, toast, form]);

  const addExperience = () => {
    const currentExperience = form.getValues('experience') || [];
    form.setValue('experience', [...currentExperience, { id: `new_exp_${Date.now()}`, role: '', company: '', period: '', description: '' }], { shouldValidate: false, shouldDirty: true });
  };

  const removeExperience = (index: number) => {
    const currentExperience = form.getValues('experience') || [];
    form.setValue('experience', currentExperience.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
  };

  const addEducation = () => {
    const currentEducation = form.getValues('education') || [];
    form.setValue('education', [...currentEducation, { id: `new_edu_${Date.now()}`, degree: '', institution: '', period: '' }], { shouldValidate: false, shouldDirty: true });
  };

  const removeEducation = (index: number) => {
    const currentEducation = form.getValues('education') || [];
    form.setValue('education', currentEducation.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Manage About Page"
          subtitle="Edit your profile, bio, contact, experience, and education details."
          className="py-0 text-left"
        />
        <SubmitButton form="about-form" />
      </div>
      
      <Form {...form}>
        <form id="about-form" action={formAction} className="space-y-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profile & Bio</TabsTrigger>
              <TabsTrigger value="contact">Contact & Socials</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile & Biography</CardTitle>
                  <CardDescription>Update your name, title, profile picture and main biography.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                        <FormControl><Input {...field} /></FormControl>
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
                        <FormControl><Input {...field} placeholder="https://placehold.co/400x400.png" /></FormControl>
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
                        <FormControl><Input {...field} placeholder="e.g., developer portrait" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biography</FormLabel>
                        <FormControl><Textarea rows={10} placeholder="Write about yourself..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Social Links</CardTitle>
                  <CardDescription>Update your email and social media URLs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="your.email@example.com" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile URL</FormLabel>
                      <FormControl><Input {...field} placeholder="https://linkedin.com/in/yourprofile" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="githubUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile URL</FormLabel>
                      <FormControl><Input {...field} placeholder="https://github.com/yourusername" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Profile URL (Optional)</FormLabel>
                      <FormControl><Input {...field} placeholder="https://twitter.com/yourusername" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Experience</CardTitle>
                  <CardDescription>Manage your work history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(form.watch('experience') || []).map((exp, index) => (
                    <Card key={exp.id} className="p-4 space-y-3 bg-muted/30">
                      <input type="hidden" {...form.register(`experience.${index}.id`)} defaultValue={exp.id} />
                      <FormField control={form.control} name={`experience.${index}.role`} render={({ field }) => (
                        <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`experience.${index}.period`} render={({ field }) => (
                        <FormItem><FormLabel>Period (e.g., 2020 - Present)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>Remove Experience</Button>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addExperience}>Add New Experience</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Background</CardTitle>
                  <CardDescription>Manage your education history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(form.watch('education') || []).map((edu, index) => (
                    <Card key={edu.id} className="p-4 space-y-3 bg-muted/30">
                      <input type="hidden" {...form.register(`education.${index}.id`)} defaultValue={edu.id} />
                      <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                        <FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (
                        <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`education.${index}.period`} render={({ field }) => (
                        <FormItem><FormLabel>Period (e.g., 2018 - 2022)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>Remove Education</Button>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addEducation}>Add New Education</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
