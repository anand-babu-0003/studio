
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Eye, Code2, Package, HelpCircle } from 'lucide-react'; 
import type { PortfolioItem, AboutMeData, AppData, Skill } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import fs from 'fs/promises';
import path from 'path';
import { lucideIconsMap } from '@/lib/data';
import StarryBackground from '@/components/layout/starry-background';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';

const defaultAppData: AppData = {
  portfolioItems: [],
  skills: [],
  aboutMe: {
    name: 'B.Anand',
    title: 'Welcome to my universe',
    bio: 'Default bio.',
    profileImage: 'https://placehold.co/320x320.png',
    dataAiHint: 'placeholder image',
    experience: [],
    education: [],
    email: 'default@example.com',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
  },
  siteSettings: {
    siteName: 'AnandVerse',
    defaultMetaDescription: 'A showcase of my projects and skills.',
    defaultMetaKeywords: 'webdeveloper,portfolio',
    siteOgImageUrl: 'https://github.com/anand-babu-0003/TrueValidator2/blob/main/Screenshot%202025-06-17%20154532.png?raw=true',
  },
};

async function getFreshAppData(): Promise<AppData> {
  const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent.trim()) {
        console.warn("Data file is empty for Home page, returning default structure.");
        return defaultAppData;
    }
    const parsedData = JSON.parse(fileContent) as Partial<AppData>;

    const portfolioItems = Array.isArray(parsedData.portfolioItems) ? parsedData.portfolioItems : defaultAppData.portfolioItems;
    const skills = Array.isArray(parsedData.skills) ? parsedData.skills : defaultAppData.skills;

    const validAboutMe = (typeof parsedData.aboutMe === 'object' && parsedData.aboutMe !== null)
                         ? parsedData.aboutMe
                         : {};
    const aboutMe = { ...defaultAppData.aboutMe, ...validAboutMe };

    const validSiteSettings = (typeof parsedData.siteSettings === 'object' && parsedData.siteSettings !== null)
                              ? parsedData.siteSettings
                              : {};
    const siteSettings = { ...defaultAppData.siteSettings, ...validSiteSettings };

    return {
      portfolioItems,
      skills,
      aboutMe,
      siteSettings,
    };

  } catch (error) {
    console.error("Error reading or parsing data.json for Home page, returning default structure:", error);
    return defaultAppData;
  }
}

export default async function Home() {
  const appData = await getFreshAppData();
  const aboutMeData = appData.aboutMe;
  const allPortfolioItems = appData.portfolioItems;
  const featuredProjects = allPortfolioItems.slice(0, 2);
  const highlightedSkills = appData.skills.slice(0, 6);

  const firstParagraphBio = (aboutMeData.bio || '').split('\n\n')[0];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 md:py-32 bg-gradient-to-br from-primary/15 via-background to-accent/15 bg-animated-gradient overflow-hidden">
        <StarryBackground />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center flex-grow">
          <div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              <span className="block animate-fadeInUp-1">Hi, I&apos;m <span className="text-foreground">{aboutMeData.name.split(' ')[0]}</span></span>
              <span className="block text-primary animate-fadeInUp-2">{aboutMeData.title}</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-fadeInUp-2" style={{ animationDelay: '0.5s' }}>
              {(aboutMeData.bio || '').substring(0, 150)}...
            </p>
            <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 animate-fadeInUp-2" style={{ animationDelay: '0.7s' }}>
              <Button
                asChild
                className="
                  bg-[hsl(260,55%,78%)] text-[hsl(260,25%,30%)] hover:bg-[hsl(260,55%,72%)]
                  dark:bg-[hsl(260,55%,78%)] dark:text-[hsl(260,25%,30%)] dark:hover:bg-[hsl(260,55%,72%)]
                  font-semibold shadow-lg transition-all duration-300 rounded-md text-base leading-snug px-6 py-3
                "
              >
                <Link href="/portfolio">
                  <span className="inline-flex items-center">
                    View My Work
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </span>
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="shadow-lg hover:shadow-secondary/30 transition-shadow duration-300">
                <Link href="/contact">
                  <span>Get in Touch</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Snippet */}
      <ScrollAnimationWrapper className="w-full py-16 md:py-24">
        <section>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2 flex justify-center">
                <Image
                  src={aboutMeData.profileImage || 'https://placehold.co/320x320.png'}
                  alt={`Profile picture of ${aboutMeData.name.split(' ')[0]}`}
                  width={320}
                  height={320}
                  className="rounded-full shadow-2xl object-cover aspect-square"
                  data-ai-hint={aboutMeData.dataAiHint}
                  priority
                />
              </div>
              <div className="md:order-1">
                <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary/90 mb-6">A Glimpse Into My Story</h3>
                <p className="text-muted-foreground text-lg mb-6">
                  {firstParagraphBio}
                </p>
                <Button asChild variant="link" className="text-primary p-0 text-lg hover:text-accent">
                  <Link href="/about">
                    <span>
                      Read More About Me <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* Featured Projects Section */}
      <ScrollAnimationWrapper className="w-full py-16 md:py-24 bg-primary/5">
        <section>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project: PortfolioItem, index: number) => (
                <ScrollAnimationWrapper key={project.id} delay={index * 150}>
                  <PortfolioCard project={project} />
                </ScrollAnimationWrapper>
              ))}
            </div>
            {allPortfolioItems.length > featuredProjects.length && (
                <ScrollAnimationWrapper className="mt-12 text-center" delay={featuredProjects.length * 150}>
                <Button asChild size="lg" variant="outline" className="text-lg">
                    <Link href="/portfolio">
                      <span>
                        View All Projects <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    </Link>
                </Button>
                </ScrollAnimationWrapper>
            )}
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* Core Skills Section */}
      {highlightedSkills.length > 0 && (
        <ScrollAnimationWrapper className="w-full py-16 md:py-24">
          <section>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollAnimationWrapper>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
                  My Core Skills
                </h2>
              </ScrollAnimationWrapper>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                {highlightedSkills.map((skill, index) => {
                  const IconComponent = lucideIconsMap[skill.iconName] || Package;
                  return (
                    <ScrollAnimationWrapper key={skill.id} delay={index * 100} threshold={0.05}>
                      <div className="flex flex-col items-center text-center p-4 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] bg-card h-full">
                        <IconComponent className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3" />
                        <h3 className="text-sm md:text-base font-semibold text-card-foreground">{skill.name}</h3>
                      </div>
                    </ScrollAnimationWrapper>
                  );
                })}
              </div>

              {appData.skills.length > highlightedSkills.length && (
                <ScrollAnimationWrapper className="mt-12 text-center" delay={highlightedSkills.length * 100}>
                  <Button asChild size="lg" variant="outline" className="text-lg">
                    <Link href="/skills">
                      <span>
                        Explore All My Skills <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    </Link>
                  </Button>
                </ScrollAnimationWrapper>
              )}
            </div>
          </section>
        </ScrollAnimationWrapper>
      )}
    </div>
  );
}

