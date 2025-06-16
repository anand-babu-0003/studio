
"use client";

import { useEffect } from 'react';
import { useActionState } from 'react'; // Changed from 'react-dom' and useFormState
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

import { aboutMe as initialAboutMeData } from '@/lib/data';
import type { AboutMeData, Experience, Education } from '@/lib/types'; 
import { updateAboutDataAction, type UpdateAboutDataFormState } from '@/actions/admin/aboutActions';
import { aboutMeSchema } from '@/lib/adminSchemas'; 

const initialState: UpdateAboutDataFormState = {
  message: '',
  status: 'idle',
  errors: {},
  data: undefined, 
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
  const [state, formAction] = useActionState(updateAboutDataAction, initialState); // Changed from useFormState
  const { toast } = useToast();

  const form = useForm<AboutMeData>({
    resolver: zodResolver(aboutMeSchema),
    defaultValues: {
      ...initialAboutMeData,
      experience: initialAboutMeData.experience || [], 
      education: initialAboutMeData.education || [],
    },
  });

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      toast({
        title: "Success!",
        description: state.message,
      });
      if (state.data) {
        console.log("AdminAboutPage: Form will reset with this data:", JSON.stringify(state.data, null, 2));
        // Ensure arrays are always present for reset
        const transformedData = {
          ...state.data,
          experience: state.data.experience || [],
          education: state.data.education || [],
        };
        form.reset(transformedData);
      }
    } else if (state.status === 'error' && state.message) {
      toast({
        title: "Error Saving",
        description: state.message,
        variant: "destructive",
      });
      if (state.errors) {
        const allErrors = { ...state.errors };
        
        (Object.keys(form.getValues()) as Array<keyof AboutMeData>).forEach(key => {
          if (allErrors[key] && Array.isArray(allErrors[key])) {
            form.setError(key, { type: 'server', message: (allErrors[key] as string[]).join(', ') });
            delete allErrors[key]; 
          }
        });

        Object.entries(allErrors).forEach(([key, value]) => {
          if (value && Array.isArray(value) && value.length > 0) {
            form.setError(key as any, { type: 'server', message: value.join(', ') });
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
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Manage your professional experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(form.watch('experience') || []).map((exp, index) => (
                  <Card key={exp.id} className="p-4 space-y-3">
                    <input type="hidden" {...form.register(`experience.${index}.id`)} defaultValue={exp.id} />
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
                                <FormLabel>Period (e.g., 2020 - Present)</FormLabel>
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
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>Remove Experience</Button>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addExperience}>Add New Experience</Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Manage your academic background.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(form.watch('education') || []).map((edu, index) => (
                  <Card key={edu.id} className="p-4 space-y-3">
                     <input type="hidden" {...form.register(`education.${index}.id`)} defaultValue={edu.id} />
                     <FormField
                        control={form.control}
                        name={`education.${index}.degree`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Degree / Certificate</FormLabel>
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
                                <FormLabel>Period (e.g., 2018 - 2022)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>Remove Education</Button>
                  </Card>
                ))}
                 <Button type="button" variant="outline" onClick={addEducation}>Add New Education</Button>
              </CardContent>
            </Card>

          </div>
        </form>
      </Form>
    </div>
  );
}
