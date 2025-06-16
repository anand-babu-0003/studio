
"use server";

import { z } from 'zod';
import type { PortfolioItem } from '@/lib/types';

// Schema for the admin form data
export const portfolioItemAdminSchema = z.object({
  id: z.string().optional(), // Will be present for updates, absent for creates
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  longDescription: z.string().optional(),
  image1: z.string().url({ message: "Please enter a valid URL for Image 1." }).or(z.literal("")).optional(),
  image2: z.string().url({ message: "Please enter a valid URL for Image 2." }).or(z.literal("")).optional(),
  tagsString: z.string().optional(), // Comma-separated tags
  liveUrl: z.string().url({ message: "Please enter a valid URL for Live Demo." }).or(z.literal("")).optional(),
  repoUrl: z.string().url({ message: "Please enter a valid URL for Code Repo." }).or(z.literal("")).optional(),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  dataAiHint: z.string().max(50, "AI hint too long").optional(),
});

export type PortfolioAdminFormData = z.infer<typeof portfolioItemAdminSchema>;

export type PortfolioFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof PortfolioAdminFormData, string[]>>;
  project?: PortfolioItem; // Return the saved/updated project
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
    id: data.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // Generate ID if new
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
    // Simulate saving data
    console.log("Saving portfolio project (simulation):", JSON.stringify(projectToSave, null, 2));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

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
        // Simulate deleting item
        console.log(`Simulating deletion of portfolio item with ID: ${itemId}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        return { success: true, message: `Project (ID: ${itemId}) deleted successfully! (Simulated)` };
    } catch (error) {
        console.error("Error deleting portfolio item:", error);
        return { success: false, message: "Failed to delete project." };
    }
}
