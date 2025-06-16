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
}

export interface Skill {
  id: string;
  name: string;
  icon: LucideIcon | React.ElementType;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Tools' | 'Languages' | 'Other';
  proficiency?: number; 
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon | React.ElementType;
}
