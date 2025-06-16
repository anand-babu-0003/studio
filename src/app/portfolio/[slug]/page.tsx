
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioItem, AppData } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

async function getFreshPortfolioItemsForSlug(): Promise<PortfolioItem[]> {
  const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const appData = JSON.parse(fileContent) as AppData;
    return appData.portfolioItems;
  } catch (error) {
    console.error("Error reading data.json for Portfolio slug page, returning empty array:", error);
    return [];
  }
}

export async function generateStaticParams() {
  const portfolioItems = await getFreshPortfolioItemsForSlug();
  return portfolioItems.map((project) => ({
    slug: project.slug,
  }));
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const portfolioItems = await getFreshPortfolioItemsForSlug();
  const project = portfolioItems.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/portfolio">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Link>
      </Button>

      <PageHeader title={project.title} />
      
      {project.images && project.images.length > 0 && (
        <div className="mb-16">
          <Carousel className="w-full max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden">
            <CarouselContent>
              {project.images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video relative">
                    <Image 
                      src={src || 'https://placehold.co/600x400.png'}
                      alt={`${project.title} - Screenshot ${index + 1}`} 
                      fill
                      className="object-cover"
                      data-ai-hint={project.dataAiHint || 'project detail'}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {project.images.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-16"> {/* Changed max-w-4xl to max-w-5xl */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">About this project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Technologies Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="default" className="text-sm px-3 py-1">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {(project.liveUrl || project.repoUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button asChild variant="default" size="lg">
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" /> View Live Demo
                    </Link>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button asChild variant="secondary" size="lg">
                    <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-5 w-5" /> View Code on GitHub
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {project.readmeContent && (
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Project README</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.readmeContent}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

