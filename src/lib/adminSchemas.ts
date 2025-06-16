
import { z } from 'zod';
import type { Experience, Education } from '@/lib/types'; 
import { skillCategories, availableIconNames } from '@/lib/data';

const experienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(1, "Description is required"),
});

const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().min(1, "Period is required"),
});

export const aboutMeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  bio: z.string().min(20, { message: "Bio must be at least 20 characters." }),
  profileImage: z.string().url({ message: "Please enter a valid URL for the profile image." }).or(z.literal("")),
  dataAiHint: z.string().max(50, { message: "AI hint must be 50 characters or less." }).or(z.literal("")),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
});

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
});

export type PortfolioAdminFormData = z.infer<typeof portfolioItemAdminSchema>;

// Schema for Skill Admin Form
const validCategories = skillCategories as [string, ...string[]]; // Zod enum helper
const validIconNames = availableIconNames as [string, ...string[]]; // Zod enum helper

export const skillAdminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Skill name is required." }),
  category: z.enum(validCategories, { errorMap: () => ({ message: "Please select a valid category." })}),
  proficiency: z.coerce.number().min(0).max(100).optional().nullable(),
  iconName: z.enum(validIconNames, { errorMap: () => ({ message: "Please select a valid icon."}) }),
});

export type SkillAdminFormData = z.infer<typeof skillAdminSchema>;
