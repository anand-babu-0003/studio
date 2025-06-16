import type { PortfolioItem, Skill } from '@/lib/types';
import { Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare, Settings, LayoutDashboard, Smartphone, Laptop } from 'lucide-react';

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with modern UI and robust backend.',
    longDescription: 'Developed a comprehensive e-commerce solution enabling users to browse products, add to cart, and complete purchases. Integrated Stripe for payments and Algolia for search. Built with Next.js, TypeScript, Tailwind CSS, and Node.js.',
    images: ['https://placehold.co/600x400.png?text=Project+1+Image+1', 'https://placehold.co/600x400.png?text=Project+1+Image+2'],
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Node.js', 'E-commerce'],
    liveUrl: '#',
    repoUrl: '#',
    slug: 'ecommerce-platform',
    dataAiHint: 'online store'
  },
  {
    id: 'project-2',
    title: 'Social Media App',
    description: 'A dynamic social media application for content sharing and interaction.',
    longDescription: 'Created a social media app where users can post updates, follow others, and engage with content. Implemented real-time notifications using WebSockets. Tech stack includes React, Firebase, and Material UI.',
    images: ['https://placehold.co/600x400.png?text=Project+2+Image+1'],
    tags: ['React', 'Firebase', 'Social Media', 'Real-time'],
    liveUrl: '#',
    slug: 'social-media-app',
    dataAiHint: 'social network'
  },
  {
    id: 'project-3',
    title: 'Project Management Tool',
    description: 'A collaborative tool for managing projects and tasks effectively.',
    longDescription: 'Designed and built a project management tool to help teams organize tasks, track progress, and collaborate efficiently. Features include Kanban boards, task assignments, and progress reports. Built with Vue.js, Express, and MongoDB.',
    images: ['https://placehold.co/600x400.png?text=Project+3+Image+1', 'https://placehold.co/600x400.png?text=Project+3+Image+2'],
    tags: ['Vue.js', 'Express', 'MongoDB', 'Productivity'],
    repoUrl: '#',
    slug: 'project-management-tool',
    dataAiHint: 'task manager'
  },
];

export const skills: Skill[] = [
  // Languages
  { id: 'ts', name: 'TypeScript', icon: Code, category: 'Languages', proficiency: 90 },
  { id: 'js', name: 'JavaScript', icon: Code, category: 'Languages', proficiency: 95 },
  { id: 'python', name: 'Python', icon: Code, category: 'Languages', proficiency: 75 },
  // Frontend
  { id: 'react', name: 'React', icon: Laptop, category: 'Frontend', proficiency: 90 },
  { id: 'nextjs', name: 'Next.js', icon: Laptop, category: 'Frontend', proficiency: 85 },
  { id: 'vue', name: 'Vue.js', icon: Laptop, category: 'Frontend', proficiency: 70 },
  { id: 'tailwind', name: 'Tailwind CSS', icon: PenTool, category: 'Frontend', proficiency: 90 },
  // Backend
  { id: 'nodejs', name: 'Node.js', icon: Server, category: 'Backend', proficiency: 85 },
  { id: 'express', name: 'Express.js', icon: Server, category: 'Backend', proficiency: 80 },
  { id: 'django', name: 'Django', icon: Server, category: 'Backend', proficiency: 70 },
  // Databases
  { id: 'postgres', name: 'PostgreSQL', icon: Database, category: 'Backend', proficiency: 75 },
  { id: 'mongodb', name: 'MongoDB', icon: Database, category: 'Backend', proficiency: 80 },
  // DevOps
  { id: 'docker', name: 'Docker', icon: Settings, category: 'DevOps', proficiency: 70 },
  { id: 'aws', name: 'AWS', icon: Cloud, category: 'DevOps', proficiency: 65 },
  // Tools
  { id: 'git', name: 'Git', icon: Briefcase, category: 'Tools', proficiency: 95 },
  { id: 'figma', name: 'Figma', icon: PenTool, category: 'Tools', proficiency: 70 },
  { id: 'vscode', name: 'VS Code', icon: Terminal, category: 'Tools', proficiency: 95 },
];

export const aboutMe = {
  name: 'Sahil Verma (Demo)',
  title: 'Full Stack Developer & UI/UX Enthusiast',
  bio: `Hello! I'm a passionate and results-driven Full Stack Developer with a keen eye for UI/UX design. I thrive on transforming complex problems into intuitive, user-friendly applications. My journey in tech has been fueled by a constant curiosity and a desire to build things that make a difference.

I have experience across the entire development lifecycle, from conceptualization and design to development, testing, and deployment. I enjoy working with modern technologies and continuously learning new skills to stay at the forefront of innovation.

When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee while brainstorming my next big idea. I believe in the power of collaboration and am always excited to work with like-minded individuals to create impactful digital experiences.`,
  experience: [
    {
      id: 'exp1',
      role: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      period: '2021 - Present',
      description: 'Led development of key features for enterprise-level applications. Mentored junior developers and contributed to architectural decisions.',
    },
    {
      id: 'exp2',
      role: 'Software Developer',
      company: 'Innovatech Ltd.',
      period: '2019 - 2021',
      description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software.',
    },
  ],
  education: [
     {
      id: 'edu1',
      degree: 'Master of Science in Computer Science',
      institution: 'University of Advanced Technology',
      period: '2017 - 2019',
    },
    {
      id: 'edu2',
      degree: 'Bachelor of Science in Information Technology',
      institution: 'State Engineering College',
      period: '2013 - 2017',
    }
  ],
  profileImage: 'https://placehold.co/400x400.png?text=Profile',
  dataAiHint: 'developer portrait'
};

export const skillCategories: Array<Skill['category']> = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Other'];
