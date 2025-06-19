
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, query, where, serverTimestamp, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import type { PortfolioItem as LibPortfolioItemType } from '@/lib/types';
import { portfolioItemAdminSchema, type PortfolioAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultPortfolioItemsDataForClient } from '@/lib/data'; 

const defaultPortfolioItemStructure: Omit<LibPortfolioItemType, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'Untitled Project',
  description: 'Default description for a new project.',
  longDescription: 'More detailed default description for a new project.',
  images: ['https://placehold.co/600x400.png?text=ProjectImage'],
  tags: ['new-project'],
  slug: `new-project-${Date.now()}`,
  dataAiHint: 'project placeholder',
  readmeContent: '# New Project README\n\nThis is a placeholder README content for a newly added project. Please update it with relevant information.',
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
    console.warn("Firestore not initialized in getPortfolioItemsAction. Returning default client items.");
    return JSON.parse(JSON.stringify(defaultPortfolioItemsDataForClient)); // Deep clone
  }
  try {
    const q = query(portfolioCollectionRef(), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date(0).toISOString());
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date(0).toISOString());
      
      return {
        id: docSnap.id,
        title: data.title || defaultPortfolioItemStructure.title,
        description: data.description || defaultPortfolioItemStructure.description,
        longDescription: data.longDescription || defaultPortfolioItemStructure.longDescription,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [...defaultPortfolioItemStructure.images],
        tags: Array.isArray(data.tags) ? data.tags : [...defaultPortfolioItemStructure.tags],
        liveUrl: data.liveUrl || '',
        repoUrl: data.repoUrl || '',
        slug: data.slug || `project-${docSnap.id}`,
        dataAiHint: data.dataAiHint || defaultPortfolioItemStructure.dataAiHint,
        readmeContent: data.readmeContent || defaultPortfolioItemStructure.readmeContent,
        createdAt: createdAt,
        updatedAt: updatedAt,
      } as LibPortfolioItemType;
    });
  } catch (error) {
    console.error("Error fetching portfolio items from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultPortfolioItemsDataForClient));  // Fallback on error
  }
}

// Action to get a single portfolio item by its slug
export async function getPortfolioItemBySlugAction(slug: string): Promise<LibPortfolioItemType | null> {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    console.warn("getPortfolioItemBySlugAction: Invalid or empty slug provided.");
    return null;
  }
  if (!firestore) {
    console.warn(`Firestore not initialized in getPortfolioItemBySlugAction for slug: ${slug}. Returning null.`);
    return null;
  }
  try {
    const q = query(portfolioCollectionRef(), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No portfolio item found with slug: ${slug}`);
      return null;
    }
    
    const docSnap = snapshot.docs[0]; 
    const data = docSnap.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date(0).toISOString());
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date(0).toISOString());

    return {
      id: docSnap.id,
      title: data.title || defaultPortfolioItemStructure.title,
      description: data.description || defaultPortfolioItemStructure.description,
      longDescription: data.longDescription || defaultPortfolioItemStructure.longDescription,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [...defaultPortfolioItemStructure.images],
      tags: Array.isArray(data.tags) ? data.tags : [...defaultPortfolioItemStructure.tags],
      liveUrl: data.liveUrl || '',
      repoUrl: data.repoUrl || '',
      slug: data.slug, 
      dataAiHint: data.dataAiHint || defaultPortfolioItemStructure.dataAiHint,
      readmeContent: data.readmeContent || defaultPortfolioItemStructure.readmeContent,
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
      formDataOnError: Object.fromEntries(formData.entries()) as unknown as PortfolioAdminFormData 
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
  
  const imagesFromForm: string[] = [];
  if (data.image1 && data.image1.trim() !== '') imagesFromForm.push(data.image1);
  if (data.image2 && data.image2.trim() !== '') imagesFromForm.push(data.image2);
  
  // Use default images only if it's a new project AND no images were provided from the form.
  // For existing projects, if user clears images, respect that (empty array).
  const finalImages = (imagesFromForm.length > 0)
    ? imagesFromForm
    : (!data.id ? [...defaultPortfolioItemStructure.images] : []);


  const tags: string[] = data.tagsString ? data.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  const projectDataForFirestore: Omit<LibPortfolioItemType, 'id' | 'createdAt' | 'updatedAt'> & { updatedAt: any, createdAt?: any } = {
    title: data.title,
    description: data.description,
    longDescription: data.longDescription || '', 
    images: finalImages,
    tags,
    liveUrl: data.liveUrl || '',
    repoUrl: data.repoUrl || '',
    slug: data.slug,
    dataAiHint: data.dataAiHint || defaultPortfolioItemStructure.dataAiHint,
    readmeContent: data.readmeContent || defaultPortfolioItemStructure.readmeContent,
    updatedAt: serverTimestamp(),
  };
  
  let projectId = data.id;

  try {
    // Check for slug uniqueness
    const slugCheckQuery = query(portfolioCollectionRef(), where("slug", "==", data.slug));
    const slugSnapshot = await getDocs(slugCheckQuery);
    let slugIsTaken = false;
    if (!slugSnapshot.empty) {
      if (projectId) { // Editing existing project
        slugIsTaken = slugSnapshot.docs.some(doc => doc.id !== projectId);
      } else { // Adding new project
        slugIsTaken = true;
      }
    }

    if (slugIsTaken) {
      return {
        message: `Slug "${data.slug}" is already in use. Please choose a unique slug.`,
        status: 'error',
        errors: { slug: [`Slug "${data.slug}" is already in use.`] },
        formDataOnError: rawData,
      };
    }

    if (projectId) { 
      await setDoc(portfolioDocRef(projectId), projectDataForFirestore, { merge: true });
    } else { 
      projectDataForFirestore.createdAt = serverTimestamp(); 
      const newProjectRef = await addDoc(portfolioCollectionRef(), projectDataForFirestore);
      projectId = newProjectRef.id;
    }
    
    const savedDoc = await getDoc(portfolioDocRef(projectId!)); 
    if (!savedDoc.exists()) {
        throw new Error("Failed to retrieve saved project from Firestore after save operation.");
    }
    const savedData = savedDoc.data()!;
    // Ensure createdAt is only set if it's a new document, otherwise, it gets overwritten by serverTimestamp() if not careful
    const createdAtRaw = data.id ? savedData.createdAt : projectDataForFirestore.createdAt;
    const createdAt = createdAtRaw instanceof Timestamp ? createdAtRaw.toDate().toISOString() : (createdAtRaw ? new Date().toISOString() : new Date(0).toISOString());
    const updatedAt = savedData.updatedAt instanceof Timestamp ? savedData.updatedAt.toDate().toISOString() : new Date().toISOString();

    const finalSavedProject: LibPortfolioItemType = {
      id: projectId!,
      title: savedData.title || projectDataForFirestore.title,
      description: savedData.description || projectDataForFirestore.description,
      longDescription: savedData.longDescription || projectDataForFirestore.longDescription,
      images: savedData.images || projectDataForFirestore.images, // Use saved images directly
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
        return { success: true, message: `Project (ID: ${itemId}, Title: ${projectToDeleteData?.title || 'N/A'}) deleted successfully!` };
        
    } catch (error) {
        console.error("Error deleting portfolio item from Firestore:", error);
        return { success: false, message: "Failed to delete project due to a server error." };
    }
}


    