
"use server";

import type { z } from 'zod';
import { firestore } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultSiteSettingsForClient } from '@/lib/data'; 

const siteSettingsDocRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'app_config', 'siteSettingsDoc');
}

// --- Get Site Settings Action ---
export async function getSiteSettingsAction(): Promise<SiteSettings> {
  if (!firestore) {
    console.warn("Firestore not initialized in getSiteSettingsAction. Returning default settings.");
    return JSON.parse(JSON.stringify(defaultSiteSettingsForClient)); // Deep clone
  }
  try {
    const docSnap = await getDoc(siteSettingsDocRef());
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Merge with defaults to ensure all fields are present
      return {
        siteName: data.siteName || defaultSiteSettingsForClient.siteName,
        defaultMetaDescription: data.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription,
        defaultMetaKeywords: data.defaultMetaKeywords || defaultSiteSettingsForClient.defaultMetaKeywords,
        siteOgImageUrl: data.siteOgImageUrl || defaultSiteSettingsForClient.siteOgImageUrl,
      };
    } else {
      console.warn("Site settings document not found in Firestore. Returning default settings.");
      return JSON.parse(JSON.stringify(defaultSiteSettingsForClient)); // Deep clone
    }
  } catch (error) {
    console.error("Error fetching site settings from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultSiteSettingsForClient)); // Deep clone on error
  }
}

// --- Update Site Settings Action ---
export type UpdateSiteSettingsFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof siteSettingsAdminSchema>['fieldErrors'];
  data?: SiteSettingsAdminFormData; 
};

export async function updateSiteSettingsAction(
  prevState: UpdateSiteSettingsFormState,
  formData: FormData
): Promise<UpdateSiteSettingsFormState> {
  let currentSettings: SiteSettings;
  try {
    currentSettings = await getSiteSettingsAction(); // Fetch current to fill in any blanks for validation
  } catch (e) {
     console.error("Failed to read current site settings before update:", e);
     return { message: "Failed to read current settings. Update aborted.", status: 'error' };
  }

  if (!firestore) {
    return {
      message: "Firestore is not initialized. Cannot save settings.",
      status: 'error',
      errors: {},
      data: { 
        siteName: String(formData.get('siteName') || currentSettings.siteName),
        defaultMetaDescription: String(formData.get('defaultMetaDescription') || currentSettings.defaultMetaDescription),
        defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || currentSettings.defaultMetaKeywords || ''),
        siteOgImageUrl: String(formData.get('siteOgImageUrl') || currentSettings.siteOgImageUrl || ''),
      }
    };
  }
  
  let rawData: SiteSettingsAdminFormData | undefined = undefined;
  try {
    rawData = {
      siteName: String(formData.get('siteName') || currentSettings.siteName),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || currentSettings.defaultMetaDescription),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || currentSettings.defaultMetaKeywords || ''),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || currentSettings.siteOgImageUrl || ''),
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

    const dataToSave: SiteSettings = {
      siteName: validatedFields.data.siteName,
      defaultMetaDescription: validatedFields.data.defaultMetaDescription,
      defaultMetaKeywords: validatedFields.data.defaultMetaKeywords || '', // Ensure empty string if undefined
      siteOgImageUrl: validatedFields.data.siteOgImageUrl || '', // Ensure empty string if undefined
    };

    await setDoc(siteSettingsDocRef(), dataToSave, { merge: true });

    revalidatePath('/', 'layout'); 
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/portfolio');
    revalidatePath('/portfolio/[slug]', 'page'); 
    revalidatePath('/skills');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');


    return {
      message: "Site settings updated successfully!",
      status: 'success',
      data: dataToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Admin SiteSettings Action: An unexpected error occurred:", error);
    const errorResponseData: SiteSettingsAdminFormData = rawData || {
      siteName: String(formData.get('siteName') || defaultSiteSettingsForClient.siteName),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || defaultSiteSettingsForClient.defaultMetaDescription),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || defaultSiteSettingsForClient.defaultMetaKeywords || ''),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || defaultSiteSettingsForClient.siteOgImageUrl || ''),
    };
    return {
      message: "An unexpected server error occurred while updating site settings.",
      status: 'error',
      errors: {}, 
      data: errorResponseData,
    };
  }
}


    