
import { PageHeader } from '@/components/shared/page-header';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { PortfolioItem } from '@/lib/types'; // Type import is fine
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';

const defaultPortfolioItems: PortfolioItem[] = [];

async function getPageData(): Promise<PortfolioItem[]> {
  try {
    const items = await getPortfolioItemsAction();
    return items || defaultPortfolioItems; // Use default if action returns null/undefined
  } catch (error) {
    console.error("Error fetching portfolio items for page:", error);
    return defaultPortfolioItems; // Fallback to default on error
  }
}

export default async function PortfolioPage() {
  const portfolioItems = await getPageData();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader 
          title="My Portfolio"
          subtitle="A collection of projects I've passionately built. Explore my work to see how I transform ideas into reality."
        />
      </ScrollAnimationWrapper>

      {(portfolioItems || []).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((project, index) => (
            <ScrollAnimationWrapper key={project.id} delay={index * 100} threshold={0.05} className="h-full">
              <PortfolioCard project={project} />
            </ScrollAnimationWrapper>
          ))}
        </div>
      ) : (
        <ScrollAnimationWrapper>
          <p className="text-center text-muted-foreground text-lg">
            No projects to display at the moment. I&apos;m currently working on new and exciting things. Check back soon!
          </p>
        </ScrollAnimationWrapper>
      )}
    </div>
  );
}
