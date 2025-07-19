"use client";

import { useState } from "react";
import Link from "next/link";
import { CaseCard } from "@/components/ui/CaseCard";
import { CaseModal } from "@/components/ui/CaseModal";
import { Button } from "@/components/ui/button";
import type { Case } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface CasesSectionProps {
  casesDataFromProps: Case[];
}

export function CasesSection({ casesDataFromProps }: CasesSectionProps) {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const openModal = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  const casesToShow = isMobile ? 3 : 6;
  const casesToDisplay = casesDataFromProps.slice(0, casesToShow);

  return (
    <div className="bg-[#F1F0F0] md:bg-background h-full w-full">
      <section className="max-w-[1640px] mx-auto w-full px-3 md:px-8 py-10 md:py-12 md:pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-0">
          <h2 className="text-6xl md:text-[130px] font-mycustom text-foreground mt-4 mb-0">
            КЕЙСЫ
          </h2>
          {casesDataFromProps.length > casesToShow && (
            <div className="hidden md:block text-center mt-[102px]">
              <Button
                asChild
                variant="outline"
                className="text-[20px] tracking-wider tight-spacing-2 opacity-55 hover:opacity-100 transition-opacity duration-300  border-solid border-[2px] border-[#101010] rounded-[54px] bg-transparent hover:bg-transparent p-[25.5px] px-[30.13px]"
              >
                <Link href="/cases">Показать все</Link>
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-2">
          {casesToDisplay.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              {...caseItem}
              onClick={() => openModal(caseItem)}
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

        <CaseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          caseData={selectedCase}
        />
      </section>
    </div>
  );
}
