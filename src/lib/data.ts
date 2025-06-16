
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData, AppData } from '@/lib/types';
// This imports the content of data.json for initial/client-side use by admin panel.
import jsonDataFromFile from './data.json';
import { Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop } from 'lucide-react';

// Define a default, well-structured AppData object for fallbacks
const defaultAppData: AppData = {
  portfolioItems: [],
  skills: [],
  aboutMe: {
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
  },
};

// Cast imported JSON directly and use nullish coalescing for defaults.
const importedData = jsonDataFromFile as AppData;

const appDataForClient: AppData = {
  portfolioItems: importedData?.portfolioItems ?? defaultAppData.portfolioItems,
  skills: importedData?.skills ?? defaultAppData.skills,
  aboutMe: {
    ...defaultAppData.aboutMe,
    ...(importedData?.aboutMe ?? {}), // Spread imported aboutMe over defaults
  },
};

export const portfolioItems: PortfolioItem[] = appDataForClient.portfolioItems;
export const skills: Skill[] = appDataForClient.skills;
export const aboutMe: AboutMeData = appDataForClient.aboutMe;


// --- Static Configs (Client-Safe) ---
export const skillCategories: Array<Skill['category']> = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Other'];

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
    
