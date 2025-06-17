
"use server";

import type { AboutMeData, Experience, Education, AppData } from '@/lib/types';
import { aboutMeSchema } from '@/lib/adminSchemas';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

const localDefaultAppData: AppData = {
  portfolioItems: [],
  skills: [],
  aboutMe: {
    name: 'Default Name',
    title: 'Default Title',
    bio: 'Default bio.',
    profileImage: 'https://placehold.co/400x400.png',
    dataAiHint: 'placeholder image',
    experience: [],
    education: [],
    email: 'default@example.com',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
  },
};

async function readDataFromFile(): Promise<AppData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent.trim()) {
        console.warn("Data file is empty in aboutActions, returning default structure.");
        return localDefaultAppData;
    }
    const parsedData = JSON.parse(fileContent);

    return {
      portfolioItems: parsedData.portfolioItems ?? localDefaultAppData.portfolioItems,
      skills: parsedData.skills ?? localDefaultAppData.skills,
      aboutMe: {
        ...localDefaultAppData.aboutMe,
        ...(parsedData.aboutMe ?? {}),
      },
    };
  } catch (error) {
    console.error("Error reading or parsing data file in aboutActions, returning default structure:", error);
    return localDefaultAppData;
  }
}

async function writeDataToFile(data: AppData): Promise<void> {
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
  let rawData: AboutMeData | undefined = undefined;

  try {
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
      
      if (id && (role.trim() !== '' || company.trim() !== '' || period.trim() !== '' || description.trim() !== '')) {
          experienceEntries.push({ id, role, company, period, description });
      } else if (id) {
          console.warn(`Admin About Action: Skipping experience entry with ID ${id} at index ${index} because all its data fields are empty.`);
      }
    }

    for (const index of Array.from(educationIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
      const id = formData.get(`education.${index}.id`) as string;
      const degree = formData.get(`education.${index}.degree`) as string || '';
      const institution = formData.get(`education.${index}.institution`) as string || '';
      const period = formData.get(`education.${index}.period`) as string || '';
      
      if (id && (degree.trim() !== '' || institution.trim() !== '' || period.trim() !== '')) {
          educationEntries.push({ id, degree, institution, period });
      } else if (id) {
          console.warn(`Admin About Action: Skipping education entry with ID ${id} at index ${index} because all its data fields are empty.`);
      }
    }

    rawData = {
      name: String(formData.get('name') || ''),
      title: String(formData.get('title') || ''),
      bio: String(formData.get('bio') || ''),
      profileImage: String(formData.get('profileImage') || ''),
      dataAiHint: String(formData.get('dataAiHint') || ''),
      experience: experienceEntries,
      education: educationEntries,
      email: String(formData.get('email') || ''),
      linkedinUrl: String(formData.get('linkedinUrl') || ''),
      githubUrl: String(formData.get('githubUrl') || ''),
      twitterUrl: String(formData.get('twitterUrl') || ''),
    };
    
    const validatedFields = aboutMeSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "Failed to update data. Please check the errors below.",
        status: 'error',
        errors: fieldErrors as UpdateAboutDataFormState['errors'],
        data: rawData, 
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
        errors: {},
      };

    } catch (fileOpError) {
      console.error("Admin About Action: Error during file operation (read/write):", fileOpError); 
      return {
        message: "An error occurred while saving data to the file. Please try again.",
        status: 'error',
        errors: {}, 
        data: rawData, 
      };
    }

  } catch (error) {
    console.error("Admin About Action: An unexpected error occurred in the action:", error);
    
    const errorResponseData: AboutMeData = {
      name: String(formData.get('name') || localDefaultAppData.aboutMe.name),
      title: String(formData.get('title') || localDefaultAppData.aboutMe.title),
      bio: String(formData.get('bio') || localDefaultAppData.aboutMe.bio),
      profileImage: String(formData.get('profileImage') || localDefaultAppData.aboutMe.profileImage),
      dataAiHint: String(formData.get('dataAiHint') || localDefaultAppData.aboutMe.dataAiHint),
      experience: rawData?.experience || [], 
      education: rawData?.education || [],  
      email: String(formData.get('email') || localDefaultAppData.aboutMe.email),
      linkedinUrl: String(formData.get('linkedinUrl') || localDefaultAppData.aboutMe.linkedinUrl),
      githubUrl: String(formData.get('githubUrl') || localDefaultAppData.aboutMe.githubUrl),
      twitterUrl: String(formData.get('twitterUrl') || localDefaultAppData.aboutMe.twitterUrl),
    };

    return {
      message: "An unexpected server error occurred. Please check logs and try again.",
      status: 'error',
      errors: {}, 
      data: rawData || errorResponseData, 
    };
  }
}
