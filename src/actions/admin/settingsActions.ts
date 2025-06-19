
"use server";

import type { z } from 'zod';
import { firestore } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultSiteSettingsForClient } from '@/lib/data'; // For fallback

const siteSettingsDocRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'app_config', 'siteSettingsDoc');
}

// --- Get Site Settings Action ---
export async function getSiteSettingsAction(): Promise<SiteSettings> {
  if (!firestore) {
    console.warn("Firestore not initialized in getSiteSettingsAction. Returning default settings.");
    return defaultSiteSettingsForClient;
  }
  try {
    const docSnap = await getDoc(siteSettingsDocRef());
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    } else {
      console.warn("Site settings document not found in Firestore. Returning default settings.");
      return defaultSiteSettingsForClient;
    }
  } catch (error) {
    console.error("Error fetching site settings from Firestore:", error);
    return defaultSiteSettingsForClient; // Fallback to defaults on error
  }
}

// --- Update Site Settings Action ---
export type UpdateSiteSettingsFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof siteSettingsAdminSchema>['fieldErrors'];
  data?: SiteSettingsAdminFormData; // Use form data type here
};

export async function updateSiteSettingsAction(
  prevState: UpdateSiteSettingsFormState,
  formData: FormData
): Promise<UpdateSiteSettingsFormState> {
  if (!firestore) {
    return {
      message: "Firestore is not initialized. Cannot save settings.",
      status: 'error',
      errors: {},
      data: { // Reconstruct data from FormData for reset
        siteName: String(formData.get('siteName') || ''),
        defaultMetaDescription: String(formData.get('defaultMetaDescription') || ''),
        defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || ''),
        siteOgImageUrl: String(formData.get('siteOgImageUrl') || ''),
      }
    };
  }
  
  let rawData: SiteSettingsAdminFormData | undefined = undefined;
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

    const dataToSave: SiteSettings = validatedFields.data; // This is now SiteSettings type

    await setDoc(siteSettingsDocRef(), dataToSave, { merge: true });

    // Revalidate all relevant paths
    revalidatePath('/', 'layout'); // For <title> and meta tags in RootLayout
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/portfolio');
    revalidatePath('/portfolio/[slug]', 'page'); // Revalidate all slug pages
    revalidatePath('/skills');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');


    return {
      message: "Site settings updated successfully!",
      status: 'success',
      data: dataToSave, // Return the saved data (which matches SiteSettingsAdminFormData structure)
      errors: {},
    };

  } catch (error) {
    console.error("Admin SiteSettings Action: An unexpected error occurred:", error);
    const errorResponseData: SiteSettingsAdminFormData = rawData || {
      siteName: String(formData.get('siteName') || defaultSiteSettingsForClient.siteName),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || defaultSiteSettingsForClient.defaultMetaDescription),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || defaultSiteSettingsForClient.defaultMetaKeywords),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || defaultSiteSettingsForClient.siteOgImageUrl),
    };
    return {
      message: "An unexpected server error occurred while updating site settings.",
      status: 'error',
      errors: {}, 
      data: errorResponseData,
    };
  }
}
