
"use server";

import type { PortfolioItem } from '@/lib/types';
import { portfolioItemAdminSchema, type PortfolioAdminFormData } from '@/lib/adminSchemas'; // Import schema and related type

export type PortfolioFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof PortfolioAdminFormData, string[]>>;
  project?: PortfolioItem; 
};

export async function savePortfolioItemAction(
  prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  const rawData: PortfolioAdminFormData = {
    id: formData.get('id') as string || undefined,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    longDescription: formData.get('longDescription') as string || undefined,
    image1: formData.get('image1') as string || undefined,
    image2: formData.get('image2') as string || undefined,
    tagsString: formData.get('tagsString') as string || undefined,
    liveUrl: formData.get('liveUrl') as string || undefined,
    repoUrl: formData.get('repoUrl') as string || undefined,
    slug: formData.get('slug') as string,
    dataAiHint: formData.get('dataAiHint') as string || undefined,
  };

  const validatedFields = portfolioItemAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save project. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;
  const images: string[] = [];
  if (data.image1) images.push(data.image1);
  if (data.image2) images.push(data.image2);

  const tags: string[] = data.tagsString ? data.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  const projectToSave: PortfolioItem = {
    id: data.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: data.title,
    description: data.description,
    longDescription: data.longDescription,
    images,
    tags,
    liveUrl: data.liveUrl,
    repoUrl: data.repoUrl,
    slug: data.slug,
    dataAiHint: data.dataAiHint,
  };

  try {
    console.log("Saving portfolio project (simulation):", JSON.stringify(projectToSave, null, 2));
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    return {
      message: `Project "${projectToSave.title}" ${data.id ? 'updated' : 'added'} successfully! (Simulated Save)`,
      status: 'success',
      project: projectToSave,
    };

  } catch (error) {
    console.error("Error saving portfolio project:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      status: 'error',
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
        console.log(`Simulating deletion of portfolio item with ID: ${itemId}`);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        return { success: true, message: `Project (ID: ${itemId}) deleted successfully! (Simulated)` };
    } catch (error) {
        console.error("Error deleting portfolio item:", error);
        return { success: false, message: "Failed to delete project." };
    }
}
