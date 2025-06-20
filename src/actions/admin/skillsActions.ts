
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Skill as LibSkillType } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultSkillsDataForClient, lucideIconsMap } from '@/lib/data'; 

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
    console.warn("Firestore not initialized in getSkillsAction. Returning default client skills.");
    return JSON.parse(JSON.stringify(defaultSkillsDataForClient)); 
  }
  try {
    const q = query(skillsCollectionRef(), orderBy('category', 'asc'), orderBy('name', 'asc'));
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
        proficiency: (data.proficiency === undefined || data.proficiency === null) ? null : Number(data.proficiency),
      } as LibSkillType;
    });
  } catch (error) {
    console.error("Error fetching skills from Firestore:", error);
    if (error instanceof Error && error.message.includes("query requires an index")) {
        console.error("Firebase Firestore: The query for skills requires a composite index. Please ensure it is created and active in your Firebase console.");
        console.error("Required index: Collection 'skills', Fields: 'category' (Ascending), 'name' (Ascending).");
    }
    return JSON.parse(JSON.stringify(defaultSkillsDataForClient)); 
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
      formDataOnError: {
        id: formData.get('id') as string || undefined,
        name: String(formData.get('name') || ''),
        category: String(formData.get('category') || 'Other') as LibSkillType['category'],
        proficiency: formData.get('proficiency') ? Number(formData.get('proficiency')) : undefined,
      }
    };
  }
  
  const idFromForm = formData.get('id');
  const rawData: SkillAdminFormData = {
    id: (idFromForm && typeof idFromForm === 'string' && idFromForm.trim() !== '') ? idFromForm.trim() : undefined,
    name: String(formData.get('name') || ''),
    category: String(formData.get('category') || 'Other') as LibSkillType['category'],
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

  const data = validatedFields.data; 
  let skillId = data.id; 
  if (!skillId) { 
      skillId = `skill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }
  
  const determinedIconName = lucideIconsMap[data.name] ? data.name : 'Package';


  const skillToSave: Omit<LibSkillType, 'id'> = {
    name: data.name,
    category: data.category,
    iconName: determinedIconName,
    proficiency: data.proficiency === undefined ? null : data.proficiency,
  };

  try {
    console.log(`Attempting to save skill (ID: ${skillId}):`, skillToSave); // Log what's being saved
    await setDoc(skillDocRef(skillId), skillToSave, { merge: true });
    
    const savedSkillData: LibSkillType = {
      id: skillId,
      ...skillToSave,
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
    let specificErrorMessage = "An unknown server error occurred during save.";
    if (error instanceof Error) {
        specificErrorMessage = error.message;
        // Firebase errors often have a 'code' property
        if ((error as any).code) {
            specificErrorMessage = `Firebase Error (${(error as any).code}): ${error.message}`;
        }
    }
    console.error("Error saving skill to Firestore:", specificErrorMessage, error); // Log the full error too
    return {
      message: `Failed to save skill: ${specificErrorMessage}`, // Return the more specific message
      status: 'error',
      errors: {},
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


