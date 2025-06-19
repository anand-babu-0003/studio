
"use client"; // Needs to be client for useState and useEffect for loading state

import { PageHeader } from '@/components/shared/page-header';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { AboutMeData } from '@/lib/types';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { defaultAboutMeDataForClient } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [aboutMeData, setAboutMeData] = useState<AboutMeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      setIsLoading(true);
      try {
        const data = await getAboutMeDataAction();
        setAboutMeData(data || defaultAboutMeDataForClient);
      } catch (error) {
        console.error("Error fetching About Me data for Contact page:", error);
        setAboutMeData(defaultAboutMeDataForClient); // Fallback to default on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchPageData();
  }, []);

  if (isLoading || !aboutMeData) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const displayedData = aboutMeData; // Already has fallbacks

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader 
          title="Get in Touch"
          subtitle="Have a project in mind, a question, or just want to say hi? I'd love to hear from you."
        />
      </ScrollAnimationWrapper>

      <div className="grid lg:grid-cols-5 gap-12">
        <ScrollAnimationWrapper className="lg:col-span-3" delay={100}>
          <Card className="shadow-xl p-6 sm:p-8">
            <CardContent className="p-0">
              <ContactForm />
            </CardContent>
          </Card>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper className="lg:col-span-2" delay={200}>
           <Card className="shadow-xl p-6 sm:p-8 bg-primary/5">
            <CardContent className="p-0">
              <ContactInfo aboutMeData={displayedData} />
            </CardContent>
          </Card>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
