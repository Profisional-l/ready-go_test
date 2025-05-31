import { ProgressBar } from '@/components/layout/ProgressBar';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { CasesSection } from '@/components/sections/CasesSection';
import { ServiceBanner } from '@/components/sections/ServiceBanner';
import { AboutSection } from '@/components/sections/AboutSection';
import { PhotoGallery } from '@/components/sections/PhotoGallery';
import { ClientsSection } from '@/components/sections/ClientsSection';
import { Footer } from '@/components/layout/Footer';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function HomePage() {
  return (
    <>
      <ProgressBar />
      <div className="max-w-[1440px] mx-auto px-8">
        <Header />
      </div>
      <main className="bg-background text-foreground">
        <div className="max-w-[1440px] mx-auto px-8">
          <HeroSection />
          <CasesSection />
        </div>
        <ServiceBanner />
        <div className="max-w-[1440px] mx-auto px-8">
          <AboutSection />
          <PhotoGallery />
          <ClientsSection />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
