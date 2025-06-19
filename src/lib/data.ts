
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData, SiteSettings, Experience, Education } from '@/lib/types';
import {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu, Package
} from 'lucide-react';
import { SKILL_CATEGORIES } from './constants';

// --- Default Data Structures for Client-Side Admin Forms & Fallbacks ---
// These are used to initialize forms or provide default content if Firestore data is unavailable.

export const defaultSiteSettingsForClient: SiteSettings = {
  siteName: 'VermaVerse',
  defaultMetaDescription: 'A showcase of my projects and skills in VermaVerse.',
  defaultMetaKeywords: 'portfolio, web developer, react, nextjs, anand verma',
  siteOgImageUrl: 'https://placehold.co/1200x630.png?text=VermaVerse',
};

export const defaultExperienceForClient: Experience[] = [
  { id: `exp_default_${Date.now()}_1`, role: 'Lead Developer', company: 'Innovate Solutions', period: '2022 - Present', description: 'Leading innovative web projects.' },
  { id: `exp_default_${Date.now()}_2`, role: 'UI/UX Designer', company: 'Creative Designs Co.', period: '2020 - 2022', description: 'Designing user-centric interfaces.' },
];

export const defaultEducationForClient: Education[] = [
  { id: `edu_default_${Date.now()}_1`, degree: 'M.Sc. in Interaction Design', institution: 'Design Institute', period: '2018 - 2020' },
];

export const defaultAboutMeDataForClient: AboutMeData = {
  name: 'Anand Verma',
  title: 'Full-Stack Developer & UI Enthusiast',
  bio: "Welcome to VermaVerse! I'm a passionate developer dedicated to crafting beautiful and functional digital experiences. Explore my work and let's connect!",
  profileImage: 'https://placehold.co/400x400.png?text=AV',
  dataAiHint: 'developer portrait modern',
  experience: defaultExperienceForClient,
  education: defaultEducationForClient,
  email: 'anand.verma@example.com',
  linkedinUrl: 'https://linkedin.com/in/anandverma',
  githubUrl: 'https://github.com/anandverma',
  twitterUrl: 'https://twitter.com/anandverma',
};

export const defaultSkillsDataForClient: Skill[] = [
  { id: 'skill_default_js', name: 'JavaScript', category: 'Languages', iconName: 'Code', proficiency: 95 },
  { id: 'skill_default_react', name: 'React', category: 'Frontend', iconName: 'Laptop', proficiency: 92 },
  { id: 'skill_default_node', name: 'Node.js', category: 'Backend', iconName: 'Server', proficiency: 88 },
  { id: 'skill_default_figma', name: 'Figma', category: 'Tools', iconName: 'PenTool', proficiency: 85 },
  { id: 'skill_default_gcp', name: 'Google Cloud', category: 'DevOps', iconName: 'Cloud', proficiency: 70 },
  { id: 'skill_default_comms', name: 'Communication', category: 'Other', iconName: 'MessageSquare', proficiency: 90 },
];

export const defaultPortfolioItemsDataForClient: PortfolioItem[] = [
  {
    id: 'proj_default_portfolio_site',
    title: 'My Personal Portfolio (This Site!)',
    description: 'The very site you are browsing, built with Next.js, Tailwind, and Firebase.',
    longDescription: 'This portfolio is a dynamic showcase of my skills and projects. It features a modern design, responsive layout, and an admin panel for easy content management. Built using Next.js for server-side rendering and static generation, Tailwind CSS for styling, and Firebase for backend services including Firestore database and authentication (conceptual for admin).',
    images: ['https://placehold.co/600x400.png?text=PortfolioSite1', 'https://placehold.co/600x400.png?text=PortfolioSite2'],
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Firebase', 'TypeScript'],
    slug: 'personal-portfolio-vermaverse',
    dataAiHint: 'website design code',
    readmeContent: '# Personal Portfolio - VermaVerse\n\nThis project is the source code for my personal portfolio website, VermaVerse. \n\n## Features\n- Showcase of projects and skills\n- About Me section\n- Contact Form\n- Admin panel (conceptual for content management)\n\n## Tech Stack\n- Next.js\n- React\n- TypeScript\n- Tailwind CSS\n- Firebase (Firestore)\n- ShadCN UI\n- Lucide Icons',
    liveUrl: '#', // Should ideally be the actual URL
    repoUrl: 'https://github.com/yourusername/vermaverse-portfolio', // Replace with actual repo
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_default_ecom',
    title: 'E-commerce Platform Concept',
    description: 'A conceptual design and feature plan for a modern e-commerce platform.',
    longDescription: 'This project involved the conceptualization and high-level design of a scalable e-commerce platform. Key considerations included user experience, product management, order processing, and payment gateway integration. While not fully implemented, it demonstrates strategic thinking in platform architecture.',
    images: ['https://placehold.co/600x400.png?text=EcomConcept1'],
    tags: ['UX Design', 'System Architecture', 'E-commerce'],
    slug: 'ecommerce-platform-concept',
    dataAiHint: 'online store shopping',
    readmeContent: '# E-commerce Platform Concept\n\nThis document outlines the concept for a modern e-commerce platform.\n\n## Core Modules\n- Product Catalog\n- User Authentication\n- Shopping Cart & Checkout\n- Order Management\n- Admin Dashboard',
    liveUrl: '',
    repoUrl: '',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  }
];

// --- Static Configurations (should not change often) ---
export const skillCategories = SKILL_CATEGORIES;

export const lucideIconsMap: { [key: string]: React.ElementType } = {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu, Package
};
export const availableIconNames = Object.keys(lucideIconsMap);

export const commonSkillNames: string[] = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Ruby", "Swift", "Kotlin", "PHP",
  "HTML", "CSS", "SCSS/SASS", "React", "Angular", "Vue.js", "Next.js", "Tailwind CSS", "ShadCN UI",
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Firebase", "Firestore",
  "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL",
  "AWS", "Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Git", "GitHub Actions",
  "Figma", "Adobe XD", "VS Code", "Agile", "Scrum", "CI/CD", "REST APIs", "GraphQL",
  "Problem Solving", "Communication", "Teamwork", "Project Management"
];
