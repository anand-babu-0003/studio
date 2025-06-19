
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
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); // Return a deep clone
  }
  try {
    const docSnap = await getDoc(aboutMeDocRef());
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<AboutMeData>; // Data from DB might be partial
      const defaultData = defaultAboutMeDataForClient;
      // Merge with defaults to ensure all fields are present and arrays are initialized
      return {
        name: data.name || defaultData.name,
        title: data.title || defaultData.title,
        bio: data.bio || defaultData.bio,
        profileImage: data.profileImage || defaultData.profileImage,
        dataAiHint: data.dataAiHint || defaultData.dataAiHint,
        experience: (data.experience || defaultData.experience).map(exp => ({ 
            ...exp, 
            id: exp.id || `exp_fetch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
        education: (data.education || defaultData.education).map(edu => ({ 
            ...edu, 
            id: edu.id || `edu_fetch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
        email: data.email || defaultData.email,
        linkedinUrl: data.linkedinUrl || defaultData.linkedinUrl,
        githubUrl: data.githubUrl || defaultData.githubUrl,
        twitterUrl: data.twitterUrl || defaultData.twitterUrl,
      };
    } else {
      console.warn("About Me document not found in Firestore. Returning default data.");
      return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); // Deep clone
    }
  } catch (error) {
    console.error("Error fetching About Me data from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); // Deep clone on error
  }
}
