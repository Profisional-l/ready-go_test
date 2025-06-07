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
  const [selectedCase, setSelectedCase] = useState<Case | null>(null); // Сохраняем выбранный кейс для модального окна
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
    <section id="cases" className="py-10 md:py-24 px-4 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
        {/* Adjusted font size for mobile */}
        <h2 className="text-5xl md:text-[130px] font-mycustom text-foreground mb-4 md:mb-0">КЕЙСЫ</h2>
        {casesDataFromProps.length > INITIAL_CASES_TO_SHOW && (
          <div className="opacity-55 hover:opacity-100 transition-opacity duration-300 self-end md:self-auto">
          <Button
            variant="outline"
            className="text-sm md:text-base uppercase tracking-wider font-bold border-0 bg-transparent hover:bg-transparent p-0"
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
      </div>{/* Adjusted grid for mobile */}
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
