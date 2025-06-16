
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

// Ensure appDataForClient is always a valid AppData object,
// merging jsonDataFromFile with defaults to prevent issues if jsonDataFromFile is incomplete.
const rawAppData = jsonDataFromFile as any; // Cast to any to safely check structure

const appDataForClient: AppData = {
  portfolioItems: Array.isArray(rawAppData?.portfolioItems) 
    ? rawAppData.portfolioItems 
    : defaultAppData.portfolioItems,
  skills: Array.isArray(rawAppData?.skills) 
    ? rawAppData.skills 
    : defaultAppData.skills,
  aboutMe: (typeof rawAppData?.aboutMe === 'object' && rawAppData.aboutMe !== null)
    ? { ...defaultAppData.aboutMe, ...rawAppData.aboutMe }
    : defaultAppData.aboutMe,
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
    