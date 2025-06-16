
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Eye, Code2 } from 'lucide-react';
import type { PortfolioItem, AboutMeData, AppData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import fs from 'fs/promises';
import path from 'path';

async function getFreshAppData(): Promise<AppData> {
  const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent) as AppData;
  } catch (error) {
    console.error("Error reading data.json for Home page, returning default structure:", error);
    return {
      portfolioItems: [],
      skills: [],
      aboutMe: {
        name: 'Default Name',
        title: 'Default Title',
        bio: 'Default bio.',
        profileImage: 'https://placehold.co/400x400.png',
        dataAiHint: 'placeholder image',
        experience: [],
        education: [],
      },
    };
  }
}

export default async function Home() {
  const appData = await getFreshAppData();
  const aboutMeData = appData.aboutMe;
  const allPortfolioItems = appData.portfolioItems;
  const featuredProjects = allPortfolioItems.slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col justify-center items-center py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 bg-animated-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center flex-grow">
          <div> {/* Added a wrapper div for easier centering control of the content block */}
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block animate-fadeInUp-1">Hi, I&apos;m <span className="text-primary">{aboutMeData.name.split(' ')[0]}</span></span>
              <span className="block text-primary/80 animate-fadeInUp-2">{aboutMeData.title}</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-fadeInUp-2" style={{ animationDelay: '0.5s' }}>
              {(aboutMeData.bio || '').substring(0, 150)}... {/* Short intro */}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp-2" style={{ animationDelay: '0.7s' }}>
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow duration-300">
                <Link href="/portfolio">
                  View My Work <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-accent/30 transition-shadow duration-300">
                <Link href="/contact">Get in Touch</Link>
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
              <div className="flex justify-center md:order-2">
                <Image
                  src={aboutMeData.profileImage || 'https://placehold.co/300x300.png'}
                  alt={`Profile picture of ${aboutMeData.name.split(' ')[0]}`}
                  width={300}
                  height={300}
                  className="rounded-full shadow-2xl object-cover aspect-square"
                  data-ai-hint={aboutMeData.dataAiHint}
                />
              </div>
              <div className="md:order-1">
                <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary/90 mb-6">A Glimpse Into My Story</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  {(aboutMeData.bio || '').split('\n\n')[0]} {/* First paragraph */}
                </p>
                <p className="text-muted-foreground text-lg mb-6">
                  {(aboutMeData.bio || '').split('\n\n')[1] || (aboutMeData.bio || '').split('\n')[0]} {/* Second paragraph or fallback */}
                </p>
                <Button asChild variant="link" className="text-primary p-0 text-lg hover:text-accent">
                  <Link href="/about">
                    Read More About Me <ArrowRight className="ml-2 h-5 w-5" />
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
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                    <CardHeader className="p-0">
                      <Image
                        src={project.images[0] || 'https://placehold.co/600x400.png'}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover"
                        data-ai-hint={project.dataAiHint || 'project showcase'}
                      />
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="font-headline text-2xl text-primary mb-2">{project.title}</CardTitle>
                      <div className="mb-3 space-x-2">
                        {project.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                        ))}
                      </div>
                      <CardDescription className="text-muted-foreground line-clamp-3">{project.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 bg-muted/50 flex justify-between items-center">
                      <div className="flex gap-2">
                      {project.liveUrl && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-4 w-4" /> Live Demo
                          </Link>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Code2 className="mr-2 h-4 w-4" /> View Code
                          </Link>
                        </Button>
                      )}
                      </div>
                      <Button asChild variant="link" className="text-primary p-0 hover:text-accent">
                        <Link href={`/portfolio/${project.slug}`}>
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </ScrollAnimationWrapper>
              ))}
            </div>
            <ScrollAnimationWrapper className="mt-12 text-center" delay={featuredProjects.length * 150}>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/portfolio">
                  View All Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </ScrollAnimationWrapper>
    </div>
  );
}
