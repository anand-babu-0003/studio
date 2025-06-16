
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { skillCategories, lucideIconsMap } from '@/lib/data'; // Static configs are fine
import type { Skill, AppData } from '@/lib/types';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import { Package } from 'lucide-react'; 
// import { cn } from '@/lib/utils'; // cn was unused
import { Badge } from '@/components/ui/badge';
import fs from 'fs/promises';
import path from 'path';

async function getFreshSkillsData(): Promise<Skill[]> {
  const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const appData = JSON.parse(fileContent) as AppData;
    return appData.skills;
  } catch (error) {
    console.error("Error reading data.json for Skills page, returning empty array:", error);
    return [];
  }
}

export default async function SkillsPage() { 
  const skillsData = await getFreshSkillsData();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader 
          title="My Skills & Expertise" 
          subtitle="A curated showcase of the technologies, tools, and methodologies I leverage to build impactful solutions."
        />
      </ScrollAnimationWrapper>

      <div className="space-y-12">
        {skillCategories.map((category, categoryIndex) => {
          const categorySkills = skillsData.filter((skill) => skill.category === category);
          if (categorySkills.length === 0) return null;

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
                        <ScrollAnimationWrapper key={skill.id} delay={skillIndex * 50} threshold={0.05}>
                          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col rounded-lg overflow-hidden border border-border/70">
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
                                    <Badge variant="outline" className="font-normal text-xs px-2 py-0.5 border-primary/30 text-primary/80">Highly Experienced</Badge>
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
      </div>
    </div>
  );
}
