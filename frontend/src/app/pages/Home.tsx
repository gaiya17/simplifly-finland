import { Hero } from '../components/Hero';
import { SupportCTA } from '../components/SupportCTA';
import { DestinationHighlights } from '../components/DestinationHighlights';
import { ServicesSection } from '../components/ServicesSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { MaldivesResorts } from '../components/MaldivesResorts';
import { BlogSection } from '../components/BlogSection';
import { BrandLogos } from '../components/BrandLogos';
import { FAQSection } from '../components/FAQSection';
import { ReviewsSection } from '../components/ReviewsSection';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <SupportCTA />
      <DestinationHighlights />
      <ServicesSection />
      <ExperienceSection />
      <MaldivesResorts />
      <BlogSection />
      <BrandLogos />
      <FAQSection />
      <ReviewsSection />
    </div>
  );
}