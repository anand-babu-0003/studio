
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
import type { PortfolioItem } from '@/lib/types';
import { getPortfolioItemsAction, getPortfolioItemBySlugAction } from '@/actions/admin/portfolioActions';
import { defaultPortfolioItemsDataForClient } from '@/lib/data'; // For default structure

export async function generateStaticParams() {
  try {
    const portfolioItems = await getPortfolioItemsAction();
    if (!Array.isArray(portfolioItems) || portfolioItems.length === 0) {
      return [];
    }
    return portfolioItems
      .filter(item => typeof item.slug === 'string' && item.slug.trim() !== '')
      .map((project) => ({
        slug: project.slug,
      }));
  } catch (error) {
    console.error("Error generating static params for portfolio slugs:", error);
    return []; 
  }
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let project: PortfolioItem | null = null;
  try {
    project = await getPortfolioItemBySlugAction(params.slug);
  } catch (error) {
    console.error(`Error fetching portfolio item for slug ${params.slug}:`, error);
  }

  if (!project) {
    notFound();
  }
  
  // Ensure project.images is an array, even if empty
  const projectImages = Array.isArray(project.images) ? project.images : [];
  const projectTags = Array.isArray(project.tags) ? project.tags : [];


  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/portfolio">
          <span>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </span>
        </Link>
      </Button>

      <PageHeader title={project.title || 'Project Details'} />

      {projectImages.length > 0 && (
        <div className="mb-16">
          <Carousel className="w-full max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden">
            <CarouselContent>
              {projectImages.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video relative">
                    <Image
                      src={src || defaultPortfolioItemsDataForClient[0]?.images[0] || 'https://placehold.co/1200x675.png'}
                      alt={`${project.title || 'Project'} - Screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={project.dataAiHint || 'project detail'}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {projectImages.length > 1 && (
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
              {project.longDescription || project.description || 'Detailed project description coming soon.'}
            </p>
          </CardContent>
        </Card>

        {projectTags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Technologies Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {projectTags.map((tag) => (
                  <Badge key={tag} variant="default" className="text-sm px-3 py-1">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button
                    asChild
                    className="bg-[hsl(260,55%,78%)] text-[hsl(260,25%,30%)] hover:bg-[hsl(260,55%,72%)] dark:bg-[hsl(260,55%,78%)] dark:text-[hsl(260,25%,30%)] dark:hover:bg-[hsl(260,55%,72%)] font-semibold shadow-lg transition-all duration-300 rounded-md text-base leading-snug px-6 py-3"
                  >
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center">
                        <ExternalLink className="mr-2 h-5 w-5" /> View Live Demo
                      </span>
                    </Link>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button
                    asChild
                    className="bg-[hsl(260,55%,78%)] text-[hsl(260,25%,30%)] hover:bg-[hsl(260,55%,72%)] dark:bg-[hsl(260,55%,78%)] dark:text-[hsl(260,25%,30%)] dark:hover:bg-[hsl(260,55%,72%)] font-semibold shadow-lg transition-all duration-300 rounded-md text-base leading-snug px-6 py-3"
                  >
                    <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center">
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
