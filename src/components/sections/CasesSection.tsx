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
        <section className="max-w-[1640px] mx-auto w-full px-3 md:px-8 py-10 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
                <h2 className="text-6xl md:text-[130px] font-mycustom text-foreground mt-4 mb-0">
                КЕЙСЫ
                </h2>
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
                <div className="text-center mt-12">
                     <Button
                        asChild
                        variant="outline"
                        className="text-sm md:text-base tracking-wider opacity-55 hover:opacity-100 transition-opacity duration-300  border-solid border-[1.5px] border-[#000000] rounded-[54px] bg-transparent hover:bg-transparent p-5 px-6"
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
