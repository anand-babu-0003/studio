
import { z } from 'zod';
import { SKILL_CATEGORIES } from './constants'; 
import { commonSkillNamesTuple } from './data'; // Import the tuple

const ZOD_SKILL_CATEGORIES = SKILL_CATEGORIES; 

// ZOD_AVAILABLE_ICON_NAMES is no longer needed for icon selection dropdown

export const experienceSchema = z.object({
  id: z.string().min(1, "Experience item ID is required"), 
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(1, "Description is required"),
});
export type Experience = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  id: z.string().min(1, "Education item ID is required"), 
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().min(1, "Period is required"),
});
export type Education = z.infer<typeof educationSchema>;


export const aboutMeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  bio: z.string().min(20, { message: "Bio must be at least 20 characters." }),
  profileImage: z.string().url({ message: "Please enter a valid URL for the profile image." }).or(z.literal("").transform(() => undefined)).optional(),
  dataAiHint: z.string().max(50, { message: "AI hint must be 50 characters or less." }).or(z.literal("").transform(() => undefined)).optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  email: z.string().email({ message: "Please enter a valid email." }).or(z.literal("").transform(() => undefined)).optional(),
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn URL." }).or(z.literal("").transform(() => undefined)).optional(),
  githubUrl: z.string().url({ message: "Please enter a valid GitHub URL." }).or(z.literal("").transform(() => undefined)).optional(),
  twitterUrl: z.string().url({ message: "Please enter a valid Twitter URL." }).or(z.literal("").transform(() => undefined)).optional(),
});

export const profileBioSchema = aboutMeSchema.pick({
  name: true,
  title: true,
  bio: true,
  profileImage: true,
  dataAiHint: true,
});
export type ProfileBioData = z.infer<typeof profileBioSchema>;

export const experienceSectionSchema = z.object({
  experience: z.array(experienceSchema)
    .min(0) 
    .refine(items => { 
        return items.every(item => 
            item.role.trim() !== '' || 
            item.company.trim() !== '' || 
            item.period.trim() !== '' || 
            item.description.trim() !== '' ||
            !item.id.startsWith('new_exp_') 
        );
    }, { message: "New experience entries cannot be completely blank." })
    .optional(), 
});
export type ExperienceSectionData = z.infer<typeof experienceSectionSchema>;

export const educationSectionSchema = z.object({
  education: z.array(educationSchema)
    .min(0)
    .refine(items => {
        return items.every(item =>
            item.degree.trim() !== '' ||
            item.institution.trim() !== '' ||
            item.period.trim() !== '' ||
            !item.id.startsWith('new_edu_')
        );
    }, { message: "New education entries cannot be completely blank." })
    .optional(),
});
export type EducationSectionData = z.infer<typeof educationSectionSchema>;


export const portfolioItemAdminSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  longDescription: z.string().optional(),
  image1: z.string().url({ message: "Image 1: Please enter a valid URL or leave blank for default." }).or(z.literal("")).optional(),
  image2: z.string().url({ message: "Image 2: Please enter a valid URL or leave blank." }).or(z.literal("")).optional(),
  tagsString: z.string().optional(),
  liveUrl: z.string().url({ message: "Live Demo: Please enter a valid URL or leave blank." }).or(z.literal("")).optional(),
  repoUrl: z.string().url({ message: "Code Repo: Please enter a valid URL or leave blank." }).or(z.literal("")).optional(),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  dataAiHint: z.string().max(50, "AI hint too long").optional(),
  readmeContent: z.string().optional(),
});

export type PortfolioAdminFormData = z.infer<typeof portfolioItemAdminSchema>;

export const skillAdminSchema = z.object({
  id: z.string().optional(),
  name: z.enum(commonSkillNamesTuple, { // Use the tuple for enum validation
    errorMap: (issue, ctx) => ({ message: "Please select a valid skill from the list." })
  }),
  category: z.enum(ZOD_SKILL_CATEGORIES, { errorMap: () => ({ message: "Please select a valid category." })}),
  proficiency: z.preprocess(
    (val) => (String(val).trim() === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).max(100).optional().nullable()
  ),
  // iconName is removed from user input schema
});

export type SkillAdminFormData = z.infer<typeof skillAdminSchema>;


export const siteSettingsAdminSchema = z.object({
  siteName: z.string().min(3, { message: "Site Name must be at least 3 characters." }),
  defaultMetaDescription: z.string().min(10, { message: "Meta Description must be at least 10 characters." }).max(160, {message: "Meta Description should not exceed 160 characters."}),
  defaultMetaKeywords: z.string().optional(),
  siteOgImageUrl: z.string().url({ message: "Please enter a valid URL for the Open Graph image or leave blank." }).or(z.literal("")).optional(),
  maintenanceMode: z.boolean().optional(),
  skillsPageMetaTitle: z.string().min(5, "Skills page meta title is too short.").max(70, "Skills page meta title is too long.").optional(),
  skillsPageMetaDescription: z.string().min(10, "Skills page meta description is too short.").max(160, "Skills page meta description is too long.").optional(),
});
export type SiteSettingsAdminFormData = z.infer<typeof siteSettingsAdminSchema>;

export const notFoundPageAdminSchema = z.object({
  imageSrc: z.string().url({ message: "Please enter a valid URL for the image." }).or(z.literal("")).optional(),
  dataAiHint: z.string().max(50, { message: "AI hint must be 50 characters or less." }).or(z.literal("")).optional(),
  heading: z.string().min(5, "Heading is too short.").max(100, "Heading is too long."),
  message: z.string().min(10, "Message is too short.").max(200, "Message is too long."),
  buttonText: z.string().min(3, "Button text is too short.").max(30, "Button text is too long."),
});
export type NotFoundPageAdminFormData = z.infer<typeof notFoundPageAdminSchema>;
