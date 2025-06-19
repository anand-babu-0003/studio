
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import '../styles/not-found.css';
import { Button } from '@/components/ui/button';
import type { NotFoundPageData } from '@/lib/types';
import { getNotFoundPageDataAction } from '@/actions/admin/notFoundActions';
import { defaultNotFoundPageDataForClient } from '@/lib/data';
import FullScreenLoader from '@/components/shared/FullScreenLoader'; // Assuming you have this

export default function NotFound() {
  const [pageData, setPageData] = useState<NotFoundPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getNotFoundPageDataAction();
        setPageData(data || defaultNotFoundPageDataForClient);
      } catch (error) {
        console.error("Error fetching Not Found page data:", error);
        setPageData(defaultNotFoundPageDataForClient);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading || !pageData) {
    return <FullScreenLoader />;
  }

  return (
    <div className="fullscreen-nf-wrapper">
      <div className="content-nf">
        <h1 className="text-404-nf">404</h1>
        <div className="illustration-container-nf">
          <Image
            src={pageData.imageSrc || defaultNotFoundPageDataForClient.imageSrc}
            alt={pageData.heading || defaultNotFoundPageDataForClient.heading}
            width={400}
            height={300}
            className="illustration-image-nf"
            data-ai-hint={pageData.dataAiHint || defaultNotFoundPageDataForClient.dataAiHint}
            priority
          />
        </div>
        <h3 className="heading-nf">{pageData.heading || defaultNotFoundPageDataForClient.heading}</h3>
        <p className="subtext-nf">{pageData.message || defaultNotFoundPageDataForClient.message}</p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/">
            {pageData.buttonText || defaultNotFoundPageDataForClient.buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
}
