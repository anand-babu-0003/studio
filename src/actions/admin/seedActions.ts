
"use server";

import { firestore, firebaseApp } from '@/lib/firebaseConfig'; // Ensure firebaseApp is exported if needed for auth checks later
import { 
  doc, 
  setDoc, 
  writeBatch, 
  collection, 
  getDocs, 
  serverTimestamp, 
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  defaultSiteSettingsForClient,
  defaultAboutMeDataForClient,
  defaultSkillsDataForClient,
  defaultPortfolioItemsDataForClient,
  defaultNotFoundPageDataForClient // Added
} from '@/lib/data'; // Using more comprehensive defaults from data.ts
import type { SiteSettings, AboutMeData, Skill, PortfolioItem, Experience, Education, NotFoundPageData } from '@/lib/types';

export interface SeedDetails {
  siteSettings: { status: 'success' | 'error'; message?: string; count: number };
  aboutMe: { status: 'success' | 'error'; message?: string; count: number };
  skills: { status: 'success' | 'error'; message?: string; deletedCount: number; addedCount: number };
  portfolioItems: { status: 'success' | 'error'; message?: string; deletedCount: number; addedCount: number };
  notFoundPage: { status: 'success' | 'error'; message?: string; count: number }; // Added
}

export interface SeedResult {
  success: boolean;
  message: string;
  details: SeedDetails;
  error?: any;
}

// Helper function to clear a collection
async function clearCollection(collectionPath: string): Promise<number> {
  if (!firestore) {
    throw new Error("Firestore is not initialized. Cannot clear collection.");
  }
  const collectionRef = collection(firestore, collectionPath);
  const snapshot = await getDocs(collectionRef);
  if (snapshot.empty) {
    return 0;
  }
  const batch = writeBatch(firestore);
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  return snapshot.size;
}

export async function seedFirestoreWithMockDataAction(): Promise<SeedResult> {
  const details: SeedDetails = {
    siteSettings: { status: 'error', count: 0 },
    aboutMe: { status: 'error', count: 0 },
    skills: { status: 'error', deletedCount: 0, addedCount: 0 },
    portfolioItems: { status: 'error', deletedCount: 0, addedCount: 0 },
    notFoundPage: { status: 'error', count: 0 }, // Added
  };

  if (!firestore) {
    return {
      success: false,
      message: "Firestore is not initialized. Seeding cannot proceed.",
      details,
      error: "Firestore not initialized in firebaseConfig.ts",
    };
  }

  try {
    // 1. Seed Site Settings
    try {
      const siteSettingsRef = doc(firestore, 'app_config', 'siteSettingsDoc');
      const settingsToSeed: SiteSettings = defaultSiteSettingsForClient;
      await setDoc(siteSettingsRef, settingsToSeed);
      details.siteSettings = { status: 'success', count: 1, message: "Site settings seeded." };
    } catch (e) {
      console.error("Error seeding site settings:", e);
      details.siteSettings = { status: 'error', count: 0, message: (e as Error).message };
      throw e; // Propagate error to stop further seeding if critical
    }

    // 2. Seed About Me Data
    try {
      const aboutMeRef = doc(firestore, 'app_config', 'aboutMeDoc');
      // Ensure experience and education have IDs if they are missing in defaults
      const aboutMeDataToSeed: AboutMeData = {
        ...defaultAboutMeDataForClient,
        experience: defaultAboutMeDataForClient.experience.map((exp, i) => ({ id: exp.id || `exp_seed_${i}`, ...exp })),
        education: defaultAboutMeDataForClient.education.map((edu, i) => ({ id: edu.id || `edu_seed_${i}`, ...edu })),
      };
      await setDoc(aboutMeRef, aboutMeDataToSeed);
      details.aboutMe = { status: 'success', count: 1, message: "About Me data seeded." };
    } catch (e) {
      console.error("Error seeding About Me data:", e);
      details.aboutMe = { status: 'error', count: 0, message: (e as Error).message };
      throw e;
    }
    
    // 3. Seed Skills
    try {
      const deletedSkillsCount = await clearCollection('skills');
      details.skills.deletedCount = deletedSkillsCount;
      const skillsBatch = writeBatch(firestore);
      let addedSkillsCount = 0;
      defaultSkillsDataForClient.forEach(skill => {
        const skillRef = doc(firestore, 'skills', skill.id); // Use mock data ID
        skillsBatch.set(skillRef, skill);
        addedSkillsCount++;
      });
      await skillsBatch.commit();
      details.skills = { ...details.skills, status: 'success', addedCount: addedSkillsCount, message: `${deletedSkillsCount} skills deleted, ${addedSkillsCount} skills added.`};
    } catch (e) {
      console.error("Error seeding skills:", e);
      details.skills = { ...details.skills, status: 'error', message: (e as Error).message };
      throw e;
    }

    // 4. Seed Portfolio Items
    try {
      const deletedPortfolioCount = await clearCollection('portfolioItems');
      details.portfolioItems.deletedCount = deletedPortfolioCount;
      const portfolioBatch = writeBatch(firestore);
      let addedPortfolioCount = 0;
      defaultPortfolioItemsDataForClient.forEach(item => {
        const itemRef = doc(firestore, 'portfolioItems', item.id); // Use mock data ID
        const itemToSeed = {
          ...item,
          createdAt: serverTimestamp(), // Add server timestamps
          updatedAt: serverTimestamp(),
        };
        portfolioBatch.set(itemRef, itemToSeed);
        addedPortfolioCount++;
      });
      await portfolioBatch.commit();
      details.portfolioItems = { ...details.portfolioItems, status: 'success', addedCount: addedPortfolioCount, message: `${deletedPortfolioCount} portfolio items deleted, ${addedPortfolioCount} portfolio items added.`};
    } catch (e) {
      console.error("Error seeding portfolio items:", e);
      details.portfolioItems = { ...details.portfolioItems, status: 'error', message: (e as Error).message };
      throw e;
    }

    // 5. Seed Not Found Page Data (Added)
    try {
      const notFoundPageRef = doc(firestore, 'app_config', 'notFoundPageDoc');
      const notFoundDataToSeed: NotFoundPageData = defaultNotFoundPageDataForClient;
      await setDoc(notFoundPageRef, notFoundDataToSeed);
      details.notFoundPage = { status: 'success', count: 1, message: "404 Page data seeded." };
    } catch (e) {
      console.error("Error seeding 404 Page data:", e);
      details.notFoundPage = { status: 'error', count: 0, message: (e as Error).message };
      throw e;
    }


    return {
      success: true,
      message: "Firestore successfully seeded with mock data!",
      details,
    };

  } catch (error) {
    console.error("Overall error during Firestore seeding:", error);
    return {
      success: false,
      message: "An error occurred during Firestore seeding. Check console for details.",
      details, // Contains status of individual sections up to the point of failure
      error: (error as Error).message,
    };
  }
}
