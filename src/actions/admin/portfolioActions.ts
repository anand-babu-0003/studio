
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, query, where, serverTimestamp, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import type { PortfolioItem as LibPortfolioItemType } from '@/lib/types';
import { portfolioItemAdminSchema, type PortfolioAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';

const defaultPortfolioItem: Omit<LibPortfolioItemType, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'Untitled Project',
  description: 'Default description.',
  longDescription: 'More detailed default description.',
  images: ['https://placehold.co/600x400.png'], // Ensure default image
  tags: ['default'],
  slug: `default-project-${Date.now()}`,
  dataAiHint: 'project',
  readmeContent: '# Default README',
  liveUrl: '',
  repoUrl: '',
};

const portfolioCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'portfolioItems');
}

const portfolioDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'portfolioItems', id);
}

// Action to get all portfolio items
export async function getPortfolioItemsAction(): Promise<LibPortfolioItemType[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getPortfolioItemsAction. Returning empty array.");
    return [];
  }
  try {
    const q = query(portfolioCollectionRef(), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : new Date().toISOString();
      
      return {
        id: docSnap.id,
        title: data.title || defaultPortfolioItem.title,
        description: data.description || defaultPortfolioItem.description,
        longDescription: data.longDescription || defaultPortfolioItem.longDescription,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [...defaultPortfolioItem.images],
        tags: Array.isArray(data.tags) ? data.tags : [...defaultPortfolioItem.tags],
        liveUrl: data.liveUrl || '',
        repoUrl: data.repoUrl || '',
        slug: data.slug || `project-${docSnap.id}`,
        dataAiHint: data.dataAiHint || '',
        readmeContent: data.readmeContent || '',
        createdAt: createdAt,
        updatedAt: updatedAt,
      } as LibPortfolioItemType;
    });
  } catch (error) {
    console.error("Error fetching portfolio items from Firestore:", error);
    return []; 
  }
}

// Action to get a single portfolio item by its slug
export async function getPortfolioItemBySlugAction(slug: string): Promise<LibPortfolioItemType | null> {
  if (!slug) return null;
  if (!firestore) {
    console.warn(`Firestore not initialized in getPortfolioItemBySlugAction for slug: ${slug}. Returning null.`);
    return null;
  }
  try {
    const q = query(portfolioCollectionRef(), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }
    
    const docSnap = snapshot.docs[0]; 
    const data = docSnap.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString();
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : new Date().toISOString();

    return {
      id: docSnap.id,
      title: data.title || defaultPortfolioItem.title,
      description: data.description || defaultPortfolioItem.description,
      longDescription: data.longDescription || defaultPortfolioItem.longDescription,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [...defaultPortfolioItem.images],
      tags: Array.isArray(data.tags) ? data.tags : [...defaultPortfolioItem.tags],
      liveUrl: data.liveUrl || '',
      repoUrl: data.repoUrl || '',
      slug: data.slug, 
      dataAiHint: data.dataAiHint || '',
      readmeContent: data.readmeContent || '',
      createdAt: createdAt,
      updatedAt: updatedAt,
    } as LibPortfolioItemType;
  } catch (error) {
    console.error(`Error fetching portfolio item by slug ${slug}:`, error);
    return null;
  }
}


export type PortfolioFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof PortfolioAdminFormData, string[]>>;
  formDataOnError?: PortfolioAdminFormData; 
  savedProject?: LibPortfolioItemType;
};

export async function savePortfolioItemAction(
  prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  if (!firestore) {
    return { 
      message: "Firestore is not initialized. Cannot save project.", 
      status: 'error', 
      formDataOnError: Object.fromEntries(formData.entries()) as PortfolioAdminFormData 
    };
  }

  const rawData: PortfolioAdminFormData = {
    id: formData.get('id') as string || undefined,
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    longDescription: String(formData.get('longDescription') || ''),
    image1: String(formData.get('image1') || ''),
    image2: String(formData.get('image2') || ''),
    tagsString: String(formData.get('tagsString') || ''),
    liveUrl: String(formData.get('liveUrl') || ''),
    repoUrl: String(formData.get('repoUrl') || ''),
    slug: String(formData.get('slug') || ''),
    dataAiHint: String(formData.get('dataAiHint') || ''),
    readmeContent: String(formData.get('readmeContent') || ''),
  };

  const validatedFields = portfolioItemAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save project. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      formDataOnError: rawData,
    };
  }

  const data = validatedFields.data;
  const images: string[] = [];
  if (data.image1) images.push(data.image1);
  else images.push(defaultPortfolioItem.images[0]); // Ensure at least one default image
  if (data.image2) images.push(data.image2);

  const tags: string[] = data.tagsString ? data.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  const projectDataForFirestore: Omit<LibPortfolioItemType, 'id' | 'createdAt' | 'updatedAt'> & { updatedAt: any, createdAt?: any } = {
    title: data.title,
    description: data.description,
    longDescription: data.longDescription || '', 
    images: images.length > 0 ? images : [...defaultPortfolioItem.images], // ensure default if empty
    tags,
    liveUrl: data.liveUrl || '',
    repoUrl: data.repoUrl || '',
    slug: data.slug,
    dataAiHint: data.dataAiHint || '',
    readmeContent: data.readmeContent || '',
    updatedAt: serverTimestamp(),
  };
  
  let projectId = data.id;

  try {
    if (projectId) { 
      await setDoc(portfolioDocRef(projectId), projectDataForFirestore, { merge: true });
    } else { 
      projectDataForFirestore.createdAt = serverTimestamp(); 
      const newProjectRef = await addDoc(portfolioCollectionRef(), projectDataForFirestore);
      projectId = newProjectRef.id;
    }
    
    const savedDoc = await getDoc(portfolioDocRef(projectId!)); // projectId will be defined here
    if (!savedDoc.exists()) {
        throw new Error("Failed to retrieve saved project from Firestore.");
    }
    const savedData = savedDoc.data()!;
    const createdAt = savedData.createdAt instanceof Timestamp ? savedData.createdAt.toDate().toISOString() : new Date().toISOString();
    const updatedAt = savedData.updatedAt instanceof Timestamp ? savedData.updatedAt.toDate().toISOString() : new Date().toISOString();

    const finalSavedProject: LibPortfolioItemType = {
      id: projectId!,
      title: savedData.title || projectDataForFirestore.title,
      description: savedData.description || projectDataForFirestore.description,
      longDescription: savedData.longDescription || projectDataForFirestore.longDescription,
      images: savedData.images && savedData.images.length > 0 ? savedData.images : [...defaultPortfolioItem.images],
      tags: savedData.tags || projectDataForFirestore.tags,
      liveUrl: savedData.liveUrl || projectDataForFirestore.liveUrl,
      repoUrl: savedData.repoUrl || projectDataForFirestore.repoUrl,
      slug: savedData.slug || projectDataForFirestore.slug,
      dataAiHint: savedData.dataAiHint || projectDataForFirestore.dataAiHint,
      readmeContent: savedData.readmeContent || projectDataForFirestore.readmeContent,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    revalidatePath('/portfolio');
    revalidatePath('/'); 
    if (finalSavedProject.slug) {
      revalidatePath(`/portfolio/${finalSavedProject.slug}`);
    }
    revalidatePath('/admin/portfolio');

    return {
      message: `Project "${finalSavedProject.title}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedProject: finalSavedProject,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving portfolio project to Firestore:", error);
    return {
      message: "An unexpected server error occurred while saving the project. Please try again.",
      status: 'error',
      errors: {},
      formDataOnError: rawData,
    };
  }
}

export type DeletePortfolioItemResult = {
    success: boolean;
    message: string;
};

export async function deletePortfolioItemAction(itemId: string): Promise<DeletePortfolioItemResult> {
    if (!itemId) {
        return { success: false, message: "No item ID provided for deletion." };
    }
    if (!firestore) {
      return { success: false, message: "Firestore not initialized. Cannot delete project." };
    }
    try {
        const projectDocSnap = await getDoc(portfolioDocRef(itemId));
        if (!projectDocSnap.exists()) {
             return { success: false, message: `Project (ID: ${itemId}) not found for deletion.` };
        }
        const projectToDeleteData = projectDocSnap.data();
        await deleteDoc(portfolioDocRef(itemId));

        revalidatePath('/portfolio');
        revalidatePath('/'); 
        if (projectToDeleteData?.slug) {
          revalidatePath(`/portfolio/${projectToDeleteData.slug}`);
        }
        revalidatePath('/admin/portfolio');
        return { success: true, message: `Project (ID: ${itemId}) deleted successfully!` };
        
    } catch (error) {
        console.error("Error deleting portfolio item from Firestore:", error);
        return { success: false, message: "Failed to delete project due to a server error." };
    }
}
