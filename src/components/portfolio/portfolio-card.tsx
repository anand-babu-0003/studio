
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Code2, ArrowRight } from 'lucide-react';
import type { PortfolioItem } from '@/lib/types';

interface PortfolioCardProps {
  project: PortfolioItem;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const cardCtaButtonStyle = "bg-[hsl(260,55%,78%)] text-[hsl(260,25%,30%)] hover:bg-[hsl(260,55%,72%)] dark:bg-[hsl(260,55%,78%)] dark:text-[hsl(260,25%,30%)] dark:hover:bg-[hsl(260,55%,72%)] font-semibold shadow-md transition-all duration-300 rounded-md text-sm px-4 py-2";

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] rounded-lg">
      <CardHeader className="p-0 relative aspect-video">
        {project.images[0] && (
          <Image
            src={project.images[0]}
            alt={`Screenshot of ${project.title}`}
            fill
            className="object-cover"
            data-ai-hint={project.dataAiHint || 'project technology'}
          />
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-2xl text-primary mb-2">{project.title}</CardTitle>
        <div className="mb-4 space-x-2 flex flex-wrap gap-y-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
          ))}
        </div>
        <CardDescription className="text-muted-foreground line-clamp-3">{project.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 bg-muted/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          {project.liveUrl && (
            <Button asChild className={cardCtaButtonStyle}>
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <span className="inline-flex items-center">
                  <Eye className="mr-2 h-4 w-4" /> Live Demo
                </span>
              </Link>
            </Button>
          )}
          {project.repoUrl && (
            <Button asChild className={cardCtaButtonStyle}>
              <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <span className="inline-flex items-center">
                  <Code2 className="mr-2 h-4 w-4" /> View Code
                </span>
              </Link>
            </Button>
          )}
        </div>
        <Button asChild variant="link" className="text-primary p-0 hover:text-accent self-end sm:self-center">
          <Link href={`/portfolio/${project.slug}`}>
            <span>Details <ArrowRight className="ml-1 h-4 w-4" /></span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
