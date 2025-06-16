
"use server";

import type { AboutMeData, Experience, Education } from '@/lib/types';
import { aboutMeSchema } from '@/lib/adminSchemas'; // Import the schema

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

  const experienceEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('experience.'))
    .reduce((acc, [key, value]) => {
      const parts = key.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2] as keyof Experience;
      if (!acc[index]) acc[index] = { id: formData.get(`experience.${index}.id`) as string || `exp_temp_${Date.now()}_${index}`}; 
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
      if (!acc[index]) acc[index] = { id: formData.get(`education.${index}.id`) as string || `edu_temp_${Date.now()}_${index}` }; 
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
    // Filter out entries that might be entirely empty if a user adds then clears all fields of an item
    experience: experienceEntries.filter(e => e && e.role && e.company && e.period && e.description), 
    education: educationEntries.filter(e => e && e.degree && e.institution && e.period),
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
    console.log("Saving About Me data (simulation):", JSON.stringify(dataToSave, null, 2));
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    return {
      message: "About page data updated successfully! (Simulated Save)",
      status: 'success',
      data: dataToSave,
    };

  } catch (error) {
    console.error("Error updating About Me data:", error);
    return {
      message: "An unexpected error occurred while trying to save. Please try again later.",
      status: 'error',
    };
  }
}
