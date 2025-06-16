
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData } from '@/lib/types';
// This imports the content of data.json.
// Next.js handles this import for client-side availability (usually at build time).
import jsonData from './data.json';
import { Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop } from 'lucide-react';

interface AppData {
  portfolioItems: PortfolioItem[];
  skills: Skill[];
  aboutMe: AboutMeData;
}

// Type assertion for the imported JSON data
const appData: AppData = jsonData as AppData;

export const portfolioItems: PortfolioItem[] = appData.portfolioItems;
export const skills: Skill[] = appData.skills;
export const aboutMe: AboutMeData = appData.aboutMe;

// Static data definitions remain here
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
