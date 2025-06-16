
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { portfolioItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateStaticParams() {
  return portfolioItems.map((project) => ({
    slug: project.slug,
  }));
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = portfolioItems.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <Button asChild variant="outline" className="mb-8">
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Link>
        </Button>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper delay={100}>
        <PageHeader title={project.title} />
      </ScrollAnimationWrapper>
      
      {project.images && project.images.length > 0 && (
        <ScrollAnimationWrapper className="mb-12" delay={200}>
          <Carousel className="w-full max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden">
            <CarouselContent>
              {project.images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video relative">
                    <Image 
                      src={src} 
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
        </ScrollAnimationWrapper>
      )}

      <div className="max-w-3xl mx-auto space-y-12">
        <ScrollAnimationWrapper delay={300}>
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
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper delay={400}>
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
        </ScrollAnimationWrapper>

        {(project.liveUrl || project.repoUrl) && (
          <ScrollAnimationWrapper delay={500}>
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
          </ScrollAnimationWrapper>
        )}

        {project.readmeContent && (
          <ScrollAnimationWrapper delay={600}>
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
          </ScrollAnimationWrapper>
        )}
      </div>
    </div>
  );
}
