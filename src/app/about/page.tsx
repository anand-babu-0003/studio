
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, GraduationCap } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { AboutMeData, AppData } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

async function getFreshAboutMeData(): Promise<AboutMeData> {
  const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const appData = JSON.parse(fileContent) as AppData;
    return appData.aboutMe;
  } catch (error) {
    console.error("Error reading data.json for About page, returning default structure:", error);
    return { 
      name: 'Default Name', 
      title: 'Default Title', 
      bio: 'Default bio.', 
      profileImage: 'https://placehold.co/400x400.png', 
      dataAiHint: 'placeholder image',
      experience: [], 
      education: [] 
    };
  }
}

export default async function AboutPage() {
  const aboutMeData = await getFreshAboutMeData();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader 
          title="About Me" 
          subtitle={`Get to know the person behind the code: ${aboutMeData.name.split(' ')[0]}.`}
        />
      </ScrollAnimationWrapper>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <ScrollAnimationWrapper className="lg:col-span-1 flex flex-col items-center" delay={100}>
          <Image
            src={aboutMeData.profileImage || 'https://placehold.co/280x280.png'}
            alt={`Profile picture of ${aboutMeData.name}`}
            width={280}
            height={280}
            className="rounded-full shadow-2xl object-cover mb-8 aspect-square"
            data-ai-hint={aboutMeData.dataAiHint}
          />
          <h2 className="font-headline text-3xl font-semibold text-primary text-center">{aboutMeData.name}</h2>
          <p className="text-muted-foreground text-center mt-1">{aboutMeData.title}</p>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper className="lg:col-span-2" delay={200}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">My Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-foreground/80 leading-relaxed">
              {(aboutMeData.bio || '').split('\n\n').map((paragraph, index) => (
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
                {aboutMeData.experience.map((exp, index) => (
                  <ScrollAnimationWrapper key={exp.id} delay={index * 100}>
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
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
                <GraduationCap className="mr-3 h-7 w-7 text-primary" /> Academic Background
              </h3>
              <div className="space-y-6">
                {aboutMeData.education.map((edu, index) => (
                  <ScrollAnimationWrapper key={edu.id} delay={index * 100}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="font-headline text-xl text-primary">{edu.degree}</CardTitle>
                        <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                      </CardHeader>
                    </Card>
                  </ScrollAnimationWrapper>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>
    </div>
  );
}
