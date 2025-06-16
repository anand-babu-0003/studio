
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData, AppData } from '@/lib/types';
// This imports the content of data.json for initial/client-side use by admin panel.
import jsonDataFromFile from './data.json';
import { Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop } from 'lucide-react';

// --- Static Data primarily for Client Components (Initial Load for Admin Panel) ---
// This data might be stale if data.json is updated post-build/server start
// and client components import these directly. Public pages will use dynamic fetching.
const appDataForClient: AppData = jsonDataFromFile as AppData;

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

// Server-side data fetching functions (getPortfolioItemsSS, getAboutMeSS, getSkillsSS)
// have been removed from this file. Public-facing Server Components will now
// implement their own data fetching logic using fs.readFile directly or via a
// new server-only utility if needed.
    
