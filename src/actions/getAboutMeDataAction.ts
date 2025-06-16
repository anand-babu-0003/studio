
"use server";

import type { AboutMeData, AppData } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

// Default structure to return in case of errors or if the file is empty/corrupted.
const defaultFullAboutMeData: AboutMeData = {
  name: 'Default Name',
  title: 'Default Title',
  bio: 'Default bio.',
  profileImage: 'https://placehold.co/300x300.png',
  dataAiHint: 'profile picture',
  experience: [],
  education: [],
  email: 'default@example.com',
  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
};

export async function getAboutMeDataAction(): Promise<AboutMeData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent.trim()) {
        console.warn("Data file is empty in getAboutMeDataAction, returning default structure.");
        return defaultFullAboutMeData;
    }
    const appData = JSON.parse(fileContent) as Partial<AppData>;
    
    return {
      ...defaultFullAboutMeData, 
      ...(appData.aboutMe ?? {}), 
    };
  } catch (error) {
    console.error("Error reading or parsing data.json in getAboutMeDataAction, returning default structure:", error);
    return defaultFullAboutMeData;
  }
}
