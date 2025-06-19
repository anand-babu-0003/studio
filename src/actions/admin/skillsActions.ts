
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Skill as LibSkillType } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultSkillsDataForClient } from '@/lib/data'; // For fallback if needed

const skillsCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'skills');
}

const skillDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'skills', id);
}

export async function getSkillsAction(): Promise<LibSkillType[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getSkillsAction. Returning empty array.");
    return defaultSkillsDataForClient; // Fallback to default mock data
  }
  try {
    const q = query(skillsCollectionRef(), orderBy('category'), orderBy('name'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'Unnamed Skill',
        category: data.category || 'Other',
        iconName: data.iconName || 'Package',
        proficiency: data.proficiency === undefined || data.proficiency === null ? null : Number(data.proficiency),
      } as LibSkillType;
    });
  } catch (error) {
    console.error("Error fetching skills from Firestore:", error);
    return defaultSkillsDataForClient; // Fallback to default mock data on error
  }
}


export type SkillFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof SkillAdminFormData, string[]>>;
  formDataOnError?: SkillAdminFormData;
  savedSkill?: LibSkillType;
};

export async function saveSkillAction(
  prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  if (!firestore) {
    return { 
      message: "Firestore is not initialized. Cannot save skill.", 
      status: 'error', 
      formDataOnError: Object.fromEntries(formData.entries()) as SkillAdminFormData 
    };
  }
  
  const rawData: SkillAdminFormData = {
    id: formData.get('id') as string || undefined,
    name: String(formData.get('name') || ''),
    category: String(formData.get('category') || 'Other') as LibSkillType['category'],
    iconName: String(formData.get('iconName') || 'Package'),
    proficiency: formData.get('proficiency') as any, 
  };

  const validatedFields = skillAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save skill. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors as SkillFormState['errors'],
      formDataOnError: rawData,
    };
  }

  const data = validatedFields.data; // This is SkillAdminFormData after Zod validation
  let skillId = data.id || `skill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Construct the object to save to Firestore
  // Explicitly set proficiency to null if it's undefined after Zod processing
  const skillToSave: Omit<LibSkillType, 'id'> = {
    name: data.name,
    category: data.category,
    iconName: data.iconName,
    proficiency: data.proficiency === undefined ? null : data.proficiency,
  };

  try {
    await setDoc(skillDocRef(skillId), skillToSave, { merge: true });
    
    const savedSkillData: LibSkillType = {
      id: skillId,
      name: skillToSave.name,
      category: skillToSave.category,
      iconName: skillToSave.iconName,
      // Ensure proficiency reflects what was intended to be saved (null for undefined)
      proficiency: skillToSave.proficiency, 
    };

    revalidatePath('/skills');
    revalidatePath('/admin/skills');
    revalidatePath('/'); 

    return {
      message: `Skill "${savedSkillData.name}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedSkill: savedSkillData,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving skill to Firestore:", error); // THIS LOG IS CRITICAL
    return {
      message: "An unexpected server error occurred while saving the skill. Please try again.",
      status: 'error',
      errors: {}, // No specific field errors, as it's a general server error
      formDataOnError: rawData, 
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
    if (!firestore) {
      return { success: false, message: "Firestore not initialized. Cannot delete skill." };
    }
    try {
        await deleteDoc(skillDocRef(itemId));
        revalidatePath('/skills');
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return { success: true, message: `Skill (ID: ${itemId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting skill from Firestore:", error);
        return { success: false, message: "Failed to delete skill due to a server error." };
    }
}
