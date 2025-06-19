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
  images: ['https://placehold.co/600x400.png'],
  tags: ['default'],
  slug: `default-project-${Date.now()}`,
  dataAiHint: 'project',
  readmeContent: '# Default README',
  liveUrl: '',
  repoUrl: '',
};

// Action to get all portfolio items
export async function getPortfolioItemsAction(): Promise<LibPortfolioItemType[]> {
  try {
    const portfolioCollection = collection(firestore, 'portfolioItems');
    // Order by createdAt in descending order to get newest first
    const q = query(portfolioCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No portfolio items found in Firestore.");
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
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : defaultPortfolioItem.images,
        tags: Array.isArray(data.tags) ? data.tags : defaultPortfolioItem.tags,
        liveUrl: data.liveUrl || '',
        repoUrl: data.repoUrl || '',
        slug: data.slug || `project-${docSnap.id}`, // Fallback slug
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
  try {
    const portfolioCollection = collection(firestore, 'portfolioItems');
    const q = query(portfolioCollection, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`No portfolio item found with slug: ${slug}`);
      return null;
    }
    
    const docSnap = snapshot.docs[0]; // Assuming slugs are unique
    const data = docSnap.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString();
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : new Date().toISOString();

    return {
      id: docSnap.id,
      title: data.title || defaultPortfolioItem.title,
      description: data.description || defaultPortfolioItem.description,
      longDescription: data.longDescription || defaultPortfolioItem.longDescription,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : defaultPortfolioItem.images,
      tags: Array.isArray(data.tags) ? data.tags : defaultPortfolioItem.tags,
      liveUrl: data.liveUrl || '',
      repoUrl: data.repoUrl || '',
      slug: data.slug, // Should definitely exist if queried by it
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
    console.error("Admin Portfolio Action: Zod validation failed. Errors:", JSON.stringify(validatedFields.error.flatten().fieldErrors));
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
  if (data.image2) images.push(data.image2);

  const tags: string[] = data.tagsString ? data.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  const projectDataForFirestore: Omit<LibPortfolioItemType, 'id' | 'createdAt' | 'updatedAt'> & { updatedAt: any, createdAt?: any } = {
    title: data.title,
    description: data.description,
    longDescription: data.longDescription || '', // Ensure it's not undefined
    images,
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
    if (projectId) { // Existing project
      const projectRef = doc(firestore, 'portfolioItems', projectId);
      await setDoc(projectRef, projectDataForFirestore, { merge: true });
    } else { // New project
      projectDataForFirestore.createdAt = serverTimestamp(); // Add createdAt for new projects
      const newProjectRef = await addDoc(collection(firestore, 'portfolioItems'), projectDataForFirestore);
      projectId = newProjectRef.id;
    }
    
    // Fetch the saved/updated project to return its complete data, including resolved timestamps
    const savedDoc = await getDoc(doc(firestore, 'portfolioItems', projectId));
    if (!savedDoc.exists()) {
        throw new Error("Failed to retrieve saved project from Firestore.");
    }
    const savedData = savedDoc.data();
    const createdAt = savedData.createdAt instanceof Timestamp ? savedData.createdAt.toDate().toISOString() : new Date().toISOString();
    const updatedAt = savedData.updatedAt instanceof Timestamp ? savedData.updatedAt.toDate().toISOString() : new Date().toISOString();


    const finalSavedProject: LibPortfolioItemType = {
      id: projectId,
      ...projectDataForFirestore, // spread the data we intended to save
      // Override with actual Firestore data where appropriate, especially timestamps
      title: savedData.title || projectDataForFirestore.title,
      description: savedData.description || projectDataForFirestore.description,
      images: savedData.images || projectDataForFirestore.images,
      tags: savedData.tags || projectDataForFirestore.tags,
      slug: savedData.slug || projectDataForFirestore.slug,
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
    try {
        const projectRef = doc(firestore, 'portfolioItems', itemId);
        const projectDoc = await getDoc(projectRef);
        if (!projectDoc.exists()) {
             return { success: false, message: `Project (ID: ${itemId}) not found for deletion.` };
        }
        const projectToDeleteData = projectDoc.data();
        await deleteDoc(projectRef);

        revalidatePath('/portfolio');
        revalidatePath('/'); 
        if (projectToDeleteData?.slug) {
          revalidatePath(`/portfolio/${projectToDeleteData.slug}`);
        }
        revalidatePath('/admin/portfolio');
        return { success: true, message: `Project (ID: ${itemId}) deleted successfully!` };
        
    } catch (error)
     {
        console.error("Error deleting portfolio item from Firestore:", error);
        return { success: false, message: "Failed to delete project due to a server error." };
    }
}
