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
import type { Case } from '@/types';
import fs from 'fs/promises';
import path from 'path';

async function getCasesData(): Promise<Case[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const cases = JSON.parse(jsonData) as Case[];
    return cases;
  } catch (error) {
    console.error('Error reading or parsing cases.json:', error);
    return []; // Return empty array or default data in case of error
  }
}

export default async function HomePage() {
  const casesData = await getCasesData();

  return (
    <>
      <ProgressBar />
      <div className="max-w-[1640px] mx-auto px-3 md:px-8">
        <Header />
      </div>
      <main className="bg-background text-foreground">
        <div className="max-w-[1640px] mx-auto md:px-8">
          <HeroSection />
          <div className='bg-[#F1F0F0] md:bg-background'>
          <CasesSection casesDataFromProps={casesData}/>
          </div>
        </div>
        <ServiceBanner />
        <div className="max-w-[1640px] mx-auto px-8">
          <AboutSection />
        </div>
        <PhotoGallery />
        <div className="max-w-[1640px] mx-auto px-8">
          <ClientsSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
