
"use server";

import type { AboutMeData, Experience, Education } from '@/lib/types';
import { aboutMeSchema } from '@/lib/adminSchemas';

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

  const experienceEntries: Experience[] = [];
  const educationEntries: Education[] = [];
  const experienceIndices = new Set<string>();
  const educationIndices = new Set<string>();

  // Collect all unique indices for experience and education
  for (const [key] of formData.entries()) {
    if (key.startsWith('experience.')) {
      experienceIndices.add(key.split('.')[1]);
    } else if (key.startsWith('education.')) {
      educationIndices.add(key.split('.')[1]);
    }
  }

  // Reconstruct experience entries
  for (const index of Array.from(experienceIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
    const id = formData.get(`experience.${index}.id`) as string || `exp_temp_${Date.now()}_${index}`;
    experienceEntries.push({
      id: id,
      role: formData.get(`experience.${index}.role`) as string || '',
      company: formData.get(`experience.${index}.company`) as string || '',
      period: formData.get(`experience.${index}.period`) as string || '',
      description: formData.get(`experience.${index}.description`) as string || '',
    });
  }
    
  // Reconstruct education entries
  for (const index of Array.from(educationIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
    const id = formData.get(`education.${index}.id`) as string || `edu_temp_${Date.now()}_${index}`;
    educationEntries.push({
      id: id,
      degree: formData.get(`education.${index}.degree`) as string || '',
      institution: formData.get(`education.${index}.institution`) as string || '',
      period: formData.get(`education.${index}.period`) as string || '',
    });
  }

  const rawData: AboutMeData = {
    name: formData.get('name') as string,
    title: formData.get('title') as string,
    bio: formData.get('bio') as string,
    profileImage: formData.get('profileImage') as string,
    dataAiHint: formData.get('dataAiHint') as string,
    experience: experienceEntries, 
    education: educationEntries,
  };
  
  const validatedFields = aboutMeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: "Failed to update data. Please check the errors below.",
      status: 'error',
      errors: fieldErrors as UpdateAboutDataFormState['errors'], // Cast needed due to complex nested error types
    };
  }

  const dataToSave = validatedFields.data;

  try {
    // Simulate saving the data
    console.log("Simulating save of About Me data:", JSON.stringify(dataToSave, null, 2));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    return {
      message: "About page data updated successfully! (Simulated Save)",
      status: 'success',
      data: dataToSave, // Return the "saved" data
    };

  } catch (error) {
    console.error("Error updating About Me data:", error);
    return {
      message: "An unexpected error occurred while trying to save. Please try again later.",
      status: 'error',
    };
  }
}
