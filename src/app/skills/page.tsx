import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { skills, skillCategories } from '@/lib/data';
import type { Skill } from '@/lib/types';

export default function SkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader 
        title="My Skills" 
        subtitle="A showcase of my technical expertise and the tools I love to work with."
      />

      <div className="space-y-12">
        {skillCategories.map((category) => {
          const categorySkills = skills.filter((skill) => skill.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="font-headline text-2xl md:text-3xl font-semibold text-primary mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categorySkills.map((skill: Skill) => (
                  <Card key={skill.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium font-headline text-primary/90">
                        {skill.name}
                      </CardTitle>
                      <skill.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </CardHeader>
                    <CardContent>
                      {skill.proficiency && (
                        <div className="text-xs text-muted-foreground mb-1">
                          Proficiency: {skill.proficiency}%
                        </div>
                      )}
                      {skill.proficiency ? (
                        <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency ${skill.proficiency}%`} className="h-2" />
                      ) : (
                        <p className="text-sm text-muted-foreground">Experienced</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
