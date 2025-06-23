import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { Footer } from '@/components/layout/Footer';
import AllCasesClient from './AllCasesClient';
import type { Case, MediaItem } from '@/types';
import fs from 'fs/promises';
import path from 'path';

async function getCasesData(): Promise<Case[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const cases = JSON.parse(jsonData) as any[];

    // Backward compatibility: convert old structure to new media structure
    return cases.map(c => {
      if (c.imageUrls && !c.media) {
        const media = (c.imageUrls as string[]).map(url => ({ type: 'image', url } as MediaItem));
        if (c.videoUrl) {
          media.unshift({ type: 'video', url: c.videoUrl });
        }
        return { ...c, media, imageUrls: undefined, videoUrl: undefined };
      }
      return c as Case;
    });

  } catch (error) {
    console.error('Error reading or parsing cases.json:', error);
    return [];
  }
}

export default async function AllCasesPage() {
  const allCases = await getCasesData();

  return (
    <>
    <ProgressBar/>
      <div className="max-w-[1640px] mx-auto px-3 md:px-8">
        <Header showNav={false} />
      </div>
      <main className="bg-[#F1F0F0] md:bg-background text-foreground">
        <div className="max-w-[1640px] mx-auto px-4 md:px-9 py-16 md:py-24">
            <h1 className="text-6xl md:text-[130px] font-mycustom text-foreground mb-8 md:mb-12 uppercase">кейсы</h1>
            <AllCasesClient cases={allCases} />
        </div>
      </main>
      <Footer />
    </>
  );
}
