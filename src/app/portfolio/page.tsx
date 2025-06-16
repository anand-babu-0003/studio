import { PageHeader } from '@/components/shared/page-header';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import { portfolioItems } from '@/lib/data';

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fadeInUp-1">
      <PageHeader 
        title="My Portfolio"
        subtitle="A collection of projects I've passionately built. Explore my work to see how I transform ideas into reality."
      />

      {portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">
          No projects to display at the moment. Check back soon!
        </p>
      )}
    </div>
  );
}
