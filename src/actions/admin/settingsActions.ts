
"use server";

import type { z } from 'zod';
import { firestore } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultSiteSettingsForClient } from '@/lib/data';


const criticalErrorLog = "CRITICAL_ERROR: Firestore is not initialized in settingsActions.ts. Admin operations will fail.";
if (!firestore) {
  console.error(criticalErrorLog);
}

const siteSettingsDocRef = () => {
  if (!firestore) throw new Error("Firestore not initialized for siteSettingsDocRef().");
  return doc(firestore, 'app_config', 'siteSettingsDoc');
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
  if (!firestore) {
    console.warn("Firestore not initialized in getSiteSettingsAction. Returning default settings.");
    return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
  }
  try {
    const docSnap = await getDoc(siteSettingsDocRef());
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        siteName: data.siteName || defaultSiteSettingsForClient.siteName,
        defaultMetaDescription: data.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription,
        defaultMetaKeywords: data.defaultMetaKeywords || defaultSiteSettingsForClient.defaultMetaKeywords,
        siteOgImageUrl: data.siteOgImageUrl || defaultSiteSettingsForClient.siteOgImageUrl,
        maintenanceMode: typeof data.maintenanceMode === 'boolean' ? data.maintenanceMode : defaultSiteSettingsForClient.maintenanceMode,
        skillsPageMetaTitle: data.skillsPageMetaTitle || defaultSiteSettingsForClient.skillsPageMetaTitle, // Added
        skillsPageMetaDescription: data.skillsPageMetaDescription || defaultSiteSettingsForClient.skillsPageMetaDescription, // Added
      };
    } else {
      console.warn("Site settings document not found in Firestore. Returning default settings.");
      return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
    }
  } catch (error) {
    console.error("Error fetching site settings from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
  }
}

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
  if (!firestore) {
    return {
      message: criticalErrorLog,
      status: 'error',
      errors: {},
      data: { 
        siteName: String(formData.get('siteName') || defaultSiteSettingsForClient.siteName),
        defaultMetaDescription: String(formData.get('defaultMetaDescription') || defaultSiteSettingsForClient.defaultMetaDescription),
        defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || defaultSiteSettingsForClient.defaultMetaKeywords || ''),
        siteOgImageUrl: String(formData.get('siteOgImageUrl') || defaultSiteSettingsForClient.siteOgImageUrl || ''),
        maintenanceMode: formData.get('maintenanceMode') === 'on',
        skillsPageMetaTitle: String(formData.get('skillsPageMetaTitle') || defaultSiteSettingsForClient.skillsPageMetaTitle || ''), // Added
        skillsPageMetaDescription: String(formData.get('skillsPageMetaDescription') || defaultSiteSettingsForClient.skillsPageMetaDescription || ''), // Added
      }
    };
  }

  let currentSettings: SiteSettings;
  try {
    currentSettings = await getSiteSettingsAction(); 
  } catch (e) {
     console.error("Failed to read current site settings before update:", e);
     return { message: "Failed to read current settings. Update aborted.", status: 'error' };
  }

  let rawData: SiteSettingsAdminFormData | undefined = undefined;
  try {
    rawData = {
      siteName: String(formData.get('siteName') || currentSettings.siteName),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || currentSettings.defaultMetaDescription),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || currentSettings.defaultMetaKeywords || ''),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || currentSettings.siteOgImageUrl || ''),
      maintenanceMode: formData.get('maintenanceMode') === 'on',
      skillsPageMetaTitle: String(formData.get('skillsPageMetaTitle') || currentSettings.skillsPageMetaTitle || ''), // Added
      skillsPageMetaDescription: String(formData.get('skillsPageMetaDescription') || currentSettings.skillsPageMetaDescription || ''), // Added
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
      defaultMetaKeywords: validatedFields.data.defaultMetaKeywords || '',
      siteOgImageUrl: validatedFields.data.siteOgImageUrl || '',
      maintenanceMode: validatedFields.data.maintenanceMode || false,
      skillsPageMetaTitle: validatedFields.data.skillsPageMetaTitle || '', // Added
      skillsPageMetaDescription: validatedFields.data.skillsPageMetaDescription || '', // Added
    };

    await setDoc(siteSettingsDocRef(), dataToSave, { merge: true });

    revalidatePath('/', 'layout'); 
    revalidatePath('/'); 
    revalidatePath('/about');
    revalidatePath('/portfolio');
    revalidatePath('/portfolio/[slug]', 'page');
    revalidatePath('/skills'); // Ensure skills page is revalidated
    revalidatePath('/contact');
    revalidatePath('/admin/settings');

    return {
      message: "Site settings updated successfully!",
      status: 'success',
      data: validatedFields.data, 
      errors: {},
    };

  } catch (error) {
    console.error("Admin SiteSettings Action: An unexpected error occurred:", error);
    const errorResponseData: SiteSettingsAdminFormData = rawData || {
      siteName: String(formData.get('siteName') || defaultSiteSettingsForClient.siteName),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || defaultSiteSettingsForClient.defaultMetaDescription),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || defaultSiteSettingsForClient.defaultMetaKeywords || ''),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || defaultSiteSettingsForClient.siteOgImageUrl || ''),
      maintenanceMode: formData.get('maintenanceMode') === 'on',
      skillsPageMetaTitle: String(formData.get('skillsPageMetaTitle') || defaultSiteSettingsForClient.skillsPageMetaTitle || ''), // Added
      skillsPageMetaDescription: String(formData.get('skillsPageMetaDescription') || defaultSiteSettingsForClient.skillsPageMetaDescription || ''), // Added
    };
    const errorMessage = (error instanceof Error && 'code' in error)
      ? `Firebase error (${(error as any).code}): ${(error as Error).message}`
      : (error instanceof Error ? error.message : "An unknown server error occurred.");

    return {
      message: `An unexpected server error occurred while updating site settings: ${errorMessage}`,
      status: 'error',
      errors: {},
      data: errorResponseData,
    };
  }
}
