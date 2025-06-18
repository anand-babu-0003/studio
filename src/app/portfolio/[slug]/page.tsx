
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

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');

async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent.trim()) {
      return [];
    }
    const appData = JSON.parse(fileContent) as Partial<AppData>;
    if (appData && Array.isArray(appData.portfolioItems)) {
      return appData.portfolioItems.filter(
        item => typeof item.slug === 'string' && item.slug.trim() !== ''
      );
    }
    return [];
  } catch (error) {
    return [];
  }
}

export async function generateStaticParams() {
  const portfolioItems = await getPortfolioItems();
  if (!portfolioItems || portfolioItems.length === 0) {
    return [];
  }
  return portfolioItems.map((project) => ({
    slug: project.slug,
  }));
}

export default async function PortfolioDetailPage({
  params,
  searchParams, // Adding searchParams for completeness, though not used
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const portfolioItems = await getPortfolioItems();
  const project = portfolioItems.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/portfolio">
          <span>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </span>
        </Link>
      </Button>

      <PageHeader title={project.title} />

      {project.images && project.images.length > 0 && (
        <div className="mb-16">
          <Carousel className="w-full max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden">
            <CarouselContent>
              {(project.images || []).map((src, index) => (
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
            {(project.images || []).length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-16">
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
              {(project.tags || []).map((tag) => (
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
                      <span>
                        <ExternalLink className="mr-2 h-5 w-5" /> View Live Demo
                      </span>
                    </Link>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button asChild variant="secondary" size="lg">
                    <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <span>
                        <Github className="mr-2 h-5 w-5" /> View Code on GitHub
                      </span>
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
              <div className="prose dark:prose-invert lg:prose-lg xl:prose-xl max-w-none markdown-body">
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
