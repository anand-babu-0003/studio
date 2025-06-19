
import type React from 'react';
import type { AppData } from '@/lib/types'; // Ensure AppData is correctly typed for default structure
// Removed import of jsonDataFromFile: import jsonDataFromFile from './data.json'; 
import { 
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, 
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb, 
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu
} from 'lucide-react';
import { SKILL_CATEGORIES } from './constants';

// Define a default, well-structured AppData object for any fallbacks if needed elsewhere (though primarily pages fetch directly now)
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

// These are truly static configurations and are safe to export directly.
// They are not dependent on data.json anymore.
export const skillCategories = SKILL_CATEGORIES;

export const lucideIconsMap: { [key: string]: React.ElementType } = {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, 
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb, 
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu
};
export const availableIconNames = Object.keys(lucideIconsMap);

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

// The following exports are for client-side defaults in admin forms if needed,
// but they should NOT be the source of truth for displayed data on public pages.
// Public pages must fetch live data.
export const initialAboutMeDataForClient: AppData['aboutMe'] = { ...defaultAppData.aboutMe };
export const initialPortfolioItemsDataForClient: AppData['portfolioItems'] = [...defaultAppData.portfolioItems];
export const initialSkillsDataForClient: AppData['skills'] = [...defaultAppData.skills];
export const initialSiteSettingsForClient: AppData['siteSettings'] = { ...defaultAppData.siteSettings };
