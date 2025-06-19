
import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { getSkillsAction } from '@/actions/admin/skillsActions';
import { defaultSiteSettingsForClient, defaultSkillsDataForClient } from '@/lib/data';
import SkillsPageClientContent from '@/components/skills/SkillsPageClientContent'; // New client component
import type { Skill } from '@/lib/types';
import FullScreenLoader from '@/components/shared/FullScreenLoader';


export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteSettings = await getSiteSettingsAction();
    const pageTitle = siteSettings?.skillsPageMetaTitle || defaultSiteSettingsForClient.skillsPageMetaTitle || "My Skills";
    const siteName = siteSettings?.siteName || defaultSiteSettingsForClient.siteName;
    const title = `${pageTitle} | ${siteName}`;
    const description = siteSettings?.skillsPageMetaDescription || defaultSiteSettingsForClient.skillsPageMetaDescription || "A showcase of my technical skills and expertise.";
    const ogImageUrl = siteSettings?.siteOgImageUrl || defaultSiteSettingsForClient.siteOgImageUrl;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for skills page:", error);
    const siteName = defaultSiteSettingsForClient.siteName;
    const pageTitle = defaultSiteSettingsForClient.skillsPageMetaTitle || "My Skills";
    const title = `${pageTitle} | ${siteName}`;
    const description = defaultSiteSettingsForClient.skillsPageMetaDescription || "A showcase of my technical skills and expertise.";
    return {
      title,
      description,
    };
  }
}

export default async function SkillsPage() {
  let initialSkills: Skill[] = [];
  let fetchError: string | null = null;

  try {
    initialSkills = await getSkillsAction();
    if (!initialSkills || initialSkills.length === 0) {
        // Fallback to default if action returns empty or null, but don't treat as error yet
        initialSkills = defaultSkillsDataForClient; 
    }
  } catch (error) {
    console.error("Error fetching initial skills data for SkillsPage:", error);
    initialSkills = defaultSkillsDataForClient; // Fallback on critical error
    fetchError = "Failed to load skills data. Displaying default information.";
  }
  
  // Note: FullScreenLoader logic might be re-evaluated. 
  // If getSkillsAction is fast, direct rendering of SkillsPageClientContent is fine.
  // If it can be slow, the server component itself would stream, or show a loader before client part.
  // For now, we pass data directly.
  return <SkillsPageClientContent initialSkills={initialSkills} fetchError={fetchError} />;
}

