
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
// IMPORTANT: These are defaults for when Firestore is unreachable or empty.
// They should be deep-cloned when used to avoid mutation issues (e.g., JSON.parse(JSON.stringify(defaultXYZ))).

export const defaultSiteSettingsForClient: SiteSettings = {
  siteName: 'VermaVerse',
  defaultMetaDescription: 'A showcase of my projects and skills in VermaVerse, the digital realm of Anand Verma.',
  defaultMetaKeywords: 'portfolio, web developer, react, nextjs, anand verma, full-stack',
  siteOgImageUrl: 'https://placehold.co/1200x630.png?text=VermaVerse',
};

export const defaultExperienceForClient: Experience[] = [
  { id: 'exp_default_client_1', role: 'Lead Developer', company: 'Innovate Solutions Inc.', period: '2022 - Present', description: 'Spearheading the development of cutting-edge web applications using modern JavaScript frameworks and cloud technologies. Responsible for team leadership, code architecture, and project delivery.' },
  { id: 'exp_default_client_2', role: 'Senior UI/UX Designer', company: 'Creative Designs Co.', period: '2020 - 2022', description: 'Designed intuitive and engaging user interfaces for various digital products. Conducted user research, created wireframes and prototypes, and collaborated closely with development teams.' },
];

export const defaultEducationForClient: Education[] = [
  { id: 'edu_default_client_1', degree: 'Master of Science in Interaction Design', institution: 'Global Design Institute', period: '2018 - 2020' },
  { id: 'edu_default_client_2', degree: 'Bachelor of Technology in Computer Science', institution: 'Tech University', period: '2014 - 2018' },
];

export const defaultAboutMeDataForClient: AboutMeData = {
  name: 'Anand Verma',
  title: 'Full-Stack Developer & UI Enthusiast',
  bio: "Hello! I'm Anand, a passionate and results-oriented Full-Stack Developer with a keen eye for UI/UX design. My journey in the tech world is driven by the thrill of turning complex problems into elegant, user-friendly solutions. I thrive in collaborative environments and am always eager to learn and adapt to new technologies.\n\nIn VermaVerse, you'll find a collection of projects that showcase my dedication to quality, innovation, and a user-first approach. From architecting robust backend systems to crafting pixel-perfect frontends, I enjoy every aspect of the development lifecycle. Let's build something amazing together!",
  profileImage: 'https://placehold.co/400x400.png?text=AV',
  dataAiHint: 'developer portrait modern tech',
  experience: defaultExperienceForClient,
  education: defaultEducationForClient,
  email: 'anand.verma.dev@example.com',
  linkedinUrl: 'https://linkedin.com/in/anandverma-dev',
  githubUrl: 'https://github.com/anandverma-dev',
  twitterUrl: 'https://twitter.com/anandverma_dev',
};

export const defaultSkillsDataForClient: Skill[] = [
  { id: 'skill_default_js_client', name: 'JavaScript (ES6+)', category: 'Languages', iconName: 'Code', proficiency: 95 },
  { id: 'skill_default_react_client', name: 'React & Next.js', category: 'Frontend', iconName: 'Laptop', proficiency: 92 },
  { id: 'skill_default_node_client', name: 'Node.js & Express', category: 'Backend', iconName: 'Server', proficiency: 88 },
  { id: 'skill_default_figma_client', name: 'Figma & UI Design', category: 'Tools', iconName: 'PenTool', proficiency: 85 },
  { id: 'skill_default_gcp_client', name: 'Google Cloud Platform', category: 'DevOps', iconName: 'Cloud', proficiency: 70 },
  { id: 'skill_default_comms_client', name: 'Agile & Communication', category: 'Other', iconName: 'MessageSquare', proficiency: 90 },
];

export const defaultPortfolioItemsDataForClient: PortfolioItem[] = [
  {
    id: 'proj_default_portfolio_site_client',
    title: 'My Personal Portfolio (This Site!)',
    description: 'The very site you are browsing, built with Next.js, Tailwind CSS, Firebase, and a focus on modern web practices.',
    longDescription: 'This portfolio is a dynamic showcase of my skills and projects. It features a modern design, responsive layout, and an admin panel for easy content management. Built using Next.js for server-side rendering and static generation, Tailwind CSS for styling, and Firebase for backend services including Firestore database. All data is dynamically fetched and managed.',
    images: ['https://placehold.co/600x400.png?text=PortfolioSite1', 'https://placehold.co/600x400.png?text=PortfolioSite2'],
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Firebase', 'TypeScript', 'ShadCN UI'],
    slug: 'personal-portfolio-vermaverse',
    dataAiHint: 'website design code modern',
    readmeContent: '# Personal Portfolio - VermaVerse\n\nThis project is the source code for my personal portfolio website, VermaVerse. It demonstrates my ability to build full-stack applications with modern technologies.\n\n## Key Features\n- Dynamic content managed via Firestore.\n- Responsive design for all devices.\n- Showcase of projects, skills, and professional background.\n- Interactive contact form.\n- Admin panel for content updates (portfolio, skills, about me, site settings).\n\n## Technology Stack\n- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI Components, Lucide Icons\n- **Backend/Database**: Firebase (Firestore)\n- **Styling**: Tailwind CSS, PostCSS\n- **State Management**: React Hooks, Server Actions\n- **Form Handling**: React Hook Form, Zod for validation\n\nThis site is deployed on Vercel.',
    liveUrl: '#', // Should ideally be the actual URL of the deployed site
    repoUrl: 'https://github.com/yourusername/vermaverse-portfolio', // Replace with actual repo if available
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_default_ecom_client',
    title: 'E-commerce Platform Concept',
    description: 'A conceptual design and feature plan for a modern, scalable e-commerce platform with a focus on user experience.',
    longDescription: 'This project involved the conceptualization and high-level design of a scalable e-commerce platform. Key considerations included user experience (intuitive navigation, personalized recommendations), product management (variants, inventory), order processing (secure checkout, shipment tracking), and payment gateway integration. While not fully implemented, it demonstrates strategic thinking in platform architecture and an understanding of e-commerce best practices.',
    images: ['https://placehold.co/600x400.png?text=EcomConcept1', 'https://placehold.co/600x400.png?text=EcomUX'],
    tags: ['UX Design', 'System Architecture', 'E-commerce Strategy', 'Product Management'],
    slug: 'ecommerce-platform-concept',
    dataAiHint: 'online store shopping cart',
    readmeContent: '# E-commerce Platform Concept\n\nThis document outlines the concept for a modern e-commerce platform designed for scalability and excellent user experience.\n\n## Core Modules & Features\n- **Product Catalog Management**: Advanced filtering, search, product variants, reviews.\n- **User Authentication & Profiles**: Secure login, order history, wishlists.\n- **Shopping Cart & Checkout**: Streamlined multi-step checkout, multiple payment options.\n- **Order Management**: Admin dashboard for order tracking, inventory updates.\n- **Personalization Engine**: AI-driven product recommendations.\n- **Marketing & Promotions**: Coupon codes, sales events management.',
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
  "HTML5", "CSS3", "SCSS/SASS", "React", "Angular", "Vue.js", "Next.js", "Tailwind CSS", "ShadCN UI", "Bootstrap",
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", ".NET Core", "Firebase", "Firestore", "Firebase Auth",
  "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "AWS", "Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Git", "GitHub Actions", "Jenkins", "Terraform",
  "Figma", "Adobe XD", "Sketch", "VS Code", "IntelliJ IDEA", "WebStorm", "Jira", "Confluence",
  "Agile", "Scrum", "Kanban", "CI/CD", "REST APIs", "GraphQL", "Microservices", "Serverless",
  "Problem Solving", "Critical Thinking", "Communication", "Teamwork", "Project Management", "Leadership", "UI/UX Design Principles"
];
