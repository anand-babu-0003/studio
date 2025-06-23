
"use client"; 

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { lucideIconsMap, skillCategories as SKILL_CATEGORIES_STATIC, defaultSkillsDataForClient } from '@/lib/data';
import type { Skill } from '@/lib/types';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FullScreenLoader from '@/components/shared/FullScreenLoader';

interface SkillsPageClientContentProps {
  initialSkills: Skill[];
  fetchError?: string | null; 
}

export default function SkillsPageClientContent({ initialSkills, fetchError }: SkillsPageClientContentProps) {
  // initialSkills comes from server component, so no initial client-side loading state for that data.
  const [skillsData, setSkillsData] = useState<Skill[]>(initialSkills);
  const [isLoading, setIsLoading] = useState(false); // For any potential client-side updates, not initial load
  const [error, setError] = useState<string | null>(fetchError || null);

  // Update skillsData if initialSkills prop changes (e.g., after a revalidation from server)
  useEffect(() => {
    setSkillsData(initialSkills);
    setError(fetchError || null);
  }, [initialSkills, fetchError]);


  // If an error occurred during server fetch and we have no skills to show (even defaults from server were problematic)
  if (error && (!skillsData || skillsData.length === 0)) {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
            <PageHeader title="Error" subtitle={error} />
        </div>
    );
  }

  // If initialSkills from server is empty AND there was no explicit fetchError, means no skills are configured.
  // The main skillsData will be defaultSkillsDataForClient if the server fetch was truly empty.
  const displaySkills = skillsData && skillsData.length > 0 ? skillsData : defaultSkillsDataForClient;


  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader
          title="My Skills & Expertise"
          subtitle="A curated showcase of the technologies, tools, and methodologies I leverage to build impactful solutions."
        />
      </ScrollAnimationWrapper>

      <div className="space-y-12">
        {SKILL_CATEGORIES_STATIC.map((category, categoryIndex) => {
          const categorySkills = displaySkills.filter((skill) => skill.category === category);
          
          if (categorySkills.length === 0) {
             return null; 
          }

          return (
            <ScrollAnimationWrapper key={category} delay={categoryIndex * 100}>
              <Card className="shadow-xl overflow-hidden rounded-xl">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="font-headline text-2xl md:text-3xl text-center text-primary py-2">
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map((skill: Skill, skillIndex: number) => {
                      const IconComponent = lucideIconsMap[skill.iconName] || Package;
                      return (
                        <ScrollAnimationWrapper key={skill.id || `skill-${category}-${skillIndex}-${Date.now()}`} delay={skillIndex * 50} threshold={0.05}>
                          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] h-full flex flex-col rounded-lg overflow-hidden border border-border/70">
                            <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                              <IconComponent className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
                              <h3 className="text-xl font-semibold font-headline text-primary/95 mb-3">{skill.name}</h3>

                              <div className="w-full mt-auto pt-3">
                                {skill.proficiency !== undefined && skill.proficiency !== null ? (
                                  <>
                                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-1 px-1">
                                      <span>Proficiency</span>
                                      <span>{skill.proficiency}%</span>
                                    </div>
                                    <Progress
                                      value={skill.proficiency}
                                      aria-label={`${skill.name} proficiency ${skill.proficiency}%`}
                                      className="h-2 rounded-full"
                                    />
                                  </>
                                ) : (
                                  <div className="text-center pt-2">
                                    <Badge variant="outline" className="font-normal text-xs px-2 py-0.5 border-primary/30 text-primary/80">Experienced</Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </ScrollAnimationWrapper>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          );
        })}
        {displaySkills.length === 0 && !isLoading && !error && (
            <ScrollAnimationWrapper className="text-center">
                <p className="text-muted-foreground text-lg">
                My skills are currently being polished! Please check back soon for a full list.
                </p>
            </ScrollAnimationWrapper>
        )}
      </div>
    </div>
  );
}
