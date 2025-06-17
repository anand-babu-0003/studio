
import type React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  images: string[];
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  slug: string;
  dataAiHint?: string;
  readmeContent?: string; // Added for README markdown
}

export interface Skill {
  id: string;
  name: string;
  iconName: string; // Changed from LucideIcon to string
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Tools' | 'Languages' | 'Other';
  proficiency?: number;
}

export interface SocialLink {
  id: string;
  name: string;
  url?: string; // Make URL optional as it will come from AboutMeData
  baseUrl?: string; // For mailto:, etc.
  icon: LucideIcon | React.ElementType;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface AboutMeData {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  dataAiHint: string;
  experience: Experience[];
  education: Education[];
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
}

export interface SiteSettings {
  siteName: string;
  defaultMetaDescription: string;
  defaultMetaKeywords?: string;
  siteOgImageUrl?: string;
}

export interface AppData {
  portfolioItems: PortfolioItem[];
  skills: Skill[];
  aboutMe: AboutMeData;
  siteSettings: SiteSettings; // Added site settings
}

