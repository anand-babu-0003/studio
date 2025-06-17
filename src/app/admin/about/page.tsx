
"use client";

import { useEffect } from 'react';
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

import { aboutMe as initialAboutMeDataFromLib } from '@/lib/data';
import type { AboutMeData, Experience as LibExperienceType, Education as LibEducationType } from '@/lib/types';
import { 
  updateAboutDataAction, type UpdateAboutDataFormState,
  updateProfileBioDataAction, type UpdateProfileBioDataFormState,
  updateExperienceDataAction, type UpdateExperienceDataFormState,
  updateEducationDataAction, type UpdateEducationDataFormState
} from '@/actions/admin/aboutActions';
import { 
  aboutMeSchema, 
  profileBioSchema, type ProfileBioData,
  experienceSectionSchema, type ExperienceSectionData,
  educationSectionSchema, type EducationSectionData,
  type Experience as ZodExperienceType, 
  type Education as ZodEducationType
} from '@/lib/adminSchemas';

// Initial state for the (soon to be deprecated/refactored) full form action
const initialFullFormState: UpdateAboutDataFormState = {
  message: '',
  status: 'idle',
  errors: {},
  data: undefined,
};

// Initial state for the Profile & Bio form action
const initialProfileBioFormState: UpdateProfileBioDataFormState = { message: '', status: 'idle', errors: {}, data: undefined };
// Initial state for the Experience section form action
const initialExperienceFormState: UpdateExperienceDataFormState = { message: '', status: 'idle', errors: {}, data: undefined };
// Initial state for the Education section form action
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

// Prepare data for the full AboutMeData structure
const prepareFullAboutMeDataForForm = (data?: Partial<AboutMeData>): AboutMeData => {
  const defaultData = {
      name: '', title: '', bio: '', profileImage: '', dataAiHint: '',
      experience: [], education: [], email: '', linkedinUrl: '', githubUrl: '', twitterUrl: '',
  };
  if (!data) return defaultData;
  
  return {
    name: data.name || '',
    title: data.title || '',
    bio: data.bio || '',
    profileImage: data.profileImage || '',
    dataAiHint: data.dataAiHint || '',
    experience: (data.experience || []).map(exp => ({ ...exp, id: exp.id || `exp_fallback_${Date.now()}_${Math.random()}` })),
    education: (data.education || []).map(edu => ({ ...edu, id: edu.id || `edu_fallback_${Date.now()}_${Math.random()}` })),
    email: data.email || '',
    linkedinUrl: data.linkedinUrl || '',
    githubUrl: data.githubUrl || '',
    twitterUrl: data.twitterUrl || '',
  };
};

// Prepare data for just the ProfileBioData structure
const prepareProfileBioDataForForm = (data?: Partial<ProfileBioData>): ProfileBioData => {
  const defaultData = { name: '', title: '', bio: '', profileImage: '', dataAiHint: '' };
  if (!data) return defaultData;
  return {
    name: data.name || '',
    title: data.title || '',
    bio: data.bio || '',
    profileImage: data.profileImage || '',
    dataAiHint: data.dataAiHint || '',
  };
};

// Prepare data for just the ExperienceSectionData structure
const prepareExperienceSectionDataForForm = (data?: Partial<ExperienceSectionData>): ExperienceSectionData => {
    if (!data || !Array.isArray(data.experience)) {
        return { experience: [] };
    }
    return {
        experience: data.experience.map(exp => ({
            id: exp.id || `exp_fallback_${Date.now()}_${Math.random()}`, 
            role: exp.role || '',
            company: exp.company || '',
            period: exp.period || '',
            description: exp.description || '',
        })),
    };
};

// Prepare data for just the EducationSectionData structure
const prepareEducationSectionDataForForm = (data?: Partial<EducationSectionData>): EducationSectionData => {
    if (!data || !Array.isArray(data.education)) {
        return { education: [] };
    }
    return {
        education: data.education.map(edu => ({
            id: edu.id || `edu_fallback_${Date.now()}_${Math.random()}`,
            degree: edu.degree || '',
            institution: edu.institution || '',
            period: edu.period || '',
        })),
    };
};


export default function AdminAboutPage() {
  const { toast } = useToast();

  // --- Form and state for Profile & Bio ---
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
        ? profileBioState.message : "An error occurred saving Profile & Bio.";
      toast({ title: "Error Profile & Bio", description: errorMessage, variant: "destructive" });
      
      const dataToResetWith = profileBioState.data ? profileBioState.data : profileBioForm.getValues();
      profileBioForm.reset(prepareProfileBioDataForForm(dataToResetWith));
      
      if (profileBioState.errors && typeof profileBioState.errors === 'object') {
        Object.entries(profileBioState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            profileBioForm.setError(fieldName as Path<ProfileBioData>, { type: 'server', message: fieldErrorMessages.join(', ') });
          }
        });
      }
    }
  }, [profileBioState, toast, profileBioForm]);

  // --- Form and state for Experience Section ---
  const [experienceState, experienceFormAction] = useActionState(updateExperienceDataAction, initialExperienceFormState);
  const experienceForm = useForm<ExperienceSectionData>({
    resolver: zodResolver(experienceSectionSchema),
    defaultValues: prepareExperienceSectionDataForForm({ experience: initialAboutMeDataFromLib.experience }),
  });
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: experienceForm.control,
    name: "experience",
    keyName: "fieldId", 
  });
  
  useEffect(() => {
    if (experienceState.status === 'success' && experienceState.message) {
      toast({ title: "Success!", description: experienceState.message });
      if (experienceState.data) {
        experienceForm.reset(prepareExperienceSectionDataForForm(experienceState.data));
      }
    } else if (experienceState.status === 'error') {
      const errorMessage = (typeof experienceState.message === 'string' && experienceState.message.trim() !== '')
        ? experienceState.message : "An error saving experience.";
      toast({ title: "Error Experience", description: errorMessage, variant: "destructive" });
      
      const dataToResetWith = experienceState.data ? experienceState.data : experienceForm.getValues();
      experienceForm.reset(prepareExperienceSectionDataForForm(dataToResetWith));

      if (experienceState.errors && typeof experienceState.errors === 'object') {
        Object.entries(experienceState.errors).forEach(([fieldName, fieldErrorMessages]) => {
            if (fieldName.startsWith("experience.") && fieldErrorMessages) {
                const parts = fieldName.split('.');
                if (parts.length === 3) { 
                    const index = parseInt(parts[1]);
                    const subFieldName = parts[2] as keyof ZodExperienceType;
                    experienceForm.setError(`experience.${index}.${subFieldName}`, { type: 'server', message: (fieldErrorMessages as string[]).join(', ') });
                }
            } else if (fieldName === "experience" && fieldErrorMessages) { 
                 experienceForm.setError("experience", { type: 'server', message: (fieldErrorMessages as string[]).join(', ') });
            }
        });
      }
    }
  }, [experienceState, toast, experienceForm]);

  // --- Form and state for Education Section ---
  const [educationState, educationFormAction] = useActionState(updateEducationDataAction, initialEducationFormState);
  const educationForm = useForm<EducationSectionData>({
    resolver: zodResolver(educationSectionSchema),
    defaultValues: prepareEducationSectionDataForForm({ education: initialAboutMeDataFromLib.education }),
  });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: educationForm.control,
    name: "education",
    keyName: "fieldId",
  });

  useEffect(() => {
    if (educationState.status === 'success' && educationState.message) {
      toast({ title: "Success!", description: educationState.message });
      if (educationState.data) {
        educationForm.reset(prepareEducationSectionDataForForm(educationState.data));
      }
    } else if (educationState.status === 'error') {
      const errorMessage = (typeof educationState.message === 'string' && educationState.message.trim() !== '')
        ? educationState.message : "An error saving education.";
      toast({ title: "Error Education", description: errorMessage, variant: "destructive" });
      
      const dataToResetWith = educationState.data ? educationState.data : educationForm.getValues();
      educationForm.reset(prepareEducationSectionDataForForm(dataToResetWith));

      if (educationState.errors && typeof educationState.errors === 'object') {
        Object.entries(educationState.errors).forEach(([fieldName, fieldErrorMessages]) => {
            if (fieldName.startsWith("education.") && fieldErrorMessages) {
                const parts = fieldName.split('.');
                if (parts.length === 3) { 
                    const index = parseInt(parts[1]);
                    const subFieldName = parts[2] as keyof ZodEducationType;
                    educationForm.setError(`education.${index}.${subFieldName}`, { type: 'server', message: (fieldErrorMessages as string[]).join(', ') });
                }
            } else if (fieldName === "education" && fieldErrorMessages) { 
                 educationForm.setError("education", { type: 'server', message: (fieldErrorMessages as string[]).join(', ') });
            }
        });
      }
    }
  }, [educationState, toast, educationForm]);


  // --- Full form logic (now only for Contact & Socials) ---
  const [fullFormState, fullFormAction] = useActionState(updateAboutDataAction, initialFullFormState);
  const fullForm = useForm<AboutMeData>({ // Still uses full AboutMeData for now
    resolver: zodResolver(aboutMeSchema), // And full schema
    // Default values should only reflect contact info now, others are managed by their forms
    defaultValues: prepareFullAboutMeDataForForm({
        name: initialAboutMeDataFromLib.name, // these will be ignored by the action
        title: initialAboutMeDataFromLib.title,
        bio: initialAboutMeDataFromLib.bio,
        profileImage: initialAboutMeDataFromLib.profileImage,
        dataAiHint: initialAboutMeDataFromLib.dataAiHint,
        experience: initialAboutMeDataFromLib.experience,
        education: initialAboutMeDataFromLib.education,
        // Only these are relevant for this form now
        email: initialAboutMeDataFromLib.email,
        linkedinUrl: initialAboutMeDataFromLib.linkedinUrl,
        githubUrl: initialAboutMeDataFromLib.githubUrl,
        twitterUrl: initialAboutMeDataFromLib.twitterUrl,
    }), 
  });

   useEffect(() => {
    if (fullFormState.status === 'success' && fullFormState.message) {
      toast({ title: "Success (Contact/Socials)!", description: fullFormState.message });
      if (fullFormState.data) {
        // Only reset the relevant parts of the fullForm (contact info)
        fullForm.reset(prepareFullAboutMeDataForForm(fullFormState.data));
        // No longer need to reset other forms from here as they are independent
      }
    } else if (fullFormState.status === 'error') {
      const errorMessage = (typeof fullFormState.message === 'string' && fullFormState.message.trim() !== '')
        ? fullFormState.message : "An error saving Contact/Socials.";
      toast({ title: "Error Saving (Contact/Socials)", description: errorMessage, variant: "destructive" });

      const dataToResetWith = fullFormState.data ? prepareFullAboutMeDataForForm(fullFormState.data) : prepareFullAboutMeDataForForm(fullForm.getValues());
      fullForm.reset(dataToResetWith);

      if (fullFormState.errors && typeof fullFormState.errors === 'object' && Object.keys(fullFormState.errors).length > 0) {
        Object.entries(fullFormState.errors).forEach(([fieldName, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            const message = fieldErrorMessages.join(', ');
            // Only set errors for fields still managed by this form (contact fields)
            if (['email', 'linkedinUrl', 'githubUrl', 'twitterUrl'].includes(fieldName)) {
              fullForm.setError(fieldName as Path<AboutMeData>, { type: 'server', message });
            }
          }
        });
      }
    }
  }, [fullFormState, toast, fullForm]);


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
                      <FormField control={experienceForm.control} name={`experience.${index}.id`} render={({ field }) => <input type="hidden" {...field} />} />
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
                  <Button type="button" variant="outline" onClick={() => appendExperience({ id: `new_exp_${Date.now()}`, role: '', company: '', period: '', description: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Experience
                  </Button>
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
                      <FormField control={educationForm.control} name={`education.${index}.id`} render={({ field }) => <input type="hidden" {...field} />} />
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
                  <Button type="button" variant="outline" onClick={() => appendEducation({ id: `new_edu_${Date.now()}`, degree: '', institution: '', period: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" />Add New Education
                  </Button>
                </CardContent>
                 <CardFooter className="flex justify-end">
                   <SubmitButton form="education-form" text="Save Education" />
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        {/* Contact tab still uses the fullForm for now - this needs to be the final part of the refactor */}
        <TabsContent value="contact">
          <Form {...fullForm}> 
            <form id="about-full-form" action={fullFormAction} className="space-y-8">
              {/* No longer need hidden fields for profile/bio, experience as they are managed separately */}
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
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

