"use client";

import { useState } from "react";
import { CaseCard } from "@/components/ui/CaseCard";
import { CaseModal } from "@/components/ui/CaseModal";
import { Button } from "@/components/ui/button";
import type { Case } from "@/types";
import Image from "next/image";

interface CasesSectionProps {
  casesDataFromProps: Case[];
}

const INITIAL_CASES_TO_SHOW = 6;

export function CasesSection({ casesDataFromProps }: CasesSectionProps) {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const openModal = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const casesToDisplay = showAll
    ? casesDataFromProps
    : casesDataFromProps.slice(0, INITIAL_CASES_TO_SHOW);

  return (
    <section id="cases" className="py-16 md:py-24">
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <h2 className="text-[130px] font-mycustom text-foreground">КЕЙСЫ</h2>
        {casesDataFromProps.length > INITIAL_CASES_TO_SHOW && (
          <div className="opacity-55 hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="outline"
            className="text-base uppercase tracking-wider font-bold border-0 bg-transparent hover:bg-transparent"
            onClick={toggleShowAll}
          >
            {showAll ? (
              "Скрыть"
            ) : (
              <>
                {`Смотреть все `}
                <span className="inline-block align-middle h-[1em]">
                  <Image
                    src="/images/Group127w.png"
                    alt="Анимированные глаза"
                    width={15}
                    height={15}
                  />
                </span>
                {` (${casesDataFromProps.length})`}
              </>
            )}
          </Button>            
          </div>

        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
  );
}
