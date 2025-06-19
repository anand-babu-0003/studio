
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import type { AboutMeData } from '@/lib/types';
import { defaultAboutMeDataForClient } from '@/lib/data'; 

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
      const data = docSnap.data() as Partial<AboutMeData>; // Data from DB might be partial
      // Merge with defaults to ensure all fields are present and arrays are initialized
      return {
        ...defaultAboutMeDataForClient,
        ...data,
        experience: (data.experience || defaultAboutMeDataForClient.experience).map(exp => ({ 
            ...exp, 
            id: exp.id || `exp_fetch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
        education: (data.education || defaultAboutMeDataForClient.education).map(edu => ({ 
            ...edu, 
            id: edu.id || `edu_fetch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
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
