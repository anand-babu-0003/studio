
import { z } from 'zod';
import type { Experience as LibExperienceType, Education as LibEducationType } from '@/lib/types'; // Renamed to avoid conflict with Zod types below
// Import Lucide icons directly for deriving availableIconNames within this file
import { Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop } from 'lucide-react';

// --- Self-contained enum definitions for Zod validation ---
// These are used by skillAdminSchema below.
// The client (AdminSkillsPage) will use similar arrays from src/lib/data.ts for UI.
// Ensure string values here exactly match those in src/lib/data.ts.

const ZOD_SKILL_CATEGORIES = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Other'] as const;

const ZOD_LUCIDE_ICONS_MAP: { [key: string]: React.ElementType } = {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop
};
const ZOD_AVAILABLE_ICON_NAMES = Object.keys(ZOD_LUCIDE_ICONS_MAP) as [string, ...string[]]; // Cast for z.enum if map isn't empty

if (ZOD_AVAILABLE_ICON_NAMES.length === 0) {
  // This should not happen given the hardcoded map, but good for robustness.
  throw new Error("FATAL: ZOD_AVAILABLE_ICON_NAMES is empty in adminSchemas.ts. Check ZOD_LUCIDE_ICONS_MAP.");
}


// --- Schemas ---
export const experienceSchema = z.object({
  id: z.string(), // Should be present, even for new items (can be a temporary client-generated ID)
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(1, "Description is required"),
});
export type Experience = z.infer<typeof experienceSchema>; // This is Zod's Experience type

export const educationSchema = z.object({
  id: z.string(), // Should be present, even for new items
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().min(1, "Period is required"),
});
export type Education = z.infer<typeof educationSchema>; // This is Zod's Education type


export const aboutMeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  bio: z.string().min(20, { message: "Bio must be at least 20 characters." }),
  profileImage: z.string().url({ message: "Please enter a valid URL for the profile image." }).or(z.literal("")),
  dataAiHint: z.string().max(50, { message: "AI hint must be 50 characters or less." }).or(z.literal("")),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  email: z.string().email({ message: "Please enter a valid email." }).or(z.literal("")).optional(),
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn URL." }).or(z.literal("")).optional(),
  githubUrl: z.string().url({ message: "Please enter a valid GitHub URL." }).or(z.literal("")).optional(),
  twitterUrl: z.string().url({ message: "Please enter a valid Twitter URL." }).or(z.literal("")).optional(),
});

// Schema for just the Profile & Bio section
export const profileBioSchema = aboutMeSchema.pick({
  name: true,
  title: true,
  bio: true,
  profileImage: true,
  dataAiHint: true,
});
export type ProfileBioData = z.infer<typeof profileBioSchema>;

// Schema for just the Experience section
export const experienceSectionSchema = z.object({
  experience: z.array(experienceSchema),
});
export type ExperienceSectionData = z.infer<typeof experienceSectionSchema>;

// Schema for just the Education section
export const educationSectionSchema = z.object({
  education: z.array(educationSchema),
});
export type EducationSectionData = z.infer<typeof educationSectionSchema>;


export const portfolioItemAdminSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  longDescription: z.string().optional(),
  image1: z.string().url({ message: "Please enter a valid URL for Image 1." }).or(z.literal("")).optional(),
  image2: z.string().url({ message: "Please enter a valid URL for Image 2." }).or(z.literal("")).optional(),
  tagsString: z.string().optional(),
  liveUrl: z.string().url({ message: "Please enter a valid URL for Live Demo." }).or(z.literal("")).optional(),
  repoUrl: z.string().url({ message: "Please enter a valid URL for Code Repo." }).or(z.literal("")).optional(),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  dataAiHint: z.string().max(50, "AI hint too long").optional(),
  readmeContent: z.string().optional(),
});

export type PortfolioAdminFormData = z.infer<typeof portfolioItemAdminSchema>;

export const skillAdminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Skill name is required." }),
  category: z.enum(ZOD_SKILL_CATEGORIES, { errorMap: () => ({ message: "Please select a valid category." })}),
  proficiency: z.coerce.number().min(0).max(100).optional().nullable(),
  iconName: z.enum(ZOD_AVAILABLE_ICON_NAMES, { errorMap: () => ({ message: "Please select a valid icon."}) }),
});

export type SkillAdminFormData = z.infer<typeof skillAdminSchema>;

// Schema for Site Settings
export const siteSettingsAdminSchema = z.object({
  siteName: z.string().min(3, { message: "Site Name must be at least 3 characters." }),
  defaultMetaDescription: z.string().min(10, { message: "Meta Description must be at least 10 characters." }).max(160, {message: "Meta Description should not exceed 160 characters."}),
});
export type SiteSettingsAdminFormData = z.infer<typeof siteSettingsAdminSchema>;
