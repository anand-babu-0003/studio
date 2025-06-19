
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { lucideIconsMap, skillCategories as SKILL_CATEGORIES_STATIC } from '@/lib/data'; // Use static categories from data
import type { Skill } from '@/lib/types'; // Type import is fine
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import { Package } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge';
import { getSkillsAction } from '@/actions/admin/skillsActions';

const defaultSkillsData: Skill[] = [];

async function getPageData(): Promise<Skill[]> {
  try {
    const skills = await getSkillsAction();
    return skills || defaultSkillsData; // Use default if action returns null/undefined
  } catch (error) {
    console.error("Error fetching skills data for page:", error);
    return defaultSkillsData; // Fallback to default on error
  }
}

export default async function SkillsPage() { 
  const skillsData = await getPageData();

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
          const categorySkills = (skillsData || []).filter((skill) => skill.category === category);
          
          // Only render the category card if there are skills in it
          if (categorySkills.length === 0 && skillsData.length > 0) { // If all skills loaded but none for this category
             return null; // Skip rendering this category card
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
                  {categorySkills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorySkills.map((skill: Skill, skillIndex: number) => {
                        const IconComponent = lucideIconsMap[skill.iconName] || Package;
                        return (
                          <ScrollAnimationWrapper key={skill.id} delay={skillIndex * 50} threshold={0.05}>
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
                  ) : (
                    <p className="text-center text-muted-foreground">
                      {skillsData.length === 0 ? "Loading skills or no skills to display yet. Please check back!" : `No skills listed under ${category} yet.`}
                    </p>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          );
        })}
        {skillsData.length === 0 && (
            <ScrollAnimationWrapper className="text-center">
                <p className="text-muted-foreground text-lg">
                Skills are being updated. Please check back soon to see my expertise!
                </p>
            </ScrollAnimationWrapper>
        )}
      </div>
    </div>
  );
}
