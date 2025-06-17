
"use server";

import type { Skill, AppData } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';
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
        console.warn("Data file is empty in skillsActions, returning default structure.");
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
      siteSettings: { // Ensure siteSettings is also populated
        ...localDefaultAppData.siteSettings,
        ...(parsedData.siteSettings ?? {}),
      }
    };
  } catch (error) {
    console.error("Error reading or parsing data file in skillsActions, returning default structure:", error);
    return localDefaultAppData;
  }
}

async function writeDataToFile(data: AppData): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export type SkillFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof SkillAdminFormData, string[]>>;
  // On error, `formDataOnError` will contain the attempted data. On success, `savedSkill` will.
  formDataOnError?: SkillAdminFormData;
  savedSkill?: Skill;
};

export async function saveSkillAction(
  prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  
  const idFromForm = formData.get('id');
  const nameFromForm = formData.get('name');
  const categoryFromForm = formData.get('category');
  const iconNameFromForm = formData.get('iconName');
  const proficiencyString = formData.get('proficiency'); 

  const proficiencyValue = (proficiencyString !== null && String(proficiencyString).trim() !== '') 
    ? Number(proficiencyString) 
    : undefined;

  // This is the data that will be validated and potentially returned on error
  const dataForZod: SkillAdminFormData = {
    id: typeof idFromForm === 'string' ? idFromForm : undefined,
    name: typeof nameFromForm === 'string' ? nameFromForm : '',
    category: (typeof categoryFromForm === 'string' ? categoryFromForm : '') as SkillAdminFormData['category'],
    proficiency: proficiencyValue,
    iconName: (typeof iconNameFromForm === 'string' ? iconNameFromForm : '') as SkillAdminFormData['iconName'],
  };

  const validatedFields = skillAdminSchema.safeParse(dataForZod);

  if (!validatedFields.success) {
    console.error("Admin Skill Action: Zod validation failed. Errors:", JSON.stringify(validatedFields.error.flatten().fieldErrors));
    return {
      message: "Failed to save skill. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors as SkillFormState['errors'],
      formDataOnError: dataForZod,
    };
  }

  const data = validatedFields.data;

  const skillToSave: Skill = {
    id: data.id || `skill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name,
    category: data.category,
    proficiency: data.proficiency ?? undefined, 
    iconName: data.iconName,
  };

  try {
    const allData = await readDataFromFile();
    if (data.id) {
      const skillIndex = allData.skills.findIndex(s => s.id === data.id);
      if (skillIndex > -1) {
        allData.skills[skillIndex] = skillToSave;
      } else {
        allData.skills.push(skillToSave); // Should not happen if ID is present but not found
      }
    } else {
      allData.skills.push(skillToSave);
    }
    await writeDataToFile(allData);

    revalidatePath('/skills');

    return {
      message: `Skill "${skillToSave.name}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedSkill: skillToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving skill in skillsActions.ts:", error);
    return {
      message: "An unexpected server error occurred while saving the skill. Please try again.",
      status: 'error',
      errors: {},
      formDataOnError: dataForZod, // Return dataForZod on file system error
    };
  }
}

export type DeleteSkillResult = {
    success: boolean;
    message: string;
};

export async function deleteSkillAction(itemId: string): Promise<DeleteSkillResult> {
    if (!itemId) {
        return { success: false, message: "No skill ID provided for deletion." };
    }
    try {
        const allData = await readDataFromFile();
        const initialLength = allData.skills.length;
        allData.skills = allData.skills.filter(s => s.id !== itemId);

        if (allData.skills.length < initialLength) {
          await writeDataToFile(allData);
          revalidatePath('/skills');
          return { success: true, message: `Skill (ID: ${itemId}) deleted successfully!` };
        } else {
           return { success: false, message: `Skill (ID: ${itemId}) not found for deletion.` };
        }
    } catch (error) {
        console.error("Error deleting skill:", error);
        return { success: false, message: "Failed to delete skill due to a server error." };
    }
}

