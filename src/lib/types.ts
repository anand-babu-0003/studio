
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
  readmeContent?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  iconName: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'DevOps' | 'Tools' | 'Other';
  proficiency?: number | null;
}

export interface SocialLink {
  id: string;
  name: string;
  url?: string;
  baseUrl?: string;
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
  maintenanceMode?: boolean;
  skillsPageMetaTitle?: string; 
  skillsPageMetaDescription?: string; 
}

export interface NotFoundPageData {
  imageSrc: string;
  dataAiHint: string;
  heading: string;
  message: string;
  buttonText: string;
}

export interface AppData {
  portfolioItems: PortfolioItem[];
  skills: Skill[];
  aboutMe: AboutMeData;
  siteSettings: SiteSettings;
  notFoundPage?: NotFoundPageData;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}
