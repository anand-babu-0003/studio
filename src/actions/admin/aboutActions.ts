
"use server";

import type { AboutMeData, Experience, Education, AppData } from '@/lib/types';
import { 
  aboutMeSchema, 
  profileBioSchema, type ProfileBioData,
  experienceSectionSchema, type ExperienceSectionData,
  educationSectionSchema, type EducationSectionData,
  type Experience as ZodExperienceType, // Renaming to avoid conflict with lib/types Experience
  type Education as ZodEducationType // Renaming to avoid conflict with lib/types Education
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

// State type for the original full About Me form
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
  data?: ProfileBioData; 
};

// State type for the new Experience section form
export type UpdateExperienceDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof experienceSectionSchema>['fieldErrors'];
  data?: ExperienceSectionData; 
};

// State type for the new Education section form
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
      ...allData.aboutMe, 
      ...dataToSave,    
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

    for (const index of Array.from(experienceIndices).sort((a,b) => parseInt(a) - parseInt(b))) {
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

    for (const index of Array.from(educationIndices).sort((a, b) => parseInt(a) - parseInt(b))) {
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
    allData.aboutMe.education = dataToSave.education; // Update only the education part
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


// Original action - will be refactored or removed later (now only for Contact)
export async function updateAboutDataAction(
  prevState: UpdateAboutDataFormState,
  formData: FormData
): Promise<UpdateAboutDataFormState> {
  let rawData: AboutMeData | undefined = undefined;

  try {
    // This action should now primarily focus on contact fields.
    // Experience and Education are managed by their own actions.
    // We read existing data and only update contact fields from formData.
    
    const currentData = await readDataFromFile();

    rawData = {
      // Keep existing values for fields not managed by this action
      name: currentData.aboutMe.name, 
      title: currentData.aboutMe.title,
      bio: currentData.aboutMe.bio,
      profileImage: currentData.aboutMe.profileImage,
      dataAiHint: currentData.aboutMe.dataAiHint,
      experience: currentData.aboutMe.experience, 
      education: currentData.aboutMe.education, 
      // Update contact fields from formData
      email: String(formData.get('email') || ''),
      linkedinUrl: String(formData.get('linkedinUrl') || ''),
      githubUrl: String(formData.get('githubUrl') || ''),
      twitterUrl: String(formData.get('twitterUrl') || ''),
    };
        
    const validatedFields = aboutMeSchema.safeParse(rawData); // Still validate the whole object

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      // Filter errors to only show those relevant to contact fields if possible,
      // though validating the whole object might still show other errors if rawData was malformed.
      console.warn("Admin Contact Action (via full form): Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update contact data. Please check the errors below.",
        status: 'error',
        errors: fieldErrors, // Send all errors for now
        data: rawData, 
      };
    }

    const dataToSave = validatedFields.data;

    try {
      // Construct the new AppData, ensuring only contact fields are effectively changed by this action
      const allData = await readDataFromFile(); // Re-read to be safe
      allData.aboutMe.email = dataToSave.email;
      allData.aboutMe.linkedinUrl = dataToSave.linkedinUrl;
      allData.aboutMe.githubUrl = dataToSave.githubUrl;
      allData.aboutMe.twitterUrl = dataToSave.twitterUrl;
      // Other fields (name, title, bio, profileImage, experience, education) remain as they were from readDataFromFile
      
      await writeDataToFile(allData);

      revalidatePath('/about'); // For bio changes that might be reflected on about
      revalidatePath('/contact'); // For contact info changes
      revalidatePath('/'); // For potential footer/header changes

      return {
        message: "Contact & Socials data updated successfully!",
        status: 'success',
        data: dataToSave, // Return the full AboutMeData structure for consistency on client
        errors: {},
      };

    } catch (fileOpError) {
      console.error("Admin Contact Action (via full form): Error during file operation (read/write):", fileOpError); 
      return {
        message: "An error occurred while saving contact data to the file. Please try again.",
        status: 'error',
        errors: {}, 
        data: rawData, 
      };
    }

  } catch (error) {
    console.error("Admin Contact Action (via full form): An unexpected error occurred in the action:", error);
    const currentAboutMe = (await readDataFromFile()).aboutMe; // Fallback to current data
    const defaultErrorData: AboutMeData = {
        name: String(formData.get('name') || currentAboutMe.name),
        title: String(formData.get('title') || currentAboutMe.title),
        bio: String(formData.get('bio') || currentAboutMe.bio),
        profileImage: String(formData.get('profileImage') || currentAboutMe.profileImage),
        dataAiHint: String(formData.get('dataAiHint') || currentAboutMe.dataAiHint),
        experience: rawData?.experience || currentAboutMe.experience, 
        education: rawData?.education || currentAboutMe.education,  
        email: String(formData.get('email') || currentAboutMe.email),
        linkedinUrl: String(formData.get('linkedinUrl') || currentAboutMe.linkedinUrl),
        githubUrl: String(formData.get('githubUrl') || currentAboutMe.githubUrl),
        twitterUrl: String(formData.get('twitterUrl') || currentAboutMe.twitterUrl),
    };

    return {
      message: "An unexpected server error occurred (Contact/Socials action). Please check logs and try again.",
      status: 'error',
      errors: {}, 
      data: rawData || defaultErrorData, 
    };
  }
}

