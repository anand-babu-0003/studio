
"use client"; 

import { PageHeader } from '@/components/shared/page-header';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { PortfolioItem } from '@/lib/types';
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';
import { defaultPortfolioItemsDataForClient } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      setIsLoading(true);
      try {
        const items = await getPortfolioItemsAction();
        setPortfolioItems(items || []); 
      } catch (error) {
        console.error("Error fetching portfolio items for page:", error);
        setPortfolioItems(defaultPortfolioItemsDataForClient); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchPageData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            <ScrollAnimationWrapper key={project.id || `portfolio-${index}-${Date.now()}`} delay={index * 100} threshold={0.05} className="h-full">
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
