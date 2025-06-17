
"use server";

import type { z } from 'zod';
import type { AppData, SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema } from '@/lib/adminSchemas';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

// Standardized default AppData structure (authoritative version)
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
  siteSettings: {
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
        console.warn("Data file is empty in settingsActions, returning default structure.");
        return defaultAppData;
    }
    const parsedData = JSON.parse(fileContent);
    // Comprehensive merging strategy
    return {
      ...defaultAppData, // Start with full default structure
      ...parsedData,     // Override with parsed data
      aboutMe: { ...defaultAppData.aboutMe, ...(parsedData.aboutMe ?? {}) }, // Deep merge for aboutMe
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : defaultAppData.skills,
      portfolioItems: Array.isArray(parsedData.portfolioItems) ? parsedData.portfolioItems : defaultAppData.portfolioItems,
      siteSettings: { ...defaultAppData.siteSettings, ...(parsedData.siteSettings ?? {}) }, // Deep merge for siteSettings
    };
  } catch (error) {
    console.error("Error reading or parsing data file in settingsActions, returning default structure:", error);
    return defaultAppData;
  }
}

async function writeDataToFile(data: AppData): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Get Site Settings Action ---
export async function getSiteSettingsAction(): Promise<SiteSettings> {
  const appData = await readDataFromFile();
  return appData.siteSettings;
}

// --- Update Site Settings Action ---
export type UpdateSiteSettingsFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof siteSettingsAdminSchema>['fieldErrors'];
  data?: SiteSettings;
};

export async function updateSiteSettingsAction(
  prevState: UpdateSiteSettingsFormState,
  formData: FormData
): Promise<UpdateSiteSettingsFormState> {
  let rawData: SiteSettings | undefined = undefined;
  try {
    rawData = {
      siteName: String(formData.get('siteName') || ''),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || ''),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || ''),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || ''),
    };

    const validatedFields = siteSettingsAdminSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      console.warn("Admin SiteSettings Action: Zod validation failed. Errors:", JSON.stringify(fieldErrors));
      return {
        message: "Failed to update site settings. Please check errors.",
        status: 'error',
        errors: fieldErrors,
        data: rawData,
      };
    }

    const dataToSave = validatedFields.data;

    const allData = await readDataFromFile();
    allData.siteSettings = dataToSave; 
    await writeDataToFile(allData);

    revalidatePath('/', 'layout'); 
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/portfolio');
    revalidatePath('/skills');
    revalidatePath('/contact');
    allData.portfolioItems.forEach(item => {
      if (item.slug) revalidatePath(`/portfolio/${item.slug}`);
    });


    return {
      message: "Site settings updated successfully!",
      status: 'success',
      data: dataToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Admin SiteSettings Action: An unexpected error occurred:", error);
    const currentSettings = (await readDataFromFile()).siteSettings; // Fetch fresh defaults on error
    const errorResponseData: SiteSettings = rawData || {
      siteName: String(formData.get('siteName') || currentSettings.siteName),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || currentSettings.defaultMetaDescription),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || currentSettings.defaultMetaKeywords),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || currentSettings.siteOgImageUrl),
    };
    return {
      message: "An unexpected server error occurred while updating site settings.",
      status: 'error',
      errors: {}, 
      data: errorResponseData,
    };
  }
}

