
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData, AppData, SiteSettings } from '@/lib/types';
// This imports the content of data.json for initial/client-side use by admin panel.
import jsonDataFromFile from './data.json'; 
import { Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop } from 'lucide-react';

// Define a default, well-structured AppData object for fallbacks, aligned with server action defaults
const defaultAppData: AppData = {
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
  siteSettings: {
    siteName: 'My Portfolio',
    defaultMetaDescription: 'A showcase of my projects and skills.',
  },
};

// Ensure jsonDataFromFile is treated as an object, defaulting to an empty one if import yields non-object.
const importedValidObject = (typeof jsonDataFromFile === 'object' && jsonDataFromFile !== null)
  ? jsonDataFromFile
  : {};

// Cast to Partial<AppData> to handle cases where jsonDataFromFile might be empty or missing keys.
const importedData = importedValidObject as Partial<AppData>;

// Defensively merge imported data with defaults.
const appDataForClient: AppData = {
  portfolioItems: Array.isArray(importedData.portfolioItems)
    ? importedData.portfolioItems
    : defaultAppData.portfolioItems,
  skills: Array.isArray(importedData.skills)
    ? importedData.skills
    : defaultAppData.skills,
  aboutMe: {
    ...defaultAppData.aboutMe,
    ...( (typeof importedData.aboutMe === 'object' && importedData.aboutMe !== null) 
        ? importedData.aboutMe 
        : {} 
      ),
  },
  siteSettings: {
    ...defaultAppData.siteSettings,
    ...( (typeof importedData.siteSettings === 'object' && importedData.siteSettings !== null)
        ? importedData.siteSettings
        : {}
      ),
  },
};

export const portfolioItems: PortfolioItem[] = appDataForClient.portfolioItems;
export const skills: Skill[] = appDataForClient.skills;
export const aboutMe: AboutMeData = appDataForClient.aboutMe;
export const siteSettings: SiteSettings = appDataForClient.siteSettings;


// --- Static Configs (Client-Safe) ---
// Use 'as const' for skillCategories to provide a tuple of string literals to Zod enum
export const skillCategories = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Other'] as const;


export const lucideIconsMap: { [key: string]: React.ElementType } = {
  Code,
  Database,
  Server,
  Cloud,
  PenTool,
  Terminal,
  Briefcase,
  Zap,
  Brain,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Smartphone,
  Laptop,
};
export const availableIconNames = Object.keys(lucideIconsMap);
    
