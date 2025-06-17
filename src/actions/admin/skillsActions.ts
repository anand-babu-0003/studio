
"use server";

import type { Skill, AppData } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';
import fs from 'fs/promises';
import path from 'path';
import { skillCategories, availableIconNames } from '@/lib/data'; // Ensure this import is correct and used

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
  skill?: Skill;
};

export async function saveSkillAction(
  prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  const proficiencyString = formData.get('proficiency') as string;
  const proficiencyValue = proficiencyString && proficiencyString.trim() !== '' ? Number(proficiencyString) : undefined;

  console.log("Server Action (skillsActions.ts): formData.get('category') =", formData.get('category'));
  console.log("Server Action (skillsActions.ts): formData.get('iconName') =", formData.get('iconName'));
  console.log("Server Action (skillsActions.ts): formData.get('name') =", formData.get('name'));
  console.log("Server Action (skillsActions.ts): formData.get('id') =", formData.get('id'));
  console.log("Server Action (skillsActions.ts): formData.get('proficiency') =", formData.get('proficiency'));


  const rawData: SkillAdminFormData = {
    id: formData.get('id') as string || undefined,
    name: formData.get('name') as string,
    category: formData.get('category') as Skill['category'],
    proficiency: proficiencyValue,
    iconName: formData.get('iconName') as string,
  };

  console.log("Server Action (skillsActions.ts): rawData for Zod validation:", rawData);

  // Log the enum arrays as seen by this server action instance
  console.log("Server Action (skillsActions.ts): skillCategories from @/lib/data:", skillCategories);
  console.log("Server Action (skillsActions.ts): availableIconNames from @/lib/data:", availableIconNames);

  const validatedFields = skillAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error("Server Action (skillsActions.ts): Zod validation failed. Errors:", JSON.stringify(validatedFields.error.flatten().fieldErrors));
    return {
      message: "Failed to save skill. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      skill: undefined,
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
        allData.skills.push(skillToSave);
      }
    } else {
      allData.skills.push(skillToSave);
    }
    await writeDataToFile(allData);

    return {
      message: `Skill "${skillToSave.name}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      skill: skillToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving skill in skillsActions.ts:", error);
    return {
      message: "An unexpected server error occurred while saving the skill. Please try again.",
      status: 'error',
      errors: {},
      skill: undefined,
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
          return { success: true, message: `Skill (ID: ${itemId}) deleted successfully!` };
        } else {
           return { success: false, message: `Skill (ID: ${itemId}) not found for deletion.` };
        }
    } catch (error) {
        console.error("Error deleting skill:", error);
        return { success: false, message: "Failed to delete skill due to a server error." };
    }
}

