"use client";

import { useState } from "react";
import { CaseCard } from "@/components/ui/CaseCard";
import { CaseModal } from "@/components/ui/CaseModal";
import type { Case } from "@/types";

interface CasesSectionProps {
  casesDataFromProps: Case[];
}

export function CasesSection({ casesDataFromProps }: CasesSectionProps) {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };
  
  // No more slicing, display all cases
  const casesToDisplay = casesDataFromProps;

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
            <CaseModal
                isOpen={isModalOpen}
                onClose={closeModal}
                caseData={selectedCase}
            />
        </section>
    </div>
  );
}
