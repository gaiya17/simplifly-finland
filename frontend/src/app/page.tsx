import { Hero } from '../components/sections/Hero';
import { SupportCTA } from '../components/sections/SupportCTA';
import { DestinationHighlights } from '../components/sections/DestinationHighlights';
import { ServicesSection } from '../components/sections/ServicesSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { MaldivesResorts } from '../components/sections/MaldivesResorts';
import { BlogSection } from '../components/sections/BlogSection';
import { BrandLogos } from '../components/sections/BrandLogos';
import { FAQSection } from '../components/sections/FAQSection';
import { ReviewsSection } from '../components/sections/ReviewsSection';
import { homepageApi } from '../lib/homepageApi';

export const revalidate = 60;

export default async function Home() {
  let homepageData: { tours: any[]; resorts: any[]; gallery: any[]; blogs: any[] } = { tours: [], resorts: [], gallery: [], blogs: [] };
  
  try {
    const data = await homepageApi.getHomepageData();
    if (data) {
      homepageData = {
        tours: Array.isArray(data.tours) ? data.tours : [],
        resorts: Array.isArray(data.resorts) ? data.resorts : [],
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        blogs: Array.isArray(data.blogs) ? data.blogs : [],
      };
    }
  } catch (error) {
    console.error("Failed to load homepage data:", error);
  }

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <SupportCTA />
      <DestinationHighlights tours={homepageData.tours} />
      <ServicesSection />
      <ExperienceSection gallery={homepageData.gallery} />
      <MaldivesResorts resorts={homepageData.resorts} />
      <BlogSection blogs={homepageData.blogs} />
      <BrandLogos />
      <FAQSection />
      <ReviewsSection />
    </div>
  );
}
