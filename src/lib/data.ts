
import type React from 'react';
import type { AppData, PortfolioItem, Skill, AboutMeData, SiteSettings, Experience, Education } from '@/lib/types';
import {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu
} from 'lucide-react';
import { SKILL_CATEGORIES } from './constants';

// --- Default Data Structures for Client-Side Admin Forms & Fallbacks ---
export const defaultSiteSettingsForClient: SiteSettings = {
  siteName: 'My Awesome Portfolio',
  defaultMetaDescription: 'Showcasing my projects and skills in web development.',
  defaultMetaKeywords: 'portfolio, web developer, react, nextjs',
  siteOgImageUrl: 'https://placehold.co/1200x630.png',
};

export const defaultExperienceForClient: Experience[] = [
  { id: 'exp1', role: 'Software Engineer', company: 'Tech Solutions Inc.', period: '2021 - Present', description: 'Developing cutting-edge web applications using Next.js and TypeScript.' },
  { id: 'exp2', role: 'Frontend Developer', company: 'Web Wizards LLC', period: '2019 - 2021', description: 'Built responsive user interfaces with React and Redux.' },
];

export const defaultEducationForClient: Education[] = [
  { id: 'edu1', degree: 'B.Sc. in Computer Science', institution: 'University of Technology', period: '2015 - 2019' },
];

export const defaultAboutMeDataForClient: AboutMeData = {
  name: 'B.Anand',
  title: 'Full-Stack Developer & UI/UX Enthusiast',
  bio: "Hello! I'm Anand, a passionate developer with a knack for creating intuitive and dynamic web experiences. I thrive on turning complex problems into elegant solutions. My journey in tech has been driven by a relentless curiosity and a desire to build things that make a difference. When I'm not coding, you can find me exploring new technologies or contributing to open-source projects.",
  profileImage: 'https://placehold.co/400x400.png',
  dataAiHint: 'developer portrait',
  experience: defaultExperienceForClient,
  education: defaultEducationForClient,
  email: 'anand.b@example.com',
  linkedinUrl: 'https://linkedin.com/in/anandb',
  githubUrl: 'https://github.com/anandb',
  twitterUrl: 'https://twitter.com/anandb',
};

export const defaultSkillsDataForClient: Skill[] = [
  { id: 'skill1', name: 'JavaScript', category: 'Languages', iconName: 'Code', proficiency: 95 },
  { id: 'skill2', name: 'TypeScript', category: 'Languages', iconName: 'Code', proficiency: 90 },
  { id: 'skill3', name: 'Python', category: 'Languages', iconName: 'Code', proficiency: 80 },
  { id: 'skill4', name: 'React', category: 'Frontend', iconName: 'Laptop', proficiency: 95 },
  { id: 'skill5', name: 'Next.js', category: 'Frontend', iconName: 'Laptop', proficiency: 92 },
  { id: 'skill6', name: 'Tailwind CSS', category: 'Frontend', iconName: 'Palette', proficiency: 88 },
  { id: 'skill7', name: 'Node.js', category: 'Backend', iconName: 'Server', proficiency: 85 },
  { id: 'skill8', name: 'Express.js', category: 'Backend', iconName: 'Server', proficiency: 80 },
  { id: 'skill9', name: 'PostgreSQL', category: 'Backend', iconName: 'Database', proficiency: 78 },
  { id: 'skill10', name: 'Firebase', category: 'Backend', iconName: 'Cloud', proficiency: 82 },
  { id: 'skill11', name: 'Docker', category: 'DevOps', iconName: 'Cog', proficiency: 75 },
  { id: 'skill12', name: 'AWS', category: 'DevOps', iconName: 'Cloud', proficiency: 70 },
  { id: 'skill13', name: 'Git & GitHub', category: 'Tools', iconName: 'GitMerge', proficiency: 90 },
  { id: 'skill14', name: 'Figma', category: 'Tools', iconName: 'PenTool', proficiency: 80 },
  { id: 'skill15', name: 'REST APIs', category: 'Other', iconName: 'Network', proficiency: 88 },
  { id: 'skill16', name: 'GraphQL', category: 'Other', iconName: 'Network', proficiency: 70 },
];

export const defaultPortfolioItemsDataForClient: PortfolioItem[] = [
  {
    id: 'proj1',
    title: 'E-commerce Platform X',
    description: 'A full-featured e-commerce platform with Next.js, Stripe, and Tailwind CSS.',
    longDescription: 'Developed a scalable e-commerce solution providing a seamless shopping experience. Implemented features like product listings, cart management, secure payments with Stripe, and an admin dashboard for order processing. Focused on performance and SEO.',
    images: ['https://placehold.co/600x400.png?text=Ecomm-Main', 'https://placehold.co/600x400.png?text=Ecomm-Product'],
    tags: ['Next.js', 'React', 'Stripe', 'Tailwind CSS', 'TypeScript', 'E-commerce'],
    liveUrl: 'https://example-ecommerce.com',
    repoUrl: 'https://github.com/anandb/ecommerce-x',
    slug: 'ecommerce-platform-x',
    dataAiHint: 'website interface',
    readmeContent: `# E-commerce Platform X\n\nThis is a detailed README for the e-commerce project...`,
  },
  {
    id: 'proj2',
    title: 'AI Powered Blog Generator',
    description: 'A SaaS application that uses AI to generate blog content for users.',
    longDescription: 'Built a content generation tool leveraging OpenAI APIs to help users create blog posts quickly. Features include topic suggestions, outline generation, and full article drafting. The backend is powered by Node.js and Firebase.',
    images: ['https://placehold.co/600x400.png?text=AI-Blog-Main', 'https://placehold.co/600x400.png?text=AI-Blog-Editor'],
    tags: ['Node.js', 'Firebase', 'OpenAI', 'React', 'SaaS', 'AI'],
    liveUrl: 'https://example-aiblog.com',
    repoUrl: 'https://github.com/anandb/ai-blog-generator',
    slug: 'ai-blog-generator',
    dataAiHint: 'dashboard application',
    readmeContent: `# AI Blog Generator\n\nLeveraging the power of AI to create content...`,
  },
  {
    id: 'proj3',
    title: 'Personal Portfolio Website',
    description: 'This very portfolio, built with Next.js, Tailwind CSS, and deployed on Vercel.',
    longDescription: 'My personal space on the web to showcase my skills and projects. Designed for performance and aesthetics, with a focus on clean code and a good user experience. Includes an admin panel for content management.',
    images: ['https://placehold.co/600x400.png?text=Portfolio-Home', 'https://placehold.co/600x400.png?text=Portfolio-Admin'],
    tags: ['Next.js', 'Tailwind CSS', 'Vercel', 'TypeScript', 'Portfolio'],
    slug: 'personal-portfolio-v2',
    dataAiHint: 'personal website',
    readmeContent: `# Personal Portfolio\n\nThis is the codebase for my personal portfolio...`,
  }
];


// --- Static Configurations (should not change often) ---
export const skillCategories = SKILL_CATEGORIES;

export const lucideIconsMap: { [key: string]: React.ElementType } = {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu
};
export const availableIconNames = Object.keys(lucideIconsMap);

// This is a list of common skill names, primarily for autocompletion suggestions in the admin panel.
// It does not dictate what skills *can* be added, only provides suggestions.
export const commonSkillNames: string[] = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Ruby", "Swift", "Kotlin", "PHP", "Rust", "Scala", "Perl", "Lua",
  "HTML", "CSS", "SCSS/SASS", "React", "Angular", "Vue.js", "Next.js", "Gatsby", "Svelte", "jQuery", "Bootstrap", "Tailwind CSS", "Material UI", "Ember.js", "Backbone.js",
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Ruby on Rails", ".NET Core", "Laravel", "FastAPI", "Koa", "NestJS",
  "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Firebase Realtime Database", "Firestore", "Redis", "Cassandra", "Oracle DB", "Microsoft SQL Server", "DynamoDB",
  "AWS", "Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub Actions", "GitLab CI", "Terraform", "Ansible", "Puppet", "Chef", "Prometheus", "Grafana", "ELK Stack", "Serverless Framework",
  "React Native", "Flutter", "Swift (iOS)", "Kotlin (Android)", "Java (Android)", "Xamarin", "Ionic",
  "Machine Learning", "Deep Learning", "Natural Language Processing (NLP)", "Computer Vision", "TensorFlow", "PyTorch", "scikit-learn", "Keras", "Pandas", "NumPy", "OpenCV",
  "Data Analysis", "Data Visualization", "R", "Jupyter Notebooks", "Apache Spark", "Hadoop", "Tableau", "Power BI",
  "Jest", "Mocha", "Chai", "Selenium", "Cypress", "JUnit", "PyTest", "Testing Library",
  "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "VS Code", "IntelliJ IDEA", "Eclipse", "Vim", "Emacs", "JIRA", "Confluence", "Slack", "Microsoft Teams",
  "Agile", "Scrum", "Kanban", "Waterfall", "CI/CD", "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)", "Microservices", "REST APIs", "GraphQL", "Object-Oriented Programming (OOP)", "Functional Programming", "DevSecOps",
  "Problem Solving", "Communication", "Teamwork", "Leadership", "Time Management", "Critical Thinking", "Adaptability", "Creativity", "Project Management"
];

// Re-export initial data for clarity, though pages should fetch live data.
// These are primarily for initializing client-side forms in the admin panel.
export const initialAboutMeDataForClient: AppData['aboutMe'] = defaultAboutMeDataForClient;
export const initialPortfolioItemsDataForClient: AppData['portfolioItems'] = defaultPortfolioItemsDataForClient;
export const initialSkillsDataForClient: AppData['skills'] = defaultSkillsDataForClient;
export const initialSiteSettingsForClient: AppData['siteSettings'] = defaultSiteSettingsForClient;
