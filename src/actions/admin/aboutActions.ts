
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import type { AboutMeData, Experience as LibExperienceType, Education as LibEducationType } from '@/lib/types';
import { 
  aboutMeSchema, 
  profileBioSchema, type ProfileBioData,
  experienceSectionSchema, type ExperienceSectionData,
  educationSectionSchema, type EducationSectionData,
  type Experience as ZodExperienceType, 
  type Education as ZodEducationType 
} from '@/lib/adminSchemas';
import type { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { defaultAboutMeDataForClient } from '@/lib/data'; 

const aboutMeDocRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'app_config', 'aboutMeDoc');
}

async function readAboutMeDataFromFirestore(): Promise<AboutMeData> {
  if (!firestore) {
    console.warn("Firestore not initialized in readAboutMeDataFromFirestore. Returning default data.");
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); // Deep clone
  }
  try {
    const docSnap = await getDoc(aboutMeDocRef());
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<AboutMeData>;
      const defaultData = defaultAboutMeDataForClient;
      return {
        name: data.name || defaultData.name,
        title: data.title || defaultData.title,
        bio: data.bio || defaultData.bio,
        profileImage: data.profileImage || defaultData.profileImage,
        dataAiHint: data.dataAiHint || defaultData.dataAiHint,
        experience: (data.experience || defaultData.experience).map(exp => ({ 
            ...exp, 
            id: exp.id || `exp_fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
        education: (data.education || defaultData.education).map(edu => ({ 
            ...edu, 
            id: edu.id || `edu_fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
        email: data.email || defaultData.email,
        linkedinUrl: data.linkedinUrl || defaultData.linkedinUrl,
        githubUrl: data.githubUrl || defaultData.githubUrl,
        twitterUrl: data.twitterUrl || defaultData.twitterUrl,
      };
    }
    console.warn("AboutMe document not found in Firestore. Returning default data.");
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); // Deep clone
  } catch (error) {
    console.error("Error reading AboutMeData from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); // Deep clone
  }
}

async function writeAboutMeDataToFirestore(data: AboutMeData): Promise<void> {
  if (!firestore) throw new Error("Firestore not initialized. Cannot write AboutMeData.");
  // Ensure experience and education items have IDs before writing
  const dataToSave: AboutMeData = {
    ...data,
    experience: data.experience.map(exp => ({
      ...exp,
      id: exp.id || `exp_fs_write_${Date.now()}_${Math.random().toString(36).substring(2,7)}`
    })),
    education: data.education.map(edu => ({
      ...edu,
      id: edu.id || `edu_fs_write_${Date.now()}_${Math.random().toString(36).substring(2,7)}`
    }))
  };
  await setDoc(aboutMeDocRef(), dataToSave, { merge: true });
}


export type UpdateAboutDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof aboutMeSchema>['fieldErrors'];
  data?: AboutMeData; 
};

export type UpdateProfileBioDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof profileBioSchema>['fieldErrors'];
  data?: ProfileBioData; 
};

export type UpdateExperienceDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof experienceSectionSchema>['fieldErrors'];
  data?: ExperienceSectionData; 
};

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
  let currentAboutMeData: AboutMeData;
  try {
    currentAboutMeData = await readAboutMeDataFromFirestore();
  } catch (e) {
    console.error("Failed to read current About Me data before update:", e);
    return { message: "Failed to read current settings. Update aborted.", status: 'error', data: Object.fromEntries(formData.entries()) as ProfileBioData };
  }

  if (!firestore) {
    return { message: "Firestore not initialized.", status: 'error', data: Object.fromEntries(formData.entries()) as ProfileBioData };
  }
  let rawData: ProfileBioData | undefined = undefined;
  try {
    rawData = {
      name: String(formData.get('name') || currentAboutMeData.name),
      title: String(formData.get('title') || currentAboutMeData.title),
      bio: String(formData.get('bio') || currentAboutMeData.bio),
      profileImage: String(formData.get('profileImage') || currentAboutMeData.profileImage || ''),
      dataAiHint: String(formData.get('dataAiHint') || currentAboutMeData.dataAiHint || ''),
    };

    const validatedFields = profileBioSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "Failed to update profile & bio. Please check errors.",
        status: 'error',
        errors: fieldErrors,
        data: rawData,
      };
    }

    const dataToSave = validatedFields.data;
    const updatedAboutMeData: AboutMeData = {
      ...currentAboutMeData,
      name: dataToSave.name,
      title: dataToSave.title,
      bio: dataToSave.bio,
      profileImage: dataToSave.profileImage || defaultAboutMeDataForClient.profileImage, // Ensure fallback if cleared
      dataAiHint: dataToSave.dataAiHint || defaultAboutMeDataForClient.dataAiHint,     // Ensure fallback if cleared
    };
    await writeAboutMeDataToFirestore(updatedAboutMeData);

    revalidatePath('/', 'layout'); // Revalidate layout as Footer/Navbar might use this data
    revalidatePath('/about');
    revalidatePath('/'); 
    revalidatePath('/contact'); 
    revalidatePath('/admin/about');

    return {
      message: "Profile & Bio data updated successfully!",
      status: 'success',
      data: dataToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Admin ProfileBio Action: An unexpected error occurred:", error);
    const errorResponseData: ProfileBioData = rawData || {
      name: String(formData.get('name') || currentAboutMeData.name),
      title: String(formData.get('title') || currentAboutMeData.title),
      bio: String(formData.get('bio') || currentAboutMeData.bio),
      profileImage: String(formData.get('profileImage') || currentAboutMeData.profileImage || ''),
      dataAiHint: String(formData.get('dataAiHint') || currentAboutMeData.dataAiHint || ''),
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
  let currentAboutMeData: AboutMeData;
  try {
    currentAboutMeData = await readAboutMeDataFromFirestore();
  } catch (e) {
    console.error("Failed to read current About Me data before update:", e);
    return { message: "Failed to read current settings. Update aborted.", status: 'error', data: { experience: [] } };
  }
  if (!firestore) {
    return { message: "Firestore not initialized.", status: 'error', data: { experience: [] } };
  }
  let rawDataForZod: ExperienceSectionData | undefined = undefined;
  try {
    const experienceEntries: ZodExperienceType[] = [];
    const experienceIndices = new Set<string>();

    for (const [key] of formData.entries()) {
      if (key.startsWith('experience.') && key.includes('.id')) {
        experienceIndices.add(key.split('.')[1]);
      }
    }
    
    const sortedIndices = Array.from(experienceIndices).sort((a,b) => parseInt(a) - parseInt(b));

    for (const index of sortedIndices) {
      const id = String(formData.get(`experience.${index}.id`) || `exp_new_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
      const role = String(formData.get(`experience.${index}.role`) || '');
      const company = String(formData.get(`experience.${index}.company`) || '');
      const period = String(formData.get(`experience.${index}.period`) || '');
      const description = String(formData.get(`experience.${index}.description`) || '');
      
      experienceEntries.push({ id, role, company, period, description });
    }
    
    rawDataForZod = { experience: experienceEntries };
        
    const validatedFields = experienceSectionSchema.safeParse(rawDataForZod);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "Failed to update experience. Please check the errors below.",
        status: 'error',
        errors: fieldErrors as z.inferFlattenedErrors<typeof experienceSectionSchema>['fieldErrors'],
        data: rawDataForZod, 
      };
    }

    const dataToSave = validatedFields.data;
    const updatedAboutMeData: AboutMeData = {
      ...currentAboutMeData,
      experience: (dataToSave.experience || []).map(exp => ({ 
        ...exp,
        id: exp.id.startsWith('new_exp_') ? `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` : exp.id
      })),
    };
    await writeAboutMeDataToFirestore(updatedAboutMeData);

    revalidatePath('/about');
    revalidatePath('/admin/about');

    return {
      message: "Experience data updated successfully!",
      status: 'success',
      data: { experience: updatedAboutMeData.experience }, 
      errors: {},
    };

  } catch (error) {
    console.error("Admin Experience Action: An unexpected error occurred:", error);
    const errorResponseData: ExperienceSectionData = rawDataForZod || { experience: currentAboutMeData.experience };
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
  let currentAboutMeData: AboutMeData;
  try {
    currentAboutMeData = await readAboutMeDataFromFirestore();
  } catch (e) {
    console.error("Failed to read current About Me data before update:", e);
     return { message: "Failed to read current settings. Update aborted.", status: 'error', data: { education: [] } };
  }
  if (!firestore) {
    return { message: "Firestore not initialized.", status: 'error', data: { education: [] } };
  }
  let rawDataForZod: EducationSectionData | undefined = undefined;
  try {
    const educationEntries: ZodEducationType[] = [];
    const educationIndices = new Set<string>();

    for (const [key] of formData.entries()) {
      if (key.startsWith('education.') && key.includes('.id')) {
        educationIndices.add(key.split('.')[1]);
      }
    }
    
    const sortedIndices = Array.from(educationIndices).sort((a,b) => parseInt(a) - parseInt(b));

    for (const index of sortedIndices) {
      const id = String(formData.get(`education.${index}.id`) || `edu_new_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
      const degree = String(formData.get(`education.${index}.degree`) || '');
      const institution = String(formData.get(`education.${index}.institution`) || '');
      const period = String(formData.get(`education.${index}.period`) || '');

      educationEntries.push({ id, degree, institution, period });
    }

    rawDataForZod = { education: educationEntries };
    const validatedFields = educationSectionSchema.safeParse(rawDataForZod);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "Failed to update education. Please check the errors below.",
        status: 'error',
        errors: fieldErrors as z.inferFlattenedErrors<typeof educationSectionSchema>['fieldErrors'],
        data: rawDataForZod,
      };
    }

    const dataToSave = validatedFields.data;
    const updatedAboutMeData: AboutMeData = {
      ...currentAboutMeData,
      education: (dataToSave.education || []).map(edu => ({
        ...edu,
        id: edu.id.startsWith('new_edu_') ? `edu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` : edu.id
      })),
    };
    await writeAboutMeDataToFirestore(updatedAboutMeData);

    revalidatePath('/about');
    revalidatePath('/admin/about');

    return {
      message: "Education data updated successfully!",
      status: 'success',
      data: { education: updatedAboutMeData.education },
      errors: {},
    };

  } catch (error) {
    console.error("Admin Education Action: An unexpected error occurred:", error);
    const errorResponseData: EducationSectionData = rawDataForZod || { education: currentAboutMeData.education };
    return {
      message: "An unexpected server error occurred while updating education.",
      status: 'error',
      errors: {},
      data: errorResponseData,
    };
  }
}

// Server Action for Contact & Socials
export async function updateAboutDataAction( // This action name implies updating the whole AboutMeData
  prevState: UpdateAboutDataFormState,
  formData: FormData
): Promise<UpdateAboutDataFormState> {
  let currentAboutMeData: AboutMeData;
  try {
    currentAboutMeData = await readAboutMeDataFromFirestore();
  } catch (e) {
    console.error("Failed to read current About Me data before update:", e);
    return { message: "Failed to read current settings. Update aborted.", status: 'error', data: defaultAboutMeDataForClient };
  }

  if (!firestore) {
    return { message: "Firestore not initialized.", status: 'error', data: currentAboutMeData };
  }
  
  let rawDataForValidation: Partial<AboutMeData> | undefined = undefined;

  try {
    rawDataForValidation = {
      ...currentAboutMeData, 
      email: String(formData.get('email') || currentAboutMeData.email || ''),
      linkedinUrl: String(formData.get('linkedinUrl') || currentAboutMeData.linkedinUrl || ''),
      githubUrl: String(formData.get('githubUrl') || currentAboutMeData.githubUrl || ''),
      twitterUrl: String(formData.get('twitterUrl') || currentAboutMeData.twitterUrl || ''),
    };
        
    const validatedFields = aboutMeSchema.safeParse(rawDataForValidation);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "Failed to update contact data. Please check the errors below.",
        status: 'error',
        errors: fieldErrors,
        data: rawDataForValidation as AboutMeData, 
      };
    }

    const dataToSave: AboutMeData = {
        ...currentAboutMeData,
        email: validatedFields.data.email || '', // Ensure empty string if undefined from Zod
        linkedinUrl: validatedFields.data.linkedinUrl || '',
        githubUrl: validatedFields.data.githubUrl || '',
        twitterUrl: validatedFields.data.twitterUrl || '',
    };
      
    await writeAboutMeDataToFirestore(dataToSave);

    revalidatePath('/', 'layout'); // Revalidate layout as Footer/Navbar might use this data
    revalidatePath('/contact'); 
    revalidatePath('/about'); 
    revalidatePath('/');    
    revalidatePath('/admin/about');

    return {
      message: "Contact & Socials data updated successfully!",
      status: 'success',
      data: dataToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Admin Contact Action: An unexpected error occurred:", error);
    const fallbackData = rawDataForValidation ? rawDataForValidation as AboutMeData : currentAboutMeData;
    return {
      message: "An unexpected server error occurred (Contact/Socials action).",
      status: 'error',
      errors: {}, 
      data: fallbackData,
    };
  }
}

    