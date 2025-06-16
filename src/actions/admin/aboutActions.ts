
"use server";

import { z } from 'zod';
import type { AboutMeData, Experience, Education } from '@/lib/types';

// Define Zod schemas for nested structures
const experienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(1, "Description is required"),
});

const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().min(1, "Period is required"),
});

// Define the main schema for AboutMeData
export const aboutMeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  bio: z.string().min(20, { message: "Bio must be at least 20 characters." }),
  profileImage: z.string().url({ message: "Please enter a valid URL for the profile image." }).or(z.literal("")),
  dataAiHint: z.string().max(50, { message: "AI hint must be 50 characters or less." }).or(z.literal("")),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
});


export type UpdateAboutDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof AboutMeData | `experience.${number}.${keyof Experience}` | `education.${number}.${keyof Education}`, string[]>>;
  data?: AboutMeData;
};

export async function updateAboutDataAction(
  prevState: UpdateAboutDataFormState,
  formData: FormData
): Promise<UpdateAboutDataFormState> {

  // Manually construct the object for validation due to FormData limitations with nested arrays
  const experienceEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('experience.'))
    .reduce((acc, [key, value]) => {
      const parts = key.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2] as keyof Experience;
      if (!acc[index]) acc[index] = { id: formData.get(`experience.${index}.id`) as string || `exp_temp_${index}`}; 
      // @ts-ignore
      acc[index][field] = value;
      return acc;
    }, [] as any[]);
    
  const educationEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('education.'))
    .reduce((acc, [key, value]) => {
      const parts = key.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2] as keyof Education;
      if (!acc[index]) acc[index] = { id: formData.get(`education.${index}.id`) as string || `edu_temp_${index}` }; 
      // @ts-ignore
      acc[index][field] = value;
      return acc;
    }, [] as any[]);


  const rawData = {
    name: formData.get('name'),
    title: formData.get('title'),
    bio: formData.get('bio'),
    profileImage: formData.get('profileImage'),
    dataAiHint: formData.get('dataAiHint'),
    experience: experienceEntries.filter(e => e && e.role && e.company && e.period && e.description), // Filter out potentially incomplete entries
    education: educationEntries.filter(e => e && e.degree && e.institution && e.period),   // Filter out potentially incomplete entries
  };
  
  const validatedFields = aboutMeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: "Failed to update data. Please check the errors below.",
      status: 'error',
      errors: fieldErrors as UpdateAboutDataFormState['errors'],
    };
  }

  const dataToSave = validatedFields.data;

  try {
    // Simulate saving data to a database
    console.log("Saving About Me data (simulation):", JSON.stringify(dataToSave, null, 2));
    // In a real application, you would save `dataToSave` to your database (e.g., Firestore).
    // Example: await db.collection('siteContent').doc('aboutMe').set(dataToSave);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    return {
      message: "About page data updated successfully! (Simulated Save)",
      status: 'success',
      data: dataToSave, // Return the saved data, which could be used to reset form or update UI
    };

  } catch (error) {
    console.error("Error updating About Me data:", error);
    return {
      message: "An unexpected error occurred while trying to save. Please try again later.",
      status: 'error',
    };
  }
}
