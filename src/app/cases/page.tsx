"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import AllCasesClient from './AllCasesClient';
import type { Case, MediaItem } from '@/types';
import { useIsMac } from '@/hooks/isSafari';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

// Импортируем данные напрямую (лучшее решение)
import rawCasesData from '@/data/cases.json';

export default function AllCasesPage() {
  const [allCases, setAllCases] = useState<Case[]>([]);
  const isSafariOrIOS = useIsMac();

  useEffect(() => {
    // Преобразование данных для обратной совместимости
    const transformedCases = rawCasesData.map((c: any) => {
      if (c.imageUrls && !c.media) {
        const media = c.imageUrls.map((url: string) => ({ 
          type: 'image', 
          url 
        } as MediaItem));
        if (c.videoUrl) {
          media.unshift({ type: 'video', url: c.videoUrl });
        }
        return { ...c, media, imageUrls: undefined, videoUrl: undefined };
      }
      return c;
    });

    setAllCases(transformedCases);
  }, []);

  return (
    <>
      <div className="max-w-[1640px] mx-auto px-3 md:px-8">
        <Header showNav={true} />
      </div>
      <main className="bg-[#F1F0F0] md:bg-background text-foreground pb-10 casePageMain">
        <div id='cases-pb' className="max-w-[1640px] mx-auto px-4 md:px-9 py-16 md:py-24">
          <h1 className={`text-6xl md:text-[130px] font-mycustom text-foreground mt-16 mb:mt-0 mb-8 md:mb-1 uppercase ${isSafariOrIOS ? 'safair-fix' : ''}`}>
            кейсы
          </h1>
          
          {allCases.length > 0 ? (
            <AllCasesClient cases={allCases} />
          ) : (
            <div className="text-center py-10">Загрузка кейсов...</div>
          )}
        </div>
        
        <div className="self-end md:self-auto px-4 md:px-9 max-w-[1640px] md:mx-auto">
          <Button
            asChild
            variant="outline"
            className="text-[20px] tracking-wider tight-spacing-2 opacity-55 hover:opacity-100 transition-opacity duration-300 border-solid border-[2px] border-[#101010] rounded-[54px] bg-transparent hover:bg-transparent p-[25.5px] px-[30.13px]"
          >
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}