
"use server";

import type { AboutMeData, AppData } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

// Default structure to return in case of errors or if the file is empty/corrupted.
const defaultAboutMeData: AboutMeData = {
  name: 'User Name',
  title: 'Professional Title',
  bio: 'A brief bio will appear here.',
  profileImage: 'https://placehold.co/300x300.png',
  dataAiHint: 'profile picture',
  experience: [],
  education: [],
  email: 'contact@example.com',
  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
};

export async function getAboutMeDataAction(): Promise<AboutMeData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const appData = JSON.parse(fileContent) as AppData;
    // Ensure all expected fields are present, falling back to defaults if necessary
    return {
      ...defaultAboutMeData, // Start with defaults
      ...(appData.aboutMe || {}), // Overlay with data from file
    };
  } catch (error) {
    console.error("Error reading or parsing data.json in getAboutMeDataAction:", error);
    return defaultAboutMeData; // Return default data on error
  }
}
