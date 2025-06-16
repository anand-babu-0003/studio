import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { portfolioItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fadeInUp-1">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/portfolio">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Link>
      </Button>

      <PageHeader title={project.title} />
      
      {project.images && project.images.length > 0 && (
        <div className="mb-12">
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
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <section className="mb-8">
          <h2 className="font-headline text-2xl font-semibold text-primary mb-3">About this project</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            {project.longDescription || project.description}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline text-2xl font-semibold text-primary mb-3">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="default" className="text-sm px-3 py-1">{tag}</Badge>
            ))}
          </div>
        </section>

        {(project.liveUrl || project.repoUrl) && (
          <section className="mb-8">
            <h2 className="font-headline text-2xl font-semibold text-primary mb-4">Links</h2>
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
          </section>
        )}
      </div>
    </div>
  );
}
