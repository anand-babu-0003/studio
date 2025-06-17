
"use server";

import type { AboutMeData, Experience, Education, AppData } from '@/lib/types';
import { 
  aboutMeSchema, 
  profileBioSchema, type ProfileBioData,
  experienceSectionSchema, type ExperienceSectionData,
  educationSectionSchema, type EducationSectionData,
  type Experience as ZodExperienceType, 
  type Education as ZodEducationType 
} from '@/lib/adminSchemas';
import type { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

// Standardized default AppData structure
const defaultAppData: AppData = {
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
  siteSettings: { // Added to ensure completeness
    siteName: 'My Portfolio',
    defaultMetaDescription: 'A showcase of my projects and skills.',
    defaultMetaKeywords: '',
    siteOgImageUrl: '',
  },
};

async function readDataFromFile(): Promise<AppData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent.trim()) {
        console.warn("Data file is empty in aboutActions, returning default structure.");
        return defaultAppData;
    }
    const parsedData = JSON.parse(fileContent);
    // Use comprehensive merging strategy
    return {
      ...defaultAppData, // Start with full default structure
      ...parsedData,     // Override with parsed data
      aboutMe: { ...defaultAppData.aboutMe, ...(parsedData.aboutMe ?? {}) }, // Deep merge for aboutMe
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : defaultAppData.skills,
      portfolioItems: Array.isArray(parsedData.portfolioItems) ? parsedData.portfolioItems : defaultAppData.portfolioItems,
      siteSettings: { ...defaultAppData.siteSettings, ...(parsedData.siteSettings ?? {}) }, // Deep merge for siteSettings
    };
  } catch (error) {
    console.error("Error reading or parsing data file in aboutActions, returning default structure:", error);
    return defaultAppData;
  }
}

async function writeDataToFile(data: AppData): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// State type for the original full About Me form (now only for Contact)
export type UpdateAboutDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof aboutMeSchema>['fieldErrors'];
  data?: AboutMeData; 
};

// State type for the Profile & Bio form
export type UpdateProfileBioDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof profileBioSchema>['fieldErrors'];
  data?: ProfileBioData; 
};

// State type for the Experience section form
export type UpdateExperienceDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof experienceSectionSchema>['fieldErrors'];
  data?: ExperienceSectionData; 
};

// State type for the Education section form
export type UpdateEducationDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof educationSectionSchema>['fieldErrors'];
  data?: EducationSectionData;
};


// Server Action for Profile & Bio section
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
      console.warn("Admin ProfileBio Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
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
      ...allData.aboutMe, // Preserve existing fields in aboutMe
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
    const currentAboutMe = (await readDataFromFile()).aboutMe;
    const errorResponseData: ProfileBioData = rawData || {
      name: String(formData.get('name') || currentAboutMe.name),
      title: String(formData.get('title') || currentAboutMe.title),
      bio: String(formData.get('bio') || currentAboutMe.bio),
      profileImage: String(formData.get('profileImage') || currentAboutMe.profileImage),
      dataAiHint: String(formData.get('dataAiHint') || currentAboutMe.dataAiHint),
    };
    return {
      message: "An unexpected server error occurred while updating profile & bio.",
      status: 'error',
      errors: {}, 
      data: errorResponseData,
    };
  }
}

// Server Action for Experience section
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
    
    const sortedIndices = Array.from(experienceIndices).sort((a,b) => parseInt(a) - parseInt(b));

    for (const index of sortedIndices) {
      const id = String(formData.get(`experience.${index}.id`) || `exp_fallback_${Date.now()}_${index}`);
      const role = String(formData.get(`experience.${index}.role`) || '');
      const company = String(formData.get(`experience.${index}.company`) || '');
      const period = String(formData.get(`experience.${index}.period`) || '');
      const description = String(formData.get(`experience.${index}.description`) || '');
      
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
      console.warn("Admin Experience Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update experience. Please check the errors below.",
        status: 'error',
        errors: fieldErrors as z.inferFlattenedErrors<typeof experienceSectionSchema>['fieldErrors'],
        data: rawDataForZod, 
      };
    }

    const dataToSave = validatedFields.data;

    const allData = await readDataFromFile();
    allData.aboutMe.experience = dataToSave.experience; 
    await writeDataToFile(allData);

    revalidatePath('/about');

    return {
      message: "Experience data updated successfully!",
      status: 'success',
      data: dataToSave, 
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

// Server Action for Education section
export async function updateEducationDataAction(
  prevState: UpdateEducationDataFormState,
  formData: FormData
): Promise<UpdateEducationDataFormState> {
  let rawDataForZod: EducationSectionData | undefined = undefined;
  try {
    const educationEntries: ZodEducationType[] = [];
    const educationIndices = new Set<string>();

    for (const [key] of formData.entries()) {
      if (key.startsWith('education.')) {
        educationIndices.add(key.split('.')[1]);
      }
    }
    
    const sortedIndices = Array.from(educationIndices).sort((a,b) => parseInt(a) - parseInt(b));

    for (const index of sortedIndices) {
      const id = String(formData.get(`education.${index}.id`) || `edu_fallback_${Date.now()}_${index}`);
      const degree = String(formData.get(`education.${index}.degree`) || '');
      const institution = String(formData.get(`education.${index}.institution`) || '');
      const period = String(formData.get(`education.${index}.period`) || '');

      if (degree.trim() !== '' || institution.trim() !== '' || period.trim() !== '' || (id && !id.startsWith('new_edu_'))) {
        educationEntries.push({ id, degree, institution, period });
      } else {
        console.warn(`Admin Education Action: Skipping entirely empty new education entry at form index ${index}.`);
      }
    }

    rawDataForZod = { education: educationEntries };

    const validatedFields = educationSectionSchema.safeParse(rawDataForZod);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      console.warn("Admin Education Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update education. Please check the errors below.",
        status: 'error',
        errors: fieldErrors as z.inferFlattenedErrors<typeof educationSectionSchema>['fieldErrors'],
        data: rawDataForZod,
      };
    }

    const dataToSave = validatedFields.data;

    const allData = await readDataFromFile();
    allData.aboutMe.education = dataToSave.education; 
    await writeDataToFile(allData);

    revalidatePath('/about');

    return {
      message: "Education data updated successfully!",
      status: 'success',
      data: dataToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Admin Education Action: An unexpected error occurred:", error);
    const errorResponseData: EducationSectionData = rawDataForZod || {
      education: [],
    };
    return {
      message: "An unexpected server error occurred while updating education.",
      status: 'error',
      errors: {},
      data: errorResponseData,
    };
  }
}


// Server Action for Contact & Socials
export async function updateAboutDataAction(
  prevState: UpdateAboutDataFormState,
  formData: FormData
): Promise<UpdateAboutDataFormState> {
  let rawDataForValidation: AboutMeData | undefined = undefined;

  try {
    const currentAppData = await readDataFromFile();
    const currentAboutMe = currentAppData.aboutMe;

    rawDataForValidation = {
      ...currentAboutMe, // Start with all current aboutMe data
      email: String(formData.get('email') || ''), // Override with form data
      linkedinUrl: String(formData.get('linkedinUrl') || ''),
      githubUrl: String(formData.get('githubUrl') || ''),
      twitterUrl: String(formData.get('twitterUrl') || ''),
    };
        
    const validatedFields = aboutMeSchema.safeParse(rawDataForValidation);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      console.warn("Admin Contact Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update contact data. Please check the errors below.",
        status: 'error',
        errors: fieldErrors,
        data: rawDataForValidation,
      };
    }

    const validatedContactData = validatedFields.data;

    const allDataToSave = { ...currentAppData }; 
    allDataToSave.aboutMe = {
      ...currentAboutMe, 
      email: validatedContactData.email,
      linkedinUrl: validatedContactData.linkedinUrl,
      githubUrl: validatedContactData.githubUrl,
      twitterUrl: validatedContactData.twitterUrl,
    };
      
    await writeDataToFile(allDataToSave);

    revalidatePath('/contact'); 
    revalidatePath('/about'); 
    revalidatePath('/');    

    return {
      message: "Contact & Socials data updated successfully!",
      status: 'success',
      data: { 
        ...currentAboutMe, 
        email: validatedContactData.email,
        linkedinUrl: validatedContactData.linkedinUrl,
        githubUrl: validatedContactData.githubUrl,
        twitterUrl: validatedContactData.twitterUrl,
      },
      errors: {},
    };

  } catch (error) {
    console.error("Admin Contact Action: An unexpected error occurred:", error);
    const fallbackAboutMe = rawDataForValidation || (await readDataFromFile()).aboutMe;
    return {
      message: "An unexpected server error occurred (Contact/Socials action).",
      status: 'error',
      errors: {}, 
      data: fallbackAboutMe,
    };
  }
}

