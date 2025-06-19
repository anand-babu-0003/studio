
import type React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  images: string[]; // Should always be an array, even if empty
  tags: string[];   // Should always be an array, even if empty
  liveUrl?: string;
  repoUrl?: string;
  slug: string;
  dataAiHint?: string;
  readmeContent?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Skill {
  id: string;
  name: string;
  iconName: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Tools' | 'Languages' | 'Other';
  proficiency?: number | null; // Allow null for "not set"
}

export interface SocialLink {
  id: string;
  name: string;
  url?: string;
  baseUrl?: string;
  icon: LucideIcon | React.ElementType;
}

export interface Experience {
  id: string; // Ensure ID is always present
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string; // Ensure ID is always present
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
  experience: Experience[]; // Should always be an array
  education: Education[];   // Should always be an array
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
  siteSettings: SiteSettings;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string; // ISO date string
}

export interface Announcement {
  id?: string; // Optional on creation, present when fetched
  message: string;
  createdAt: any; // Firestore Timestamp on write, Date or string on read
  isActive?: boolean; // To potentially control visibility
}
