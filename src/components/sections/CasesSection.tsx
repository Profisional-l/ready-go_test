"use client";

import { useState } from "react";
import Link from "next/link";
import { CaseCard } from "@/components/ui/CaseCard";
import { Button } from "@/components/ui/button";
import type { Case } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { CaseViewer } from "@/components/ui/CaseViewer";
import { useIsMac } from '@/hooks/isSafari';

interface CasesSectionProps {
  casesDataFromProps: Case[];
}

export function CasesSection({ casesDataFromProps }: CasesSectionProps) {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const isMobile = useIsMobile();

  const openCase = (caseItem: Case) => {
    if (caseItem.type === "modal") {
      setSelectedCase(caseItem);
    }
  };

  const closeCase = () => {
    setSelectedCase(null);
  };

  const casesToShow = isMobile ? 3 : 6;
  const casesToDisplay = casesDataFromProps.slice(0, casesToShow);
  const isSafariOrIOS = useIsMac();

  return (
    <div className="bg-[#F1F0F0] md:bg-background h-full w-full">
      <section className="max-w-[1640px] mx-auto w-full px-3 md:px-8 py-[70px] md:py-12 md:pb-24">
        <div className="relative flex flex-col md:flex-row justify-between mb-8 md:mb-0">
          <h2 className={`text-[50px] md:text-[70px] lg:text-[90px] xl:text-[12vh] 2xl:text-[9.5vh] font-mycustom text-foreground mb-0 leading-none ${isSafariOrIOS ? 'safari-fix' : ''}`}>
            КЕЙСЫ
          </h2>

          {casesDataFromProps.length > casesToShow && (
            <div className="hidden md:block text-center absolute bottom-0 right-0">
              <Button
                asChild
                variant="outline"
                className="text-[20px] tracking-wider tight-spacing-2 opacity-55 hover:opacity-100 transition-opacity duration-300 border-solid border-[2px] border-[#101010] rounded-[54px] bg-transparent hover:bg-transparent p-[25.5px] px-[30.13px]"
              >
                <Link href="/cases">Показать все</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-2 mt-1">
          {casesToDisplay.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              {...caseItem}
              onClick={() => openCase(caseItem)}
            />
          ))}
        </div>

        {casesDataFromProps.length > casesToShow && (
          <div className="block md:hidden text-center mt-12">
            <Button
              asChild
              variant="outline"
              className="text-[16px] tracking-wider tight-spacing-2 opacity-55 hover:opacity-100 transition-opacity duration-300  border-solid border-[2px] border-[#101010] rounded-[54px] bg-transparent hover:bg-transparent p-[18px] px-[23px]"
            >
              <Link href="/cases">Показать все</Link>
            </Button>
          </div>
        )}

        {selectedCase && (
          <CaseViewer caseData={selectedCase} onClose={closeCase} />
        )}
      </section>
    </div>
  );
}
