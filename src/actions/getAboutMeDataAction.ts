
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import type { AboutMeData } from '@/lib/types';
import { defaultAboutMeDataForClient } from '@/lib/data'; // For fallback

const aboutMeDocRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'app_config', 'aboutMeDoc');
}

export async function getAboutMeDataAction(): Promise<AboutMeData> {
  if (!firestore) {
    console.warn("Firestore not initialized in getAboutMeDataAction. Returning default data.");
    return defaultAboutMeDataForClient;
  }
  try {
    const docSnap = await getDoc(aboutMeDocRef());
    if (docSnap.exists()) {
      const data = docSnap.data() as AboutMeData;
      // Ensure experience and education arrays are present, even if empty from DB
      return {
        ...defaultAboutMeDataForClient, // provides structure
        ...data, // overwrites with DB data
        experience: data.experience || [],
        education: data.education || [],
      };
    } else {
      console.warn("About Me document not found in Firestore. Returning default data.");
      return defaultAboutMeDataForClient;
    }
  } catch (error) {
    console.error("Error fetching About Me data from Firestore:", error);
    return defaultAboutMeDataForClient; // Fallback to defaults on error
  }
}
