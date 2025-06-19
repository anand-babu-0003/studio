
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Package } from 'lucide-react';
import type { PortfolioItem, AboutMeData, Skill } from '@/lib/types';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import { lucideIconsMap, defaultAboutMeDataForClient, defaultPortfolioItemsDataForClient, defaultSkillsDataForClient } from '@/lib/data';
import StarryBackground from '@/components/layout/starry-background';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import FullScreenLoader from '@/components/shared/FullScreenLoader';

import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';
import { getSkillsAction } from '@/actions/admin/skillsActions';

export default function Home() {
  const [aboutMeData, setAboutMeData] = useState<AboutMeData | null>(null);
  const [allPortfolioItems, setAllPortfolioItems] = useState<PortfolioItem[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPageData() {
      setIsLoading(true);
      try {
        const [fetchedAboutMe, fetchedPortfolioItems, fetchedSkills] = await Promise.all([
          getAboutMeDataAction(),
          getPortfolioItemsAction(),
          getSkillsAction()
        ]);
        setAboutMeData(fetchedAboutMe || defaultAboutMeDataForClient);
        setAllPortfolioItems(fetchedPortfolioItems || []); 
        setAllSkills(fetchedSkills || []); 
      } catch (error) {
        console.error("Error fetching data for Home page:", error);
        setAboutMeData(defaultAboutMeDataForClient); 
        setAllPortfolioItems(defaultPortfolioItemsDataForClient.slice(0,2)); 
        setAllSkills(defaultSkillsDataForClient.slice(0,6)); 
      } finally {
        setIsLoading(false);
      }
    }
    loadPageData();
  }, []);
  
  const displayedAboutMe = aboutMeData || defaultAboutMeDataForClient;
  const featuredProjects = allPortfolioItems.slice(0, 2);
  const highlightedSkills = allSkills.slice(0, 6);
  const firstParagraphBio = (displayedAboutMe.bio || '').split('\n\n')[0] || defaultAboutMeDataForClient.bio.split('\n\n')[0];


  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex flex-col">
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 md:py-32 bg-gradient-to-br from-primary/15 via-background to-accent/15 bg-animated-gradient overflow-hidden">
        <StarryBackground />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center flex-grow">
          <div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              <span className="block animate-fadeInUp-1">Hi, I&apos;m <span className="text-foreground">{(displayedAboutMe.name || 'User').split(' ')[0]}</span></span>
              <span className="block text-primary animate-fadeInUp-2">{displayedAboutMe.title || 'My Awesome Title'}</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-fadeInUp-2" style={{ animationDelay: '0.5s' }}>
              {(displayedAboutMe.bio || defaultAboutMeDataForClient.bio).substring(0, 150)}...
            </p>
            <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 animate-fadeInUp-2" style={{ animationDelay: '0.7s' }}>
              <Button
                asChild
                className="bg-[hsl(260,55%,78%)] text-[hsl(260,25%,30%)] hover:bg-[hsl(260,55%,72%)] dark:bg-[hsl(260,55%,78%)] dark:text-[hsl(260,25%,30%)] dark:hover:bg-[hsl(260,55%,72%)] font-semibold shadow-lg transition-all duration-300 rounded-md text-base leading-snug px-6 py-3"
              >
                <Link href="/portfolio">
                  <span className="inline-flex items-center">
                    View My Work
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                className="bg-[hsl(260,55%,78%)] text-[hsl(260,25%,30%)] hover:bg-[hsl(260,55%,72%)] dark:bg-[hsl(260,55%,78%)] dark:text-[hsl(260,25%,30%)] dark:hover:bg-[hsl(260,55%,72%)] font-semibold shadow-lg transition-all duration-300 rounded-md text-base leading-snug px-6 py-3"
              >
                <Link href="/contact">
                  <span className="inline-flex items-center">
                    Get in Touch
                    <Mail className="h-5 w-5 ml-2" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ScrollAnimationWrapper className="w-full py-16 md:py-24">
        <section>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2 flex justify-center">
                <Image
                  src={displayedAboutMe.profileImage || defaultAboutMeDataForClient.profileImage}
                  alt={`Profile picture of ${(displayedAboutMe.name || defaultAboutMeDataForClient.name).split(' ')[0]}`}
                  width={320}
                  height={320}
                  className="rounded-full shadow-2xl object-cover aspect-square"
                  data-ai-hint={displayedAboutMe.dataAiHint || defaultAboutMeDataForClient.dataAiHint}
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

      <ScrollAnimationWrapper className="w-full py-16 md:py-24 bg-primary/5">
        <section>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              Featured Projects
            </h2>
            {featuredProjects.length > 0 ? (
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.map((project: PortfolioItem, index: number) => (
                  <ScrollAnimationWrapper key={project.id || `featured-${index}`} delay={index * 150}>
                    <PortfolioCard project={project} />
                  </ScrollAnimationWrapper>
                ))}
              </div>
            ) : (
              <ScrollAnimationWrapper className="text-center">
                <p className="text-muted-foreground">No featured projects to display at the moment. Check back soon!</p>
              </ScrollAnimationWrapper>
            )}
            {(allPortfolioItems.length > featuredProjects.length || allPortfolioItems.length === 0 && featuredProjects.length === 0) && (
                <ScrollAnimationWrapper className="mt-12 text-center" delay={(featuredProjects.length || 0) * 150}>
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

      <ScrollAnimationWrapper className="w-full py-16 md:py-24">
        <section>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimationWrapper>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
                My Core Skills
              </h2>
            </ScrollAnimationWrapper>

            {highlightedSkills.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                {highlightedSkills.map((skill, index) => {
                  const IconComponent = lucideIconsMap[skill.iconName] || Package;
                  return (
                    <ScrollAnimationWrapper key={skill.id || `skill-${index}`} delay={index * 100} threshold={0.05}>
                      <div className="flex flex-col items-center text-center p-4 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] bg-card h-full">
                        <IconComponent className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3" />
                        <h3 className="text-sm md:text-base font-semibold text-card-foreground">{skill.name}</h3>
                      </div>
                    </ScrollAnimationWrapper>
                  );
                })}
              </div>
            ) : (
               <ScrollAnimationWrapper className="text-center">
                <p className="text-muted-foreground mb-8">Skills section is currently being updated. Check back soon!</p>
               </ScrollAnimationWrapper>
            )}
            
            {(allSkills.length > highlightedSkills.length || allSkills.length === 0 && highlightedSkills.length === 0) && (
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
    </div>
  );
}

