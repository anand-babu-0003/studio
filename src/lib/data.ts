
import type React from 'react';
import type { PortfolioItem, Skill, AboutMeData, SiteSettings, Experience, Education, NotFoundPageData } from '@/lib/types';
import {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard, Smartphone, Laptop, GitMerge, Palette, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot, Cpu, Package,
  Atom, Accessibility, Anchor, AppWindow, Archive, Asterisk, Award, Axe,
  Baby, BadgeAlert, BadgeCheck, BadgeDollarSign, BadgeHelp, BadgeInfo, BadgePercent,
  BaggageClaim, Banana, Banknote, BarChart2, BarChart3, BarChart4, BarChartBig,
  Baseline, Bath, Beaker, Bean, BedDouble, BedSingle, Beef, Beer, Bell,
  Bike, Binary, Bitcoin, Blend, Bold, Bomb, Bone, Book, Bookmark, BotIcon, Box, Braces, Brackets, // Changed Blender to Blend
  BrainCircuit, BrickWall, BriefcaseBusiness, Bug, Building, Bus, Cable, Cake, Calculator, Calendar, Camera,
  CandlestickChart, Car, Carrot, CaseLower, CaseSensitive, CaseUpper, CassetteTape, Castle, Cat, CheckCheck,
  ChefHat, Cherry, ChevronDownSquare, ChevronUpSquare, Church, CircleDollarSign, Citrus, Clapperboard,
  Clipboard, Clock, CloudCog, CloudDrizzle, CloudFog, CloudHail, CloudLightning, CloudMoon, CloudRain,
  CloudSnow, CloudSun, Cloudy, Clover, CodeSquare, Codepen, Coins, Columns, Command, Compass, Component,
  ConciergeBell, Construction, Contact2, Container, Cookie, Copy, Copyright, CornerDownLeft, CornerDownRight,
  Crown, CupSoda, Currency, PilcrowSquare, Diamond, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices, Diff, Disc,
  Dna, Dog, DollarSign, Donut, DoorClosed, DoorOpen, DownloadCloud, DraftingCompass, Drama, Dribbble, Droplet,
  Drumstick, Dumbbell, Ear, Eclipse, Edit, Egg, Equal, Euro, Expand, ExternalLink, Eye,
  Facebook, Factory, Fan, Feather, FerrisWheel, Figma, FileArchive, FileAudio, FileBadge, FileBarChart,
  FileCheck, FileCode, FileCog, FileDiff, FileDigit, FileDown, FileEdit, FileHeart, FileImage, FileInput,
  FileJson, FileKey, FileLock, FileMinus, FileOutput, FilePlus, FileQuestion, FileScan, FileSearch, FileSpreadsheet,
  FileSymlink, FileTerminal, FileText, FileType, FileUp, FileVideo, FileVolume, FileWarning, FileX, Files,
  Film, Filter, Fingerprint, Flag, Flame, FlaskConical, FlaskRound, FlipHorizontal, FlipVertical, Flower,
  Folder, FolderArchive, FolderCheck, FolderClock, FolderClosed, FolderCog, FolderDot, FolderDown, FolderEdit,
  FolderGit, FolderGit2, FolderHeart, FolderInput, FolderKanban, FolderKey, FolderLock, FolderMinus, FolderOpen,
  FolderOutput, FolderPlus, FolderRoot, FolderSearch, FolderSymlink, FolderTree, FolderUp, FolderX, Folders,
  Footprints, Forklift, Forward, Frame, Frown, Fuel, FunctionSquare, Gamepad, Gamepad2, Gauge, Gavel, Gem,
  Ghost, Gift, GitBranch, GitBranchPlus, GitCommit, GitCompare, GitFork, GitGraph, GitPullRequest, GitPullRequestClosed,
  GitPullRequestDraft, Github, Gitlab, GlassWater, Globe, Goal, Grab, GraduationCap, Grape, Grid, Grip,
  Hammer, Hand, HandCoins, HandHeart, HandHelping, HandMetal, HandPlatter, HardDrive, HardHat, Hash, Haze,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Headphones, Heart, Heater, Hexagon, Highlighter,
  History, Hop, Hourglass, Image as ImageIcon, Import, Indent, IndianRupee, Infinity as InfinityIcon, Info, Italic, IterationCcw,
  IterationCw, JapaneseYen, Joystick, Kanban, Key, Keyboard, Lamp, Landmark, Languages, Laugh, Layout,
  LayoutDashboard as LayoutDashboardIcon, LayoutGrid, LayoutList, LayoutTemplate, Leaf, Library, LifeBuoy, Link,
  List, ListChecks, ListEnd, ListFilter, ListMinus, ListMusic, ListOrdered, ListPlus, ListRestart, ListTodo,
  ListTree, ListVideo, ListX, Loader, Lock, LogIn, LogOut, Lollipop, Luggage, Map, MapPin, Martini, Maximize,
  Medal, Megaphone, Menu, Merge, Milestone, Milk, Minus, Monitor, Moon, MoreHorizontal, Mountain, Mouse,
  MousePointer, Move, Music, Navigation, Newspaper, Nut, Orbit, PackageCheck, PackageMinus, PackageOpen,
  PackagePlus, PackageSearch, PackageX, PaintBucket, Paintbrush, Palette as PaletteIcon, Palmtree, PanelBottom,
  PanelLeft, Paperclip, ParkingCircle, PartyPopper, Pause, PawPrint, PcCase, Pen, Pencil, Percent, PersonStanding,
  Phone, PieChart, Pin, Pipette, Pizza, Plane, Plug, Plus, Pointer, PoundSterling, Power, Presentation, Printer,
  Projector, Proportions, Pyramid, QrCode, Quote, Rabbit, Radar, Radiation, Radio, Rat, Ratio, Receipt,
  RectangleHorizontal, RectangleVertical, Recycle, Redo, Regex, Repeat, Reply, Rocket, Router, Rss, Ruler,
  RussianRuble, Sailboat, Save, Scale, Scan, School, Scissors, ScreenShare, Scroll, Search, Send, SeparatorHorizontal,
  SeparatorVertical, Share, Sheet, Shell, Shield, Ship, Shirt, ShoppingBag, ShoppingCart, Shovel, ShowerHead,
  Shrink, Sigma, Signal, Siren, Slack, Slice, SlidersHorizontal, Smile, Snowflake, Sofa, Soup, Space, Sparkle,
  Speaker, Spline, Split, Sprout, Square, Star, Stethoscope, Sticker, Store, StretchHorizontal, StretchVertical,
  Strikethrough, Subscript, Sun, Superscript, SwatchBook, SwissFranc, SwitchCamera, Sword, Swords, Syringe,
  Table, Tablet, Tag, Target, Tent, TestTube, Text, TextCursor, TextQuote, Ticket, Timer, Trello, TrendingDown,
  TrendingUp, Triangle, Trophy, Truck, Tv, Twitch, Underline, Undo, UnfoldHorizontal, UnfoldVertical, Unlink,
  Unplug, Upload, Usb, User, Users, Utensils, UtilityPole, Variable, Vault, VenetianMask, Vibrate, Video, View,
  Voicemail, Volume, Vote, Wallet, Wand, Warehouse, Watch, Waves, Webcam, Webhook, Weight, Wheat, Wifi, Wind,
  Wine, Workflow, Wrench, Youtube, Zap as ZapIcon, ZoomIn, ZoomOut,
  Layers as LayersIcon, 
  ArrowRightLeft as ArrowRightLeftIcon
} from 'lucide-react';
import { SKILL_CATEGORIES } from './constants';

// --- Default Data Structures for Client-Side Admin Forms & Fallbacks ---

export const defaultSiteSettingsForClient: SiteSettings = {
  siteName: 'VermaVerse',
  defaultMetaDescription: 'A showcase of my projects and skills in VermaVerse, the digital realm of Anand Verma.',
  defaultMetaKeywords: 'portfolio, web developer, react, nextjs, anand verma, full-stack',
  siteOgImageUrl: 'https://placehold.co/1200x630.png?text=VermaVerse',
  maintenanceMode: false,
  skillsPageMetaTitle: 'My Skills | VermaVerse',
  skillsPageMetaDescription: 'Explore my diverse skill set including programming languages, frameworks, and tools used in VermaVerse.',
};

export const defaultExperienceForClient: Experience[] = [
  { id: 'exp_default_client_1_static', role: 'Lead Developer', company: 'Innovate Solutions Inc.', period: '2022 - Present', description: 'Spearheading the development of cutting-edge web applications using modern JavaScript frameworks and cloud technologies. Responsible for team leadership, code architecture, and project delivery.' },
  { id: 'exp_default_client_2_static', role: 'Senior UI/UX Designer', company: 'Creative Designs Co.', period: '2020 - 2022', description: 'Designed intuitive and engaging user interfaces for various digital products. Conducted user research, created wireframes and prototypes, and collaborated closely with development teams.' },
];

export const defaultEducationForClient: Education[] = [
  { id: 'edu_default_client_1_static', degree: 'Master of Science in Interaction Design', institution: 'Global Design Institute', period: '2018 - 2020' },
  { id: 'edu_default_client_2_static', degree: 'Bachelor of Technology in Computer Science', institution: 'Tech University', period: '2014 - 2018' },
];

export const defaultAboutMeDataForClient: AboutMeData = {
  name: 'Anand Verma',
  title: 'Full-Stack Developer & UI Enthusiast',
  bio: "Hello! I'm Anand, a passionate and results-oriented Full-Stack Developer with a keen eye for UI/UX design. My journey in the tech world is driven by the thrill of turning complex problems into elegant, user-friendly solutions. I thrive in collaborative environments and am always eager to learn and adapt to new technologies.\n\nIn VermaVerse, you'll find a collection of projects that showcase my dedication to quality, innovation, and a user-first approach. From architecting robust backend systems to crafting pixel-perfect frontends, I enjoy every aspect of the development lifecycle. Let's build something amazing together!",
  profileImage: 'https://github.com/anand-babu-0003/TrueValidator2/blob/main/Screenshot_2024-11-19-16-59-04-27_99c04817c0de5652397fc8b56c3b3817~2.jpg?raw=true',
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
    liveUrl: '#',
    repoUrl: 'https://github.com/yourusername/vermaverse-portfolio',
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  }
];

export const defaultNotFoundPageDataForClient: NotFoundPageData = {
  imageSrc: 'https://placehold.co/400x300.png',
  dataAiHint: 'page not found illustration',
  heading: "Oops! Page Not Found.",
  message: "The page you're looking for seems to have ventured off the map. Let's get you back on track.",
  buttonText: "Go to Homepage",
};

export const skillCategories = SKILL_CATEGORIES;

export const lucideIconsMap: { [key: string]: React.ElementType } = {
  Code, Database, Server, Cloud, PenTool, Terminal, Briefcase, Zap, Brain, MessageSquare,
  Settings, LayoutDashboard: LayoutDashboardIcon, Smartphone, Laptop, GitMerge, Palette: PaletteIcon, Cog, Lightbulb,
  Network, Puzzle, ShieldCheck, LineChart, Bot: BotIcon, Cpu, Package,
  Atom, Accessibility, Anchor, AppWindow, Archive, Asterisk, Award, Axe,
  Baby, BadgeAlert, BadgeCheck, BadgeDollarSign, BadgeHelp, BadgeInfo, BadgePercent,
  BaggageClaim, Banana, Banknote, BarChart2, BarChart3, BarChart4, BarChartBig,
  Baseline, Bath, Beaker, Bean, BedDouble, BedSingle, Beef, Beer, Bell,
  Bike, Binary, Bitcoin, Blend, Bold, Bomb, Bone, Book, Bookmark, BotIcon, Box, Braces, Brackets,
  BrainCircuit, BrickWall, BriefcaseBusiness, Bug, Building, Bus, Cable, Cake, Calculator, Calendar, Camera,
  CandlestickChart, Car, Carrot, CaseLower, CaseSensitive, CaseUpper, CassetteTape, Castle, Cat, CheckCheck,
  ChefHat, Cherry, ChevronDownSquare, ChevronUpSquare, Church, CircleDollarSign, Citrus, Clapperboard,
  Clipboard, Clock, CloudCog, CloudDrizzle, CloudFog, CloudHail, CloudLightning, CloudMoon, CloudRain,
  CloudSnow, CloudSun, Cloudy, Clover, CodeSquare, Codepen, Coins, Columns, Command, Compass, Component,
  ConciergeBell, Construction, Contact2, Container, Cookie, Copy, Copyright, CornerDownLeft, CornerDownRight,
  Crown, CupSoda, Currency, PilcrowSquare, Diamond, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices, Diff, Disc,
  Dna, Dog, DollarSign, Donut, DoorClosed, DoorOpen, DownloadCloud, DraftingCompass, Drama, Dribbble, Droplet,
  Drumstick, Dumbbell, Ear, Eclipse, Edit, Egg, Equal, Euro, Expand, ExternalLink, Eye,
  Facebook, Factory, Fan, Feather, FerrisWheel, Figma, FileArchive, FileAudio, FileBadge, FileBarChart,
  FileCheck, FileCode, FileCog, FileDiff, FileDigit, FileDown, FileEdit, FileHeart, FileImage, FileInput,
  FileJson, FileKey, FileLock, FileMinus, FileOutput, FilePlus, FileQuestion, FileScan, FileSearch, FileSpreadsheet,
  FileSymlink, FileTerminal, FileText, FileType, FileUp, FileVideo, FileVolume, FileWarning, FileX, Files,
  Film, Filter, Fingerprint, Flag, Flame, FlaskConical, FlaskRound, FlipHorizontal, FlipVertical, Flower,
  Folder, FolderArchive, FolderCheck, FolderClock, FolderClosed, FolderCog, FolderDot, FolderDown, FolderEdit,
  FolderGit, FolderGit2, FolderHeart, FolderInput, FolderKanban, FolderKey, FolderLock, FolderMinus, FolderOpen,
  FolderOutput, FolderPlus, FolderRoot, FolderSearch, FolderSymlink, FolderTree, FolderUp, FolderX, Folders,
  Footprints, Forklift, Forward, Frame, Frown, Fuel, FunctionSquare, Gamepad, Gamepad2, Gauge, Gavel, Gem,
  Ghost, Gift, GitBranch, GitBranchPlus, GitCommit, GitCompare, GitFork, GitGraph, GitPullRequest, GitPullRequestClosed,
  GitPullRequestDraft, Github, Gitlab, GlassWater, Globe, Goal, Grab, GraduationCap, Grape, Grid, Grip,
  Hammer, Hand, HandCoins, HandHeart, HandHelping, HandMetal, HandPlatter, HardDrive, HardHat, Hash, Haze,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Headphones, Heart, Heater, Hexagon, Highlighter,
  History, Hop, Hourglass, ImageIcon, Import, Indent, IndianRupee, InfinityIcon, Info, Italic, IterationCcw,
  IterationCw, JapaneseYen, Joystick, Kanban, Key, Keyboard, Lamp, Landmark, Languages, Laugh, Layout,
  LayoutDashboardIcon, LayoutGrid, LayoutList, LayoutTemplate, Leaf, Library, LifeBuoy, Link,
  List, ListChecks, ListEnd, ListFilter, ListMinus, ListMusic, ListOrdered, ListPlus, ListRestart, ListTodo,
  ListTree, ListVideo, ListX, Loader, Lock, LogIn, LogOut, Lollipop, Luggage, Map, MapPin, Martini, Maximize,
  Medal, Megaphone, Menu, Merge, Milestone, Milk, Minus, Monitor, Moon, MoreHorizontal, Mountain, Mouse,
  MousePointer, Move, Music, Navigation, Newspaper, Nut, Orbit, PackageCheck, PackageMinus, PackageOpen,
  PackagePlus, PackageSearch, PackageX, PaintBucket, Paintbrush, PaletteIcon, Palmtree, PanelBottom,
  PanelLeft, Paperclip, ParkingCircle, PartyPopper, Pause, PawPrint, PcCase, Pen, Pencil, Percent, PersonStanding,
  Phone, PieChart, Pin, Pipette, Pizza, Plane, Plug, Plus, Pointer, PoundSterling, Power, Presentation, Printer,
  Projector, Proportions, Pyramid, QrCode, Quote, Rabbit, Radar, Radiation, Radio, Rat, Ratio, Receipt,
  RectangleHorizontal, RectangleVertical, Recycle, Redo, Regex, Repeat, Reply, Rocket, Router, Rss, Ruler,
  RussianRuble, Sailboat, Save, Scale, Scan, School, Scissors, ScreenShare, Scroll, Search, Send, SeparatorHorizontal,
  SeparatorVertical, Share, Sheet, Shell, Shield, Ship, Shirt, ShoppingBag, ShoppingCart, Shovel, ShowerHead,
  Shrink, Sigma, Signal, Siren, Slack, Slice, SlidersHorizontal, Smile, Snowflake, Sofa, Soup, Space, Sparkle,
  Speaker, Spline, Split, Sprout, Square, Star, Stethoscope, Sticker, Store, StretchHorizontal, StretchVertical,
  Strikethrough, Subscript, Sun, Superscript, SwatchBook, SwissFranc, SwitchCamera, Sword, Swords, Syringe,
  Table, Tablet, Tag, Target, Tent, TestTube, Text, TextCursor, TextQuote, Ticket, Timer, Trello, TrendingDown,
  TrendingUp, Triangle, Trophy, Truck, Tv, Twitch, Underline, Undo, UnfoldHorizontal, UnfoldVertical, Unlink,
  Unplug, Upload, Usb, User, Users, Utensils, UtilityPole, Variable, Vault, VenetianMask, Vibrate, Video, View,
  Voicemail, Volume, Vote, Wallet, Wand, Warehouse, Watch, Waves, Webcam, Webhook, Weight, Wheat, Wifi, Wind,
  Wine, Workflow, Wrench, Youtube, ZapIcon, ZoomIn, ZoomOut,
  LayersIcon, 
  ArrowRightLeftIcon,
  FigmaIcon: Figma, 
  BlenderIcon: Blend,
};

export let commonSkillNames: string[] = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Ruby", "Swift", "Kotlin", "PHP", "C++", "C", "Rust", "Scala", "Perl", "Lua", "Haskell", "Elixir", "Objective-C", "Solidity", "R", "Dart", "Groovy", "MATLAB",
  // Frontend Frameworks/Libraries
  "React", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Svelte", "Ember.js", "Backbone.js", "jQuery", "Gatsby", "SolidJS", "Preact", "Remix",
  // Backend Frameworks/Libraries
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", ".NET Core", "Ruby on Rails", "Laravel", "Phoenix", "FastAPI", "Koa", "NestJS",
  // Styling & UI
  "HTML5", "CSS3", "SCSS/SASS", "Tailwind CSS", "Bootstrap", "Material UI (MUI)", "Ant Design", "Chakra UI", "ShadCN UI", "Styled Components", "Emotion", "Bulma", "Foundation",
  // Databases
  "SQL", "NoSQL", "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Elasticsearch", "Firebase Firestore", "Microsoft SQL Server", "Oracle Database", "Cassandra", "Neo4j", "InfluxDB", "DynamoDB",
  // Cloud Platforms & Services
  "AWS (Amazon Web Services)", "Azure (Microsoft Azure)", "GCP (Google Cloud Platform)", "DigitalOcean", "Heroku", "Vercel", "Netlify", "Firebase", "AWS Lambda", "Azure Functions", "Google Cloud Functions", "AWS S3", "AWS EC2", "AWS RDS",
  // DevOps & CI/CD
  "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI", "Argo CD", "Spinnaker", "Prometheus", "Grafana", "Datadog", "Sentry", "ELK Stack (Elasticsearch, Logstash, Kibana)", "Splunk",
  // Version Control & Collaboration
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Slack", "Microsoft Teams", "Asana", "Trello",
  // Tools & Utilities
  "VS Code", "IntelliJ IDEA", "WebStorm", "Eclipse", "Vim", "Emacs", "Figma", "Adobe XD", "Sketch", "InVision", "Zeplin", "Postman", "Insomnia", "Swagger / OpenAPI", "Webpack", "Parcel", "Rollup", "Babel", "ESLint", "Prettier", "Storybook", "Chrome DevTools", "Wireshark",
  // Methodologies & Concepts
  "Agile", "Scrum", "Kanban", "CI/CD", "REST APIs", "GraphQL", "Microservices", "Serverless Architecture", "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)", "Domain-Driven Design (DDD)", "Object-Oriented Programming (OOP)", "Functional Programming", "Responsive Web Design", "Progressive Web Apps (PWAs)", "Web Accessibility (WCAG)", "SEO Best Practices", "Design Patterns", "Data Structures & Algorithms", "System Design", "API Design", "User Experience (UX) Design", "User Interface (UI) Design",
  // Testing
  "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Puppeteer", "Playwright", "JUnit", "NUnit", "PyTest", "RSpec",
  // Mobile Development
  "Android (Java/Kotlin)", "iOS (Swift/Objective-C)", "React Native", "Flutter", "Xamarin", "NativeScript", "Ionic",
  // AI/ML & Data Science
  "Python (for AI/ML)", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter Notebooks", "Apache Spark", "Hadoop", "Natural Language Processing (NLP)", "Computer Vision", "Machine Learning Operations (MLOps)",
  // Game Development
  "Unity", "Unreal Engine", "Godot Engine", "C# (for Unity)", "C++ (for Unreal)", "Blender", "Maya",
  // WebAssembly
  "WebAssembly (Wasm)", "Rust (for Wasm)", "AssemblyScript",
  // Blockchain
  "Solidity", "Ethereum", "Web3.js", "Ethers.js", "Hardhat", "Truffle",
  // Other Specific Technologies
  "WordPress", "Drupal", "Shopify", "Magento", "Salesforce Development (Apex, LWC)", "SAP (ABAP, Fiori)", "Oracle PL/SQL", "PowerShell", "Bash Scripting", "Nginx", "Apache HTTP Server", "GraphQL Apollo", "Redux", "Vuex", "MobX", "Zustand", "Jotai", "RxJS", "Auth0", "Okta", "JWT", "OAuth", "WebSockets", "gRPC", "WebRTC", "D3.js", "Three.js", "Electron.js", "Kafka", "RabbitMQ", "Elastic Stack", "Splunk", "npm" // Added npm
];

commonSkillNames = [...new Set(commonSkillNames)].sort((a, b) => a.localeCompare(b));

const ensureIcon = (name: string, iconComponent: React.ElementType) => {
  if (!lucideIconsMap[name]) {
    lucideIconsMap[name] = iconComponent;
  }
};

commonSkillNames.forEach(skillName => {
  const lowerSkillName = skillName.toLowerCase();
  if (lowerSkillName.includes('python')) ensureIcon(skillName, Code);
  else if (lowerSkillName.includes('java') && !lowerSkillName.includes('javascript')) ensureIcon(skillName, CupSoda);
  else if (lowerSkillName.includes('react') || lowerSkillName.includes('next.js')) ensureIcon(skillName, Laptop);
  else if (lowerSkillName.includes('node.js') || lowerSkillName.includes('express.js')) ensureIcon(skillName, Server);
  else if (lowerSkillName.includes('figma')) ensureIcon(skillName, Figma);
  else if (lowerSkillName.includes('aws') || lowerSkillName.includes('azure') || lowerSkillName.includes('gcp') || lowerSkillName.includes('cloud')) ensureIcon(skillName, Cloud);
  else if (lowerSkillName.includes('docker')) ensureIcon(skillName, Container);
  else if (lowerSkillName.includes('kubernetes')) ensureIcon(skillName, Orbit);
  else if (lowerSkillName.includes('git')) ensureIcon(skillName, GitMerge);
  else if (lowerSkillName.includes('sql') || lowerSkillName.includes('database')) ensureIcon(skillName, Database);
  else if (lowerSkillName.includes('c#') || lowerSkillName.includes('c++')) ensureIcon(skillName, Code);
  else if (lowerSkillName.includes('swift') || lowerSkillName.includes('kotlin') || lowerSkillName.includes('android') || lowerSkillName.includes('ios')) ensureIcon(skillName, Smartphone);
  else if (lowerSkillName.includes('ruby')) ensureIcon(skillName, Gem);
  else if (lowerSkillName.includes('php')) ensureIcon(skillName, Code);
  else if (lowerSkillName.includes('rust')) ensureIcon(skillName, ShieldCheck);
  else if (lowerSkillName.includes('ai') || lowerSkillName.includes('machine learning') || lowerSkillName.includes('tensorflow') || lowerSkillName.includes('pytorch')) ensureIcon(skillName, Brain);
  else if (lowerSkillName.includes('unity') || lowerSkillName.includes('unreal')) ensureIcon(skillName, Puzzle);
  else if (lowerSkillName.includes('blender')) ensureIcon(skillName, Blend); // Changed to use Blend icon for Blender
  else if (lowerSkillName === 'npm') ensureIcon(skillName, Package); 
  else ensureIcon(skillName, Package);
});

export const availableIconNames = Object.keys(lucideIconsMap);

    
