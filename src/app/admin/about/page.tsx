
"use client";

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, type Path, type SubmitHandler } from 'react-hook-form';
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
import { 
  updateAboutDataAction, type UpdateAboutDataFormState,
  updateProfileBioDataAction, type UpdateProfileBioDataFormState
} from '@/actions/admin/aboutActions';
import { aboutMeSchema, profileBioSchema, type ProfileBioData } from '@/lib/adminSchemas';

// Initial state for the (soon to be deprecated) full form action
const initialFullFormState: UpdateAboutDataFormState = {
  message: '',
  status: 'idle',
  errors: {},
  data: undefined,
};

// Initial state for the new Profile & Bio form action
const initialProfileBioFormState: UpdateProfileBioDataFormState = {
  message: '',
  status: 'idle',
  errors: {},
  data: undefined,
};

interface SubmitButtonProps {
  form?: string; 
  text?: string;
}

function SubmitButton({ form: formId, text = "Save Changes" }: SubmitButtonProps) {
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
        text
      )}
    </Button>
  );
}

// Prepare data for the full AboutMeData structure
const prepareFullAboutMeDataForForm = (data?: AboutMeData): AboutMeData => {
  if (!data) {
    return {
      name: '', title: '', bio: '', profileImage: '', dataAiHint: '',
      experience: [], education: [], email: '', linkedinUrl: '', githubUrl: '', twitterUrl: '',
    };
  }
  return {
    name: data.name || '',
    title: data.title || '',
    bio: data.bio || '',
    profileImage: data.profileImage || '',
    dataAiHint: data.dataAiHint || '',
    experience: (data.experience || []).map(exp => ({ ...exp, role: exp.role || '', company: exp.company || '', period: exp.period || '', description: exp.description || '' })),
    education: (data.education || []).map(edu => ({ ...edu, degree: edu.degree || '', institution: edu.institution || '', period: edu.period || '' })),
    email: data.email || '',
    linkedinUrl: data.linkedinUrl || '',
    githubUrl: data.githubUrl || '',
    twitterUrl: data.twitterUrl || '',
  };
};

// Prepare data for just the ProfileBioData structure
const prepareProfileBioDataForForm = (data?: Partial<ProfileBioData>): ProfileBioData => {
  if (!data) {
    return { name: '', title: '', bio: '', profileImage: '', dataAiHint: '' };
  }
  return {
    name: data.name || '',
    title: data.title || '',
    bio: data.bio || '',
    profileImage: data.profileImage || '',
    dataAiHint: data.dataAiHint || '',
  };
};


export default function AdminAboutPage() {
  const { toast } = useToast();

  // Form and state for Profile & Bio
  const [profileBioState, profileBioFormAction] = useActionState(updateProfileBioDataAction, initialProfileBioFormState);
  const profileBioForm = useForm<ProfileBioData>({
    resolver: zodResolver(profileBioSchema),
    defaultValues: prepareProfileBioDataForForm(initialAboutMeDataFromLib),
  });

  useEffect(() => {
    if (profileBioState.status === 'success' && profileBioState.message) {
      toast({ title: "Success!", description: profileBioState.message });
      if (profileBioState.data) {
        profileBioForm.reset(prepareProfileBioDataForForm(profileBioState.data));
      }
    } else if (profileBioState.status === 'error') {
      const errorMessage = (typeof profileBioState.message === 'string' && profileBioState.message.trim() !== '')
        ? profileBioState.message : "An error occurred.";
      toast({ title: "Error Saving Profile & Bio", description: errorMessage, variant: "destructive" });
      
      if (profileBioState.data) {
        profileBioForm.reset(prepareProfileBioDataForForm(profileBioState.data));
      } else {
         profileBioForm.reset(prepareProfileBioDataForForm(profileBioForm.getValues()));
      }
      if (profileBioState.errors && typeof profileBioState.errors === 'object') {
        Object.entries(profileBioState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            profileBioForm.setError(fieldName as Path<ProfileBioData>, { type: 'server', message: fieldErrorMessages.join(', ') });
          }
        });
      }
    }
  }, [profileBioState, toast, profileBioForm]);


  // --- TEMPORARY: Full form logic (to be refactored/removed) ---
  // This form will eventually be split or its action logic adapted for other tabs
  const [fullFormState, fullFormAction] = useActionState(updateAboutDataAction, initialFullFormState);
  const fullForm = useForm<AboutMeData>({
    resolver: zodResolver(aboutMeSchema),
    defaultValues: prepareFullAboutMeDataForForm(initialAboutMeDataFromLib), 
  });

   useEffect(() => {
    if (fullFormState.status === 'success' && fullFormState.message) {
      toast({ title: "Success!", description: fullFormState.message });
      if (fullFormState.data) {
        fullForm.reset(prepareFullAboutMeDataForForm(fullFormState.data));
        // Also update the profileBioForm if the full save was successful and affected its fields
        profileBioForm.reset(prepareProfileBioDataForForm(fullFormState.data)); 
      }
    } else if (fullFormState.status === 'error') {
      const errorMessage = (typeof fullFormState.message === 'string' && fullFormState.message.trim() !== '')
        ? fullFormState.message : "An unspecified error occurred.";
      toast({ title: "Error Saving Data", description: errorMessage, variant: "destructive" });

      if (fullFormState.data) {
        fullForm.reset(prepareFullAboutMeDataForForm(fullFormState.data));
        profileBioForm.reset(prepareProfileBioDataForForm(fullFormState.data));
      } else {
        fullForm.reset(prepareFullAboutMeDataForForm(fullForm.getValues()));
        profileBioForm.reset(prepareProfileBioDataForForm(fullForm.getValues()));
      }

      if (fullFormState.errors && typeof fullFormState.errors === 'object' && Object.keys(fullFormState.errors).length > 0) {
        Object.entries(fullFormState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            fullForm.setError(fieldName as Path<AboutMeData>, { type: 'server', message: fieldErrorMessages.join(', ') });
             // If the error is for a field also in profileBioForm, set error there too.
            if (fieldName in profileBioForm.getValues()) {
                 profileBioForm.setError(fieldName as Path<ProfileBioData>, { type: 'server', message: fieldErrorMessages.join(', ') });
            }
          }
        });
      }
    }
  }, [fullFormState, toast, fullForm, profileBioForm]);


  const addExperience = () => {
    const currentExperience = fullForm.getValues('experience') || [];
    fullForm.setValue('experience', [...currentExperience, { id: `new_exp_${Date.now()}`, role: '', company: '', period: '', description: '' }], { shouldValidate: false, shouldDirty: true });
  };

  const removeExperience = (index: number) => {
    const currentExperience = fullForm.getValues('experience') || [];
    fullForm.setValue('experience', currentExperience.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
  };

  const addEducation = () => {
    const currentEducation = fullForm.getValues('education') || [];
    fullForm.setValue('education', [...currentEducation, { id: `new_edu_${Date.now()}`, degree: '', institution: '', period: '' }], { shouldValidate: false, shouldDirty: true });
  };

  const removeEducation = (index: number) => {
    const currentEducation = fullForm.getValues('education') || [];
    fullForm.setValue('education', currentEducation.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage About Page"
        subtitle="Edit your profile, bio, contact, experience, and education details."
        className="py-0 text-left"
      />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile & Bio</TabsTrigger>
          <TabsTrigger value="contact">Contact & Socials</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Form {...profileBioForm}>
            <form id="profile-bio-form" action={profileBioFormAction} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile & Biography</CardTitle>
                  <CardDescription>Update your name, title, profile picture and main biography.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={profileBioForm.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={profileBioForm.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title / Tagline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={profileBioForm.control} name="profileImage" render={({ field }) => (
                    <FormItem><FormLabel>Profile Image URL</FormLabel><FormControl><Input {...field} placeholder="https://placehold.co/400x400.png" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={profileBioForm.control} name="dataAiHint" render={({ field }) => (
                    <FormItem><FormLabel>Profile Image AI Hint</FormLabel><FormControl><Input {...field} placeholder="e.g., developer portrait" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={profileBioForm.control} name="bio" render={({ field }) => (
                    <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea rows={10} placeholder="Write about yourself..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
                <CardFooter className="flex justify-end">
                   <SubmitButton form="profile-bio-form" text="Save Profile & Bio" />
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        {/* Other tabs will use the fullForm for now, to be refactored later */}
        <Form {...fullForm}> 
          <form id="about-full-form" action={fullFormAction} className="space-y-8">
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Social Links</CardTitle>
                  <CardDescription>Update your email and social media URLs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={fullForm.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} type="email" placeholder="your.email@example.com" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={fullForm.control} name="linkedinUrl" render={({ field }) => (
                    <FormItem><FormLabel>LinkedIn Profile URL</FormLabel><FormControl><Input {...field} placeholder="https://linkedin.com/in/yourprofile" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={fullForm.control} name="githubUrl" render={({ field }) => (
                    <FormItem><FormLabel>GitHub Profile URL</FormLabel><FormControl><Input {...field} placeholder="https://github.com/yourusername" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={fullForm.control} name="twitterUrl" render={({ field }) => (
                    <FormItem><FormLabel>Twitter Profile URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://twitter.com/yourusername" /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
                 <CardFooter className="flex justify-end">
                   <SubmitButton form="about-full-form" text="Save Contact & Socials" />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Experience</CardTitle>
                  <CardDescription>Manage your work history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(fullForm.watch('experience') || []).map((exp, index) => (
                    <Card key={exp.id || `exp-${index}`} className="p-4 space-y-3 bg-muted/30">
                      <input type="hidden" {...fullForm.register(`experience.${index}.id`)} defaultValue={exp.id} />
                      <FormField control={fullForm.control} name={`experience.${index}.role`} render={({ field }) => (
                        <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={fullForm.control} name={`experience.${index}.company`} render={({ field }) => (
                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={fullForm.control} name={`experience.${index}.period`} render={({ field }) => (
                        <FormItem><FormLabel>Period (e.g., 2020 - Present)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={fullForm.control} name={`experience.${index}.description`} render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>Remove Experience</Button>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addExperience}>Add New Experience</Button>
                </CardContent>
                 <CardFooter className="flex justify-end">
                   <SubmitButton form="about-full-form" text="Save Experience" />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Background</CardTitle>
                  <CardDescription>Manage your education history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(fullForm.watch('education') || []).map((edu, index) => (
                    <Card key={edu.id || `edu-${index}`} className="p-4 space-y-3 bg-muted/30">
                      <input type="hidden" {...fullForm.register(`education.${index}.id`)} defaultValue={edu.id} />
                      <FormField control={fullForm.control} name={`education.${index}.degree`} render={({ field }) => (
                        <FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={fullForm.control} name={`education.${index}.institution`} render={({ field }) => (
                        <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={fullForm.control} name={`education.${index}.period`} render={({ field }) => (
                        <FormItem><FormLabel>Period (e.g., 2018 - 2022)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>Remove Education</Button>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addEducation}>Add New Education</Button>
                </CardContent>
                 <CardFooter className="flex justify-end">
                   <SubmitButton form="about-full-form" text="Save Education" />
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}

