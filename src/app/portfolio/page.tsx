
import { PageHeader } from '@/components/shared/page-header';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { PortfolioItem, AppData } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const defaultPortfolioItems: PortfolioItem[] = [];

async function getFreshPortfolioItems(): Promise<PortfolioItem[]> {
  const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent.trim()) {
        console.warn("Data file is empty for Portfolio page, returning empty array.");
        return defaultPortfolioItems;
    }
    const appData = JSON.parse(fileContent) as Partial<AppData>;
    return Array.isArray(appData.portfolioItems) ? appData.portfolioItems : defaultPortfolioItems;
  } catch (error) {
    console.error("Error reading or parsing data.json for Portfolio page, returning empty array:", error);
    return defaultPortfolioItems;
  }
}

export default async function PortfolioPage() {
  const portfolioItems = await getFreshPortfolioItems();

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
            No projects to display at the moment. Check back soon!
          </p>
        </ScrollAnimationWrapper>
      )}
    </div>
  );
}
