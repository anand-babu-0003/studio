
"use server";

import type { PortfolioItem, AppData } from '@/lib/types';
import { portfolioItemAdminSchema, type PortfolioAdminFormData } from '@/lib/adminSchemas';
import fs from 'fs/promises';
import path from 'path';

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
        console.warn("Data file is empty in portfolioActions, returning default structure.");
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
     console.error("Error reading or parsing data file in portfolioActions, returning default structure:", error);
     return localDefaultAppData;
  }
}

async function writeDataToFile(data: AppData): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export type PortfolioFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof PortfolioAdminFormData, string[]>>;
  // On error, `formData` will contain the attempted data. On success, `savedProject` will.
  formDataOnError?: PortfolioAdminFormData; 
  savedProject?: PortfolioItem;
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
    readmeContent: data.readmeContent,
  };

  try {
    const allData = await readDataFromFile();
    if (data.id) {
      const projectIndex = allData.portfolioItems.findIndex(p => p.id === data.id);
      if (projectIndex > -1) {
        allData.portfolioItems[projectIndex] = projectToSave;
      } else {
        allData.portfolioItems.push(projectToSave);
      }
    } else {
      allData.portfolioItems.push(projectToSave);
    }
    await writeDataToFile(allData);

    return {
      message: `Project "${projectToSave.title}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedProject: projectToSave,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving portfolio project:", error);
    return {
      message: "An unexpected server error occurred while saving the project. Please try again.",
      status: 'error',
      errors: {},
      formDataOnError: rawData, // Return rawData on file system error as well
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
        const allData = await readDataFromFile();
        const initialLength = allData.portfolioItems.length;
        allData.portfolioItems = allData.portfolioItems.filter(p => p.id !== itemId);

        if (allData.portfolioItems.length < initialLength) {
            await writeDataToFile(allData);
            return { success: true, message: `Project (ID: ${itemId}) deleted successfully!` };
        } else {
            return { success: false, message: `Project (ID: ${itemId}) not found for deletion.` };
        }
    } catch (error) {
        console.error("Error deleting portfolio item:", error);
        return { success: false, message: "Failed to delete project due to a server error." };
    }
}

