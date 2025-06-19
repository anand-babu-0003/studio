
import type React from 'react';
import type { AppData, PortfolioItem, Skill, AboutMeData, SiteSettings, Experience, Education } from '@/lib/types';
import {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu
} from 'lucide-react';
import { SKILL_CATEGORIES } from './constants';

// --- Default Data Structures for Client-Side Admin Forms & Fallbacks ---
// These are used to initialize forms or provide default content if Firestore data is unavailable.

export const defaultSiteSettingsForClient: SiteSettings = {
  siteName: 'My Portfolio',
  defaultMetaDescription: 'A showcase of my projects and skills.',
  defaultMetaKeywords: 'web developer, react, nextjs, portfolio',
  siteOgImageUrl: 'https://placehold.co/1200x630.png', // Default OG image
};

export const defaultExperienceForClient: Experience[] = [
  { id: 'exp_default_1', role: 'Software Engineer', company: 'Tech Solutions Inc.', period: '2021 - Present', description: 'Developing cutting-edge web applications.' },
  { id: 'exp_default_2', role: 'Frontend Developer', company: 'Web Wizards LLC', period: '2019 - 2021', description: 'Built responsive user interfaces.' },
];

export const defaultEducationForClient: Education[] = [
  { id: 'edu_default_1', degree: 'B.Sc. in Computer Science', institution: 'University of Technology', period: '2015 - 2019' },
];

export const defaultAboutMeDataForClient: AboutMeData = {
  name: 'Your Name',
  title: 'Your Title / Tagline',
  bio: "Hello! I'm a passionate developer. This is a default bio. Please update it in the admin panel.",
  profileImage: 'https://placehold.co/400x400.png',
  dataAiHint: 'profile picture developer',
  experience: defaultExperienceForClient,
  education: defaultEducationForClient,
  email: 'your-email@example.com',
  linkedinUrl: 'https://linkedin.com/in/yourprofile',
  githubUrl: 'https://github.com/yourusername',
  twitterUrl: 'https://twitter.com/yourusername',
};

export const defaultSkillsDataForClient: Skill[] = [
  { id: 'skill_default_1', name: 'JavaScript', category: 'Languages', iconName: 'Code', proficiency: 90 },
  { id: 'skill_default_2', name: 'React', category: 'Frontend', iconName: 'Laptop', proficiency: 85 },
  { id: 'skill_default_3', name: 'Node.js', category: 'Backend', iconName: 'Server', proficiency: 80 },
];

export const defaultPortfolioItemsDataForClient: PortfolioItem[] = [
  {
    id: 'proj_default_1',
    title: 'Sample Project Alpha',
    description: 'A brief description of Sample Project Alpha. Update this in the admin panel.',
    longDescription: 'A more detailed description of Sample Project Alpha. This project showcases skills in X, Y, and Z. Update this in the admin panel.',
    images: ['https://placehold.co/600x400.png?text=ProjectAlpha-1', 'https://placehold.co/600x400.png?text=ProjectAlpha-2'],
    tags: ['Next.js', 'React', 'Sample'],
    slug: 'sample-project-alpha',
    dataAiHint: 'web application',
    readmeContent: '# Sample Project Alpha\nThis is a placeholder README. Please update it.',
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'proj_default_2',
    title: 'Sample Project Beta',
    description: 'A brief description of Sample Project Beta. Update this in the admin panel.',
    longDescription: 'A more detailed description of Sample Project Beta. This project highlights expertise in A, B, and C. Update this in the admin panel.',
    images: ['https://placehold.co/600x400.png?text=ProjectBeta-1'],
    tags: ['TypeScript', 'Tailwind CSS', 'Sample'],
    slug: 'sample-project-beta',
    dataAiHint: 'mobile app design',
    readmeContent: '# Sample Project Beta\nThis is a placeholder README. Please update it.',
    liveUrl: '#',
  }
];

// --- Static Configurations (should not change often) ---
export const skillCategories = SKILL_CATEGORIES; // From constants.ts

export const lucideIconsMap: { [key: string]: React.ElementType } = {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu, Package: Package // Added Package as a fallback
};
export const availableIconNames = Object.keys(lucideIconsMap);

// This is a list of common skill names, primarily for autocompletion suggestions in the admin panel.
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

// NO MORE FILE SYSTEM FUNCTIONS (getAppData, saveAppData) HERE
// data.json is NO LONGER THE SOURCE OF TRUTH for dynamic data.
// Dynamic data (portfolio, skills, aboutMe, siteSettings) comes from Firestore.
