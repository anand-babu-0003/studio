
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData, AppData, SiteSettings } from '@/lib/types';
// This imports the content of data.json for initial/client-side use by admin panel.
import jsonDataFromFile from './data.json'; 
import { 
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, 
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb, 
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu
} from 'lucide-react';
import { SKILL_CATEGORIES } from './constants'; // Import the centralized categories

// Define a default, well-structured AppData object for fallbacks, aligned with server action defaults
const defaultAppData: AppData = {
  portfolioItems: [],
  skills: [],
  aboutMe: {
    name: 'Default Name',
    title: 'Default Title',
    bio: 'Default bio.',
    profileImage: 'https://placehold.co/400x400.png',
    dataAiHint: 'placeholder image',
    experience: [],
    education: [],
    email: 'default@example.com',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
  },
  siteSettings: {
    siteName: 'My Portfolio',
    defaultMetaDescription: 'A showcase of my projects and skills.',
    defaultMetaKeywords: '',
    siteOgImageUrl: '',
  },
};

// Ensure jsonDataFromFile is treated as an object, defaulting to an empty one if import yields non-object.
const importedValidObject = (typeof jsonDataFromFile === 'object' && jsonDataFromFile !== null)
  ? jsonDataFromFile
  : {};

// Cast to Partial<AppData> to handle cases where jsonDataFromFile might be empty or missing keys.
const importedData = importedValidObject as Partial<AppData>;

// Defensively merge imported data with defaults.
const appDataForClient: AppData = {
  portfolioItems: Array.isArray(importedData.portfolioItems)
    ? importedData.portfolioItems
    : defaultAppData.portfolioItems,
  skills: Array.isArray(importedData.skills)
    ? importedData.skills
    : defaultAppData.skills,
  aboutMe: {
    ...defaultAppData.aboutMe,
    ...( (typeof importedData.aboutMe === 'object' && importedData.aboutMe !== null) 
        ? importedData.aboutMe 
        : {} 
      ),
  },
  siteSettings: {
    ...defaultAppData.siteSettings,
    ...( (typeof importedData.siteSettings === 'object' && importedData.siteSettings !== null)
        ? importedData.siteSettings
        : {}
      ),
  },
};

export const portfolioItems: PortfolioItem[] = appDataForClient.portfolioItems;
export const skills: Skill[] = appDataForClient.skills;
export const aboutMe: AboutMeData = appDataForClient.aboutMe;
export const siteSettings: SiteSettings = appDataForClient.siteSettings;


// --- Static Configs (Client-Safe) ---
// Use the imported SKILL_CATEGORIES constant
export const skillCategories = SKILL_CATEGORIES;


export const lucideIconsMap: { [key: string]: React.ElementType } = {
  Code,
  Database,
  Server,
  Cloud,
  PenTool,
  Terminal,
  Briefcase,
  Zap,
  Brain,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Smartphone,
  Laptop,
  GitMerge, Palette, Cog, Lightbulb, 
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu
};
export const availableIconNames = Object.keys(lucideIconsMap);

export const commonSkillNames: string[] = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Ruby", "Swift", "Kotlin", "PHP", "Rust", "Scala", "Perl", "Lua",
  // Frontend Technologies
  "HTML", "CSS", "SCSS/SASS", "React", "Angular", "Vue.js", "Next.js", "Gatsby", "Svelte", "jQuery", "Bootstrap", "Tailwind CSS", "Material UI", "Ember.js", "Backbone.js",
  // Backend Technologies
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Ruby on Rails", ".NET Core", "Laravel", "FastAPI", "Koa", "NestJS",
  // Databases
  "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Firebase Realtime Database", "Firestore", "Redis", "Cassandra", "Oracle DB", "Microsoft SQL Server", "DynamoDB",
  // DevOps & Cloud
  "AWS", "Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub Actions", "GitLab CI", "Terraform", "Ansible", "Puppet", "Chef", "Prometheus", "Grafana", "ELK Stack", "Serverless Framework",
  // Mobile Development
  "React Native", "Flutter", "Swift (iOS)", "Kotlin (Android)", "Java (Android)", "Xamarin", "Ionic",
  // AI/ML
  "Machine Learning", "Deep Learning", "Natural Language Processing (NLP)", "Computer Vision", "TensorFlow", "PyTorch", "scikit-learn", "Keras", "Pandas", "NumPy", "OpenCV",
  // Data Science & Analytics
  "Data Analysis", "Data Visualization", "R", "Jupyter Notebooks", "Apache Spark", "Hadoop", "Tableau", "Power BI",
  // Testing
  "Jest", "Mocha", "Chai", "Selenium", "Cypress", "JUnit", "PyTest", "Testing Library",
  // Tools & Software
  "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "VS Code", "IntelliJ IDEA", "Eclipse", "Vim", "Emacs", "JIRA", "Confluence", "Slack", "Microsoft Teams",
  // Methodologies & Practices
  "Agile", "Scrum", "Kanban", "Waterfall", "CI/CD", "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)", "Microservices", "REST APIs", "GraphQL", "Object-Oriented Programming (OOP)", "Functional Programming", "DevSecOps",
  // Soft Skills (Examples)
  "Problem Solving", "Communication", "Teamwork", "Leadership", "Time Management", "Critical Thinking", "Adaptability", "Creativity", "Project Management"
];
    
