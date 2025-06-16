
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aboutMe } from '@/lib/data';
import { Briefcase, GraduationCap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fadeInUp-1">
      <PageHeader 
        title="About Me" 
        subtitle={`Get to know the person behind the code: ${aboutMe.name.split(' ')[0]}.`}
      />

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 flex flex-col items-center">
          <Image
            src={aboutMe.profileImage}
            alt={`Profile picture of ${aboutMe.name}`}
            width={280}
            height={280}
            className="rounded-full shadow-2xl object-cover mb-8 aspect-square"
            data-ai-hint={aboutMe.dataAiHint}
          />
          <h2 className="font-headline text-3xl font-semibold text-primary text-center">{aboutMe.name}</h2>
          <p className="text-muted-foreground text-center mt-1">{aboutMe.title}</p>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">My Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-foreground/80 leading-relaxed">
              {aboutMe.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-16 md:mt-24">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Experience & Education</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Experience Section */}
          <div>
            <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
              <Briefcase className="mr-3 h-7 w-7 text-primary" /> Professional Journey
            </h3>
            <div className="space-y-6">
              {aboutMe.experience.map((exp) => (
                <Card key={exp.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">{exp.role}</CardTitle>
                    <p className="text-sm text-muted-foreground">{exp.company} | {exp.period}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
              <GraduationCap className="mr-3 h-7 w-7 text-primary" /> Academic Background
            </h3>
            <div className="space-y-6">
              {aboutMe.education.map((edu) => (
                <Card key={edu.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">{edu.degree}</CardTitle>
                    <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
