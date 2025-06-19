
"use client";

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, useFieldArray, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import FullScreenLoader from '@/components/shared/FullScreenLoader';

import { defaultAboutMeDataForClient } from '@/lib/data';
import type { AboutMeData, Experience as LibExperienceType, Education as LibEducationType } from '@/lib/types';
import { 
  updateAboutDataAction, type UpdateAboutDataFormState,
  updateProfileBioDataAction, type UpdateProfileBioDataFormState,
  updateExperienceDataAction, type UpdateExperienceDataFormState,
  updateEducationDataAction, type UpdateEducationDataFormState
} from '@/actions/admin/aboutActions';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction'; 
import { 
  aboutMeSchema, 
  profileBioSchema, type ProfileBioData,
  experienceSectionSchema, type ExperienceSectionData,
  educationSectionSchema, type EducationSectionData,
  type Experience as ZodExperienceType, 
  type Education as ZodEducationType
} from '@/lib/adminSchemas';


const initialFullFormState: UpdateAboutDataFormState = { message: '', status: 'idle', errors: {}, data: undefined };
const initialProfileBioFormState: UpdateProfileBioDataFormState = { message: '', status: 'idle', errors: {}, data: undefined };
const initialExperienceFormState: UpdateExperienceDataFormState = { message: '', status: 'idle', errors: {}, data: undefined };
const initialEducationFormState: UpdateEducationDataFormState = { message: '', status: 'idle', errors: {}, data: undefined };


interface SubmitButtonProps {
  form?: string; 
  text?: string;
}

function SubmitButton({ form: formId, text = "Save Changes" }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} form={formId}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
         <Save className="mr-2 h-4 w-4" />
         {text}
        </>
      )}
    </Button>
  );
}

const prepareFullAboutMeDataForForm = (data?: Partial<AboutMeData>): AboutMeData => {
  const defaults = defaultAboutMeDataForClient;
  return {
    name: data?.name || defaults.name,
    title: data?.title || defaults.title,
    bio: data?.bio || defaults.bio,
    profileImage: data?.profileImage || defaults.profileImage,
    dataAiHint: data?.dataAiHint || defaults.dataAiHint,
    experience: (Array.isArray(data?.experience) && data.experience.length > 0 ? data.experience : defaults.experience).map(exp => ({ ...exp, id: exp.id || `exp_form_${Date.now()}_${Math.random().toString(36).substring(2,7)}` })),
    education: (Array.isArray(data?.education) && data.education.length > 0 ? data.education : defaults.education).map(edu => ({ ...edu, id: edu.id || `edu_form_${Date.now()}_${Math.random().toString(36).substring(2,7)}` })),
    email: data?.email || defaults.email,
    linkedinUrl: data?.linkedinUrl || defaults.linkedinUrl,
    githubUrl: data?.githubUrl || defaults.githubUrl,
    twitterUrl: data?.twitterUrl || defaults.twitterUrl,
  };
};

const prepareProfileBioDataForForm = (data?: Partial<ProfileBioData>): ProfileBioData => {
  const defaults = defaultAboutMeDataForClient;
  return {
    name: data?.name || defaults.name,
    title: data?.title || defaults.title,
    bio: data?.bio || defaults.bio,
    profileImage: data?.profileImage || defaults.profileImage,
    dataAiHint: data?.dataAiHint || defaults.dataAiHint,
  };
};

const prepareExperienceSectionDataForForm = (data?: Partial<ExperienceSectionData>): ExperienceSectionData => {
    const experienceArray = data?.experience || defaultAboutMeDataForClient.experience;
    return {
        experience: (Array.isArray(experienceArray) ? experienceArray : []).map(exp => ({
            id: exp.id || `exp_form_prep_${Date.now()}_${Math.random().toString(36).substring(2,7)}`, 
            role: exp.role || '',
            company: exp.company || '',
            period: exp.period || '',
            description: exp.description || '',
        })),
    };
};

const prepareEducationSectionDataForForm = (data?: Partial<EducationSectionData>): EducationSectionData => {
    const educationArray = data?.education || defaultAboutMeDataForClient.education;
    return {
        education: (Array.isArray(educationArray) ? educationArray : []).map(edu => ({
            id: edu.id || `edu_form_prep_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
            degree: edu.degree || '',
            institution: edu.institution || '',
            period: edu.period || '',
        })),
    };
};


export default function AdminAboutPage() {
  const { toast } = useToast();
  const [initialDataLoading, setInitialDataLoading] = useState(true);

  const [profileBioState, profileBioFormAction] = useActionState(updateProfileBioDataAction, initialProfileBioFormState);
  const profileBioForm = useForm<ProfileBioData>({
    resolver: zodResolver(profileBioSchema),
    defaultValues: prepareProfileBioDataForForm(),
  });

  const [experienceState, experienceFormAction] = useActionState(updateExperienceDataAction, initialExperienceFormState);
  const experienceForm = useForm<ExperienceSectionData>({
    resolver: zodResolver(experienceSectionSchema),
    defaultValues: prepareExperienceSectionDataForForm(),
  });
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: experienceForm.control,
    name: "experience",
    keyName: "fieldId", 
  });
  
  const [educationState, educationFormAction] = useActionState(updateEducationDataAction, initialEducationFormState);
  const educationForm = useForm<EducationSectionData>({
    resolver: zodResolver(educationSectionSchema),
    defaultValues: prepareEducationSectionDataForForm(),
  });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: educationForm.control,
    name: "education",
    keyName: "fieldId",
  });

  const [fullFormState, fullFormAction] = useActionState(updateAboutDataAction, initialFullFormState);
  const fullForm = useForm<AboutMeData>({ 
    resolver: zodResolver(aboutMeSchema),
    defaultValues: prepareFullAboutMeDataForForm(), 
  });

  useEffect(() => {
    async function loadInitialData() {
      setInitialDataLoading(true);
      try {
        const fetchedData = await getAboutMeDataAction();
        const preparedData = prepareFullAboutMeDataForForm(fetchedData);
        
        profileBioForm.reset(prepareProfileBioDataForForm(preparedData));
        experienceForm.reset(prepareExperienceSectionDataForForm({ experience: preparedData.experience }));
        educationForm.reset(prepareEducationSectionDataForForm({ education: preparedData.education }));
        fullForm.reset(preparedData); 

      } catch (error) {
        console.error("Failed to load initial About Me data for admin:", error);
        toast({ title: "Error", description: "Could not load existing About Me data.", variant: "destructive" });
        profileBioForm.reset(prepareProfileBioDataForForm(defaultAboutMeDataForClient));
        experienceForm.reset(prepareExperienceSectionDataForForm({ experience: defaultAboutMeDataForClient.experience }));
        educationForm.reset(prepareEducationSectionDataForForm({ education: defaultAboutMeDataForClient.education }));
        fullForm.reset(prepareFullAboutMeDataForForm(defaultAboutMeDataForClient));
      } finally {
        setInitialDataLoading(false);
      }
    }
    loadInitialData();
  }, [profileBioForm, experienceForm, educationForm, fullForm, toast]);


  useEffect(() => {
    if (profileBioState.status === 'success' && profileBioState.message) {
      toast({ title: "Success!", description: profileBioState.message });
      if (profileBioState.data) profileBioForm.reset(prepareProfileBioDataForForm(profileBioState.data));
    } else if (profileBioState.status === 'error') {
      toast({ title: "Error Profile & Bio", description: profileBioState.message || "An error occurred.", variant: "destructive" });
      if (profileBioState.data) profileBioForm.reset(prepareProfileBioDataForForm(profileBioState.data)); 
      else profileBioForm.reset(profileBioForm.getValues()); 
      
      if (profileBioState.errors) {
        Object.entries(profileBioState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            profileBioForm.setError(fieldName as Path<ProfileBioData>, { type: 'server', message: fieldErrorMessages.join(', ') });
          }
        });
      }
    }
  }, [profileBioState, toast, profileBioForm]);

  useEffect(() => {
    if (experienceState.status === 'success' && experienceState.message) {
      toast({ title: "Success!", description: experienceState.message });
      if (experienceState.data) experienceForm.reset(prepareExperienceSectionDataForForm(experienceState.data));
    } else if (experienceState.status === 'error') {
      toast({ title: "Error Experience", description: experienceState.message || "An error occurred.", variant: "destructive" });
      if (experienceState.data) experienceForm.reset(prepareExperienceSectionDataForForm(experienceState.data));
      else experienceForm.reset(experienceForm.getValues());

      if (experienceState.errors) {
        Object.entries(experienceState.errors).forEach(([fieldName, fieldErrorMessages]) => {
            if (fieldName.startsWith("experience.") && Array.isArray(fieldErrorMessages)) {
                const parts = fieldName.split('.');
                if (parts.length === 3) { 
                    const index = parseInt(parts[1]);
                    const subFieldName = parts[2] as keyof ZodExperienceType;
                    experienceForm.setError(`experience.${index}.${subFieldName}`, { type: 'server', message: fieldErrorMessages.join(', ') });
                }
            } else if (fieldName === "experience" && typeof fieldErrorMessages === 'string') { 
                 experienceForm.setError("experience", { type: 'server', message: fieldErrorMessages });
            } else if (fieldName === "experience" && Array.isArray(fieldErrorMessages)) {
                 experienceForm.setError("experience", { type: 'server', message: fieldErrorMessages.join(', ') });
            }
        });
      }
    }
  }, [experienceState, toast, experienceForm]);

  useEffect(() => {
    if (educationState.status === 'success' && educationState.message) {
      toast({ title: "Success!", description: educationState.message });
      if (educationState.data) educationForm.reset(prepareEducationSectionDataForForm(educationState.data));
    } else if (educationState.status === 'error') {
      toast({ title: "Error Education", description: educationState.message || "An error occurred.", variant: "destructive" });
      if (educationState.data) educationForm.reset(prepareEducationSectionDataForForm(educationState.data));
      else educationForm.reset(educationForm.getValues());

      if (educationState.errors) {
        Object.entries(educationState.errors).forEach(([fieldName, fieldErrorMessages]) => {
            if (fieldName.startsWith("education.") && Array.isArray(fieldErrorMessages)) {
                const parts = fieldName.split('.');
                if (parts.length === 3) { 
                    const index = parseInt(parts[1]);
                    const subFieldName = parts[2] as keyof ZodEducationType;
                    educationForm.setError(`education.${index}.${subFieldName}`, { type: 'server', message: fieldErrorMessages.join(', ') });
                }
            } else if (fieldName === "education" && typeof fieldErrorMessages === 'string') { 
                 educationForm.setError("education", { type: 'server', message: fieldErrorMessages });
            } else if (fieldName === "education" && Array.isArray(fieldErrorMessages)) {
                 educationForm.setError("education", { type: 'server', message: fieldErrorMessages.join(', ') });
            }
        });
      }
    }
  }, [educationState, toast, educationForm]);

   useEffect(() => {
    if (fullFormState.status === 'success' && fullFormState.message) {
      toast({ title: "Success (Contact/Socials)!", description: fullFormState.message });
      if (fullFormState.data) fullForm.reset(prepareFullAboutMeDataForForm(fullFormState.data));
    } else if (fullFormState.status === 'error') {
      toast({ title: "Error Saving (Contact/Socials)", description: fullFormState.message || "An error occurred.", variant: "destructive" });
      if (fullFormState.data) fullForm.reset(prepareFullAboutMeDataForForm(fullFormState.data));
      else fullForm.reset(fullForm.getValues());
      
      if (fullFormState.errors) {
        Object.entries(fullFormState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            fullForm.setError(fieldName as Path<AboutMeData>, { type: 'server', message: fieldErrorMessages.join(', ') });
          }
        });
      }
    }
  }, [fullFormState, toast, fullForm]);

  if (initialDataLoading) {
    return <FullScreenLoader />;
  }

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
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="contact">Contact & Socials</TabsTrigger>
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
        
        <TabsContent value="experience">
          <Form {...experienceForm}>
            <form id="experience-form" action={experienceFormAction} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Experience</CardTitle>
                  <CardDescription>Manage your work history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experienceFields.map((item, index) => (
                    <Card key={item.fieldId} className="p-4 space-y-3 bg-muted/30">
                      <input type="hidden" {...experienceForm.register(`experience.${index}.id`)} />
                      <FormField control={experienceForm.control} name={`experience.${index}.role`} render={({ field }) => (
                        <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={experienceForm.control} name={`experience.${index}.company`} render={({ field }) => (
                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={experienceForm.control} name={`experience.${index}.period`} render={({ field }) => (
                        <FormItem><FormLabel>Period (e.g., 2020 - Present)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={experienceForm.control} name={`experience.${index}.description`} render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Experience
                      </Button>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendExperience({ id: `new_exp_${Date.now()}_${Math.random().toString(36).substring(2,7)}`, role: '', company: '', period: '', description: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Experience
                  </Button>
                  {experienceForm.formState.errors.experience?.message && (
                     <FormMessage>{experienceForm.formState.errors.experience.message}</FormMessage>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <SubmitButton form="experience-form" text="Save Experience" />
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="education">
          <Form {...educationForm}>
            <form id="education-form" action={educationFormAction} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Background</CardTitle>
                  <CardDescription>Manage your education history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {educationFields.map((item, index) => (
                    <Card key={item.fieldId} className="p-4 space-y-3 bg-muted/30">
                      <input type="hidden" {...educationForm.register(`education.${index}.id`)} />
                      <FormField control={educationForm.control} name={`education.${index}.degree`} render={({ field }) => (
                        <FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={educationForm.control} name={`education.${index}.institution`} render={({ field }) => (
                        <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={educationForm.control} name={`education.${index}.period`} render={({ field }) => (
                        <FormItem><FormLabel>Period (e.g., 2018 - 2022)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                         <Trash2 className="mr-2 h-4 w-4" />Remove Education
                      </Button>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendEducation({ id: `new_edu_${Date.now()}_${Math.random().toString(36).substring(2,7)}`, degree: '', institution: '', period: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" />Add New Education
                  </Button>
                   {educationForm.formState.errors.education?.message && (
                     <FormMessage>{educationForm.formState.errors.education.message}</FormMessage>
                  )}
                </CardContent>
                 <CardFooter className="flex justify-end">
                   <SubmitButton form="education-form" text="Save Education" />
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="contact">
          <Form {...fullForm}> 
            <form id="contact-socials-form" action={fullFormAction} className="space-y-8">
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
                   <SubmitButton form="contact-socials-form" text="Save Contact & Socials" />
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

