
"use client"; // Needs to be client for useState and useEffect for loading state

import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { AboutMeData, Experience, Education } from '@/lib/types';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { defaultAboutMeDataForClient } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [aboutMeData, setAboutMeData] = useState<AboutMeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      setIsLoading(true);
      try {
        const data = await getAboutMeDataAction();
        setAboutMeData(data || defaultAboutMeDataForClient);
      } catch (error) {
        console.error("Error fetching About Me data for page:", error);
        setAboutMeData(defaultAboutMeDataForClient); // Fallback to default on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchPageData();
  }, []);

  if (isLoading || !aboutMeData) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const displayedData = aboutMeData; // Already has fallbacks from action/state

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader 
          title="About Me" 
          subtitle={`Get to know the person behind the code: ${(displayedData.name || 'User').split(' ')[0]}.`}
        />
      </ScrollAnimationWrapper>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <ScrollAnimationWrapper className="lg:col-span-1 flex flex-col items-center" delay={100}>
          <Image
            src={displayedData.profileImage || defaultAboutMeDataForClient.profileImage}
            alt={`Profile picture of ${displayedData.name || 'User'}`}
            width={350}
            height={350}
            className="rounded-full shadow-2xl object-cover mb-8 aspect-square"
            data-ai-hint={displayedData.dataAiHint || defaultAboutMeDataForClient.dataAiHint}
            priority
          />
          <h2 className="font-headline text-3xl font-semibold text-primary text-center">{displayedData.name || 'User Name'}</h2>
          <p className="text-muted-foreground text-center mt-1">{displayedData.title || 'User Title'}</p>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper className="lg:col-span-2" delay={200}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">My Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-foreground/80 leading-relaxed">
              {(displayedData.bio || 'Detailed biography coming soon...').split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        </ScrollAnimationWrapper>
      </div>

      <ScrollAnimationWrapper className="mt-16 md:mt-24" delay={300}>
        <section>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Experience & Education</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Experience Section */}
            <div>
              <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
                <Briefcase className="mr-3 h-7 w-7 text-primary" /> Professional Journey
              </h3>
              <div className="space-y-6">
                {(displayedData.experience || []).length > 0 ? (
                  (displayedData.experience || []).map((exp: Experience, index: number) => (
                    <ScrollAnimationWrapper key={exp.id || `exp-${index}`} delay={index * 100}>
                      <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">{exp.role}</CardTitle>
                          <p className="text-sm text-muted-foreground">{exp.company} | {exp.period}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground/80">{exp.description}</p>
                        </CardContent>
                      </Card>
                    </ScrollAnimationWrapper>
                  ))
                ) : (
                    <p className="text-muted-foreground">No professional experience listed yet. Updates are on the way!</p>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
                <GraduationCap className="mr-3 h-7 w-7 text-primary" /> Academic Background
              </h3>
              <div className="space-y-6">
                {(displayedData.education || []).length > 0 ? (
                  (displayedData.education || []).map((edu: Education, index: number) => (
                    <ScrollAnimationWrapper key={edu.id || `edu-${index}`} delay={index * 100}>
                      <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">{edu.degree}</CardTitle>
                          <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                        </CardHeader>
                      </Card>
                    </ScrollAnimationWrapper>
                  ))
                ) : (
                  <p className="text-muted-foreground">No academic background listed yet. Details coming soon!</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>
    </div>
  );
}
