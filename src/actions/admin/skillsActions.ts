
"use server";

import type { Skill } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';

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
    proficiency: data.proficiency ?? undefined, // Ensure it's undefined not null if empty
    iconName: data.iconName,
  };

  try {
    console.log("Saving skill (simulation):", JSON.stringify(skillToSave, null, 2));
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    return {
      message: `Skill "${skillToSave.name}" ${data.id ? 'updated' : 'added'} successfully! (Simulated Save)`,
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
        console.log(`Simulating deletion of skill with ID: ${itemId}`);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        return { success: true, message: `Skill (ID: ${itemId}) deleted successfully! (Simulated)` };
    } catch (error) {
        console.error("Error deleting skill:", error);
        return { success: false, message: "Failed to delete skill." };
    }
}
