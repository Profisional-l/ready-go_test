import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { Footer } from '@/components/layout/Footer';
import AllCasesClient from './AllCasesClient';
import type { Case, MediaItem } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <main className="bg-[#F1F0F0] md:bg-background text-foreground pb-10 ">
        <div className="max-w-[1640px] mx-auto px-4 md:px-9 py-16 md:py-24">
            <h1 className="text-6xl md:text-[130px] font-mycustom text-foreground mb-8 md:mb-12 uppercase">кейсы</h1>
            <AllCasesClient cases={allCases} />
        </div>
                <div className="self-end md:self-auto text-center">
          <Button
            asChild
            variant="outline"
            className="text-sm md:text-base tracking-wider opacity-55 hover:opacity-100 transition-opacity duration-300  border-solid border-[1.5px] border-[#000000] rounded-[54px] bg-transparent hover:bg-transparent p-5 px-6  mx-auto -mt-32"
          >
            <Link href="/">Назад</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
