
"use server";

import type { AboutMeData, Experience, Education, AppData } from '@/lib/types';
import { 
  aboutMeSchema, 
  profileBioSchema, type ProfileBioData,
  experienceSectionSchema, type ExperienceSectionData,
  type Experience as ZodExperienceType // Renaming to avoid conflict with lib/types
} from '@/lib/adminSchemas';
import type { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

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

// State type for the new Experience section form
export type UpdateExperienceDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof experienceSectionSchema>['fieldErrors'];
  data?: ExperienceSectionData; // Contains attempted data on error, saved data on success
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

    revalidatePath('/about');
    revalidatePath('/'); 
    revalidatePath('/contact'); 

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
      errors: {}, // Keep errors empty for generic server errors
      data: errorResponseData,
    };
  }
}

// New Server Action for Experience section
export async function updateExperienceDataAction(
  prevState: UpdateExperienceDataFormState,
  formData: FormData
): Promise<UpdateExperienceDataFormState> {
  let rawDataForZod: ExperienceSectionData | undefined = undefined;
  try {
    const experienceEntries: ZodExperienceType[] = [];
    const experienceIndices = new Set<string>();

    for (const [key] of formData.entries()) {
      if (key.startsWith('experience.')) {
        experienceIndices.add(key.split('.')[1]);
      }
    }

    for (const index of Array.from(experienceIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
      const id = String(formData.get(`experience.${index}.id`) || `exp_fallback_${Date.now()}_${index}`);
      const role = String(formData.get(`experience.${index}.role`) || '');
      const company = String(formData.get(`experience.${index}.company`) || '');
      const period = String(formData.get(`experience.${index}.period`) || '');
      const description = String(formData.get(`experience.${index}.description`) || '');
      
      // Only add if at least one field is non-empty, or if it's an existing item (has an ID not starting with new_exp_)
      // Zod will handle individual field validation.
      // This logic is to decide whether to include an "empty" new item in the validation attempt.
      if (role.trim() !== '' || company.trim() !== '' || period.trim() !== '' || description.trim() !== '' || (id && !id.startsWith('new_exp_')) ) {
          experienceEntries.push({ id, role, company, period, description });
      } else {
         console.warn(`Admin Experience Action: Skipping entirely empty new experience entry at form index ${index}.`);
      }
    }
    
    rawDataForZod = { experience: experienceEntries };
        
    const validatedFields = experienceSectionSchema.safeParse(rawDataForZod);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      console.error("Admin Experience Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update experience. Please check the errors below.",
        status: 'error',
        errors: fieldErrors as z.inferFlattenedErrors<typeof experienceSectionSchema>['fieldErrors'], // Ensure correct type
        data: rawDataForZod, 
      };
    }

    const dataToSave = validatedFields.data;

    const allData = await readDataFromFile();
    allData.aboutMe.experience = dataToSave.experience; // Update only the experience part
    await writeDataToFile(allData);

    revalidatePath('/about');

    return {
      message: "Experience data updated successfully!",
      status: 'success',
      data: dataToSave, // Send back the successfully saved (and validated) data
      errors: {},
    };

  } catch (error) {
    console.error("Admin Experience Action: An unexpected error occurred:", error);
     const errorResponseData: ExperienceSectionData = rawDataForZod || {
        experience: [], 
    };
    return {
      message: "An unexpected server error occurred while updating experience.",
      status: 'error',
      errors: {},
      data: errorResponseData,
    };
  }
}


// Original action - will be refactored or removed later for Contact and Education
export async function updateAboutDataAction(
  prevState: UpdateAboutDataFormState,
  formData: FormData
): Promise<UpdateAboutDataFormState> {
  let rawData: AboutMeData | undefined = undefined;

  try {
    // This part is now problematic as it tries to build experience from formData
    // which will be empty if we are saving from, say, the education tab.
    // For now, it will likely wipe out experience if saved from other tabs using this action.
    // This needs to be refactored per section.
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
          console.warn(`Admin About Action (Full Form): Skipping experience entry with ID ${id} at index ${index} because all its data fields are empty or whitespace, but it was present in form data.`);
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
         console.warn(`Admin About Action (Full Form): Skipping education entry with ID ${id} at index ${index} because all its data fields are empty or whitespace, but it was present in form data.`);
      }
    }
    
    rawData = {
      name: String(formData.get('name') || ''), // These should ideally come from profileBioForm's latest state
      title: String(formData.get('title') || ''),
      bio: String(formData.get('bio') || ''),
      profileImage: String(formData.get('profileImage') || ''),
      dataAiHint: String(formData.get('dataAiHint') || ''),
      experience: experienceEntries, // This will be empty if no experience data submitted
      education: educationEntries,   // This will be empty if no education data submitted
      email: String(formData.get('email') || ''),
      linkedinUrl: String(formData.get('linkedinUrl') || ''),
      githubUrl: String(formData.get('githubUrl') || ''),
      twitterUrl: String(formData.get('twitterUrl') || ''),
    };
        
    const validatedFields = aboutMeSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      console.error("Admin About Action (Full Form): Zod validation failed. Errors:", JSON.stringify(fieldErrors));
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
      // Critical: This overwrites the entire aboutMe object.
      // If saving 'Education' tab, dataToSave.experience will be empty, wiping out existing experience.
      allData.aboutMe = dataToSave; 
      await writeDataToFile(allData);

      revalidatePath('/about');
      revalidatePath('/contact');
      revalidatePath('/');

      return {
        message: "About page data updated successfully (using full form action)!",
        status: 'success',
        data: dataToSave,
        errors: {},
      };

    } catch (fileOpError) {
      console.error("Admin About Action (Full Form): Error during file operation (read/write):", fileOpError); 
      return {
        message: "An error occurred while saving data to the file. Please try again.",
        status: 'error',
        errors: {}, 
        data: rawData, 
      };
    }

  } catch (error) {
    console.error("Admin About Action (Full Form): An unexpected error occurred in the action:", error);
    const defaultErrorData: AboutMeData = {
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
      message: "An unexpected server error occurred (full form action). Please check logs and try again.",
      status: 'error',
      errors: {}, 
      data: rawData || defaultErrorData, 
    };
  }
}

