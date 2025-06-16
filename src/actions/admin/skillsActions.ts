
"use server";

import type { Skill } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';
import fs from 'fs/promises';
import path from 'path';
import type { PortfolioItem, AboutMeData } from '@/lib/types';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

interface AppData {
  portfolioItems: PortfolioItem[]; 
  skills: Skill[];
  aboutMe: AboutMeData; 
}

async function readDataFromFile(): Promise<AppData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading data file in skillsActions, returning empty structure:", error);
    return { 
        portfolioItems: [], 
        skills: [], 
        aboutMe: { 
            name: '', 
            title: '', 
            bio: '', 
            profileImage: '', 
            dataAiHint: '', 
            experience: [], 
            education: [] 
        } 
    };
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

  const rawData: SkillAdminFormData = {
    id: formData.get('id') as string || undefined,
    name: formData.get('name') as string,
    category: formData.get('category') as Skill['category'],
    proficiency: proficiencyValue,
    iconName: formData.get('iconName') as string,
  };
  
  const validatedFields = skillAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save skill. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
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
    if (data.id) { // Editing existing skill
      const skillIndex = allData.skills.findIndex(s => s.id === data.id);
      if (skillIndex > -1) {
        allData.skills[skillIndex] = skillToSave;
      } else {
        // Should not happen if ID is present, but handle defensively
        allData.skills.push(skillToSave);
      }
    } else { // Adding new skill
      allData.skills.push(skillToSave);
    }
    await writeDataToFile(allData);

    return {
      message: `Skill "${skillToSave.name}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      skill: skillToSave,
    };

  } catch (error) {
    console.error("Error saving skill:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      status: 'error',
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
        return { success: false, message: "Failed to delete skill." };
    }
}

    