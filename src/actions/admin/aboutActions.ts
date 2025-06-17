
"use server";

import type { AboutMeData, Experience, Education, AppData } from '@/lib/types';
import { aboutMeSchema, profileBioSchema, type ProfileBioData } from '@/lib/adminSchemas';
import type { z } from 'zod';
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

// State type for the original full About Me form (will be phased out or adapted)
export type UpdateAboutDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof aboutMeSchema>['fieldErrors'];
  data?: AboutMeData; // Contains attempted data on error, saved data on success
};

// State type for the new Profile & Bio form
export type UpdateProfileBioDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof profileBioSchema>['fieldErrors'];
  data?: ProfileBioData; // Contains attempted data on error, saved data on success
};


// New Server Action for Profile & Bio section
export async function updateProfileBioDataAction(
  prevState: UpdateProfileBioDataFormState,
  formData: FormData
): Promise<UpdateProfileBioDataFormState> {
  let rawData: ProfileBioData | undefined = undefined;
  try {
    rawData = {
      name: String(formData.get('name') || ''),
      title: String(formData.get('title') || ''),
      bio: String(formData.get('bio') || ''),
      profileImage: String(formData.get('profileImage') || ''),
      dataAiHint: String(formData.get('dataAiHint') || ''),
    };

    const validatedFields = profileBioSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      console.error("Admin ProfileBio Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update profile & bio. Please check errors.",
        status: 'error',
        errors: fieldErrors,
        data: rawData,
      };
    }

    const dataToSave = validatedFields.data;

    const allData = await readDataFromFile();
    allData.aboutMe = {
      ...allData.aboutMe, // Preserve existing experience, education, contact etc.
      ...dataToSave,     // Overwrite with new profile/bio data
    };
    await writeDataToFile(allData);

    return {
      message: "Profile & Bio data updated successfully!",
      status: 'success',
      data: dataToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Admin ProfileBio Action: An unexpected error occurred:", error);
    const errorResponseData: ProfileBioData = rawData || {
      name: String(formData.get('name') || localDefaultAppData.aboutMe.name),
      title: String(formData.get('title') || localDefaultAppData.aboutMe.title),
      bio: String(formData.get('bio') || localDefaultAppData.aboutMe.bio),
      profileImage: String(formData.get('profileImage') || localDefaultAppData.aboutMe.profileImage),
      dataAiHint: String(formData.get('dataAiHint') || localDefaultAppData.aboutMe.dataAiHint),
    };
    return {
      message: "An unexpected server error occurred while updating profile & bio.",
      status: 'error',
      errors: {},
      data: errorResponseData,
    };
  }
}


// Original action - will be refactored or removed later
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
      const id = String(formData.get(`experience.${index}.id`) || `exp_fallback_${Date.now()}_${index}`);
      const role = String(formData.get(`experience.${index}.role`) || '');
      const company = String(formData.get(`experience.${index}.company`) || '');
      const period = String(formData.get(`experience.${index}.period`) || '');
      const description = String(formData.get(`experience.${index}.description`) || '');
      
      if (role.trim() !== '' || company.trim() !== '' || period.trim() !== '' || description.trim() !== '') {
          experienceEntries.push({ id, role, company, period, description });
      } else if (id && (formData.has(`experience.${index}.role`) || formData.has(`experience.${index}.company`) || formData.has(`experience.${index}.period`) || formData.has(`experience.${index}.description`))) {
          console.warn(`Admin About Action: Skipping experience entry with ID ${id} at index ${index} because all its data fields are empty or whitespace, but it was present in form data.`);
      }
    }

    for (const index of Array.from(educationIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
      const id = String(formData.get(`education.${index}.id`) || `edu_fallback_${Date.now()}_${index}`);
      const degree = String(formData.get(`education.${index}.degree`) || '');
      const institution = String(formData.get(`education.${index}.institution`) || '');
      const period = String(formData.get(`education.${index}.period`) || '');
      
      if (degree.trim() !== '' || institution.trim() !== '' || period.trim() !== '') {
          educationEntries.push({ id, degree, institution, period });
      } else if (id && (formData.has(`education.${index}.degree`) || formData.has(`education.${index}.institution`) || formData.has(`education.${index}.period`))) {
         console.warn(`Admin About Action: Skipping education entry with ID ${id} at index ${index} because all its data fields are empty or whitespace, but it was present in form data.`);
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
      console.error("Admin About Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update data. Please check the errors below.",
        status: 'error',
        errors: fieldErrors,
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
    
    // Ensure rawData is defined or provide a fallback structure
     const defaultErrorData = {
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
      data: rawData || defaultErrorData, 
    };
  }
}

