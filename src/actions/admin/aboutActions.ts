
"use server";

import type { AboutMeData, Experience, Education } from '@/lib/types';
import { aboutMeSchema } from '@/lib/adminSchemas';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

async function readDataFromFile(): Promise<{ portfolioItems: any[], skills: any[], aboutMe: AboutMeData }> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading data file, returning empty structure:", error);
    // Ensure a default structure is returned if file is missing or corrupt
    return { portfolioItems: [], skills: [], aboutMe: { name: '', title: '', bio: '', profileImage: '', dataAiHint: '', experience: [], education: [] } };
  }
}

async function writeDataToFile(data: any): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

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

  for (const [key] of formData.entries()) {
    if (key.startsWith('experience.')) {
      experienceIndices.add(key.split('.')[1]);
    } else if (key.startsWith('education.')) {
      educationIndices.add(key.split('.')[1]);
    }
  }
  
  for (const index of Array.from(experienceIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
    const id = formData.get(`experience.${index}.id`) as string; 
    const role = formData.get(`experience.${index}.role`) as string || '';
    const company = formData.get(`experience.${index}.company`) as string || '';
    const period = formData.get(`experience.${index}.period`) as string || '';
    const description = formData.get(`experience.${index}.description`) as string || '';
    if (id) {
        experienceEntries.push({ id, role, company, period, description });
    }
  }
    
  for (const index of Array.from(educationIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
    const id = formData.get(`education.${index}.id`) as string; 
    const degree = formData.get(`education.${index}.degree`) as string || '';
    const institution = formData.get(`education.${index}.institution`) as string || '';
    const period = formData.get(`education.${index}.period`) as string || '';
    if (id) {
        educationEntries.push({ id, degree, institution, period });
    }
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
      errors: fieldErrors as UpdateAboutDataFormState['errors'], 
    };
  }

  const dataToSave = validatedFields.data;

  try {
    const allData = await readDataFromFile();
    allData.aboutMe = dataToSave;
    await writeDataToFile(allData);

    return {
      message: "About page data updated successfully!",
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

    