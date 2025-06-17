
import { PageHeader } from '@/components/shared/page-header';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { AboutMeData, AppData } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

// Ensure this default is complete according to the AboutMeData type
const defaultAboutMeData: AboutMeData = { 
  name: 'Default Name', 
  title: 'Default Title', 
  bio: 'Default bio.', 
  profileImage: 'https://placehold.co/400x400.png', 
  dataAiHint: 'placeholder image',
  experience: [], 
  education: [],
  email: 'default@example.com',
  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
};

async function getFreshAboutMeData(): Promise<AboutMeData> {
  const dataFilePath = path.resolve(process.cwd(), 'src/lib/data.json');
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent.trim()) {
        console.warn("Data file is empty for Contact page, returning default structure.");
        return defaultAboutMeData;
    }
    const appData = JSON.parse(fileContent) as Partial<AppData>;
    // Merge the loaded aboutMe data with the complete default structure
    return {
      ...defaultAboutMeData, // Start with the full default
      ...(appData.aboutMe ?? {}), // Override with parsed data if appData.aboutMe exists
    };
  } catch (error) {
    console.error("Error reading or parsing data.json for Contact page, returning default structure:", error);
    return defaultAboutMeData;
  }
}

export default async function ContactPage() {
  const aboutMeData = await getFreshAboutMeData();

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
              <ContactInfo aboutMeData={aboutMeData} />
            </CardContent>
          </Card>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
