
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData, Experience, Education } from '@/lib/types';
import jsonData from './data.json'; 
import { Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop } from 'lucide-react';

interface AppData {
  portfolioItems: PortfolioItem[];
  skills: Skill[];
  aboutMe: AboutMeData;
}

const appData = jsonData as AppData;

export const portfolioItems: PortfolioItem[] = appData.portfolioItems;
export const skills: Skill[] = appData.skills;
export const aboutMe: AboutMeData = appData.aboutMe;

// Static data remains here
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

    