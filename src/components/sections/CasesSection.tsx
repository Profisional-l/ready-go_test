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
    <section
      id="cases"
      className="py-10 md:py-24 px-4 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
        {/* Adjusted font size for mobile */}
        <h2 className="text-6xl md:text-[130px] font-mycustom text-foreground mb-4 md:mb-0">
          КЕЙСЫ
        </h2>
      </div>
      {/* Adjusted grid for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-2">
        {casesToDisplay.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            {...caseItem}
            onClick={() => openModal(caseItem)}
          />
        ))}
      </div>
      {casesDataFromProps.length > INITIAL_CASES_TO_SHOW && (
        <div className="self-end md:self-auto mt-12 text-center">
          <Button
            variant="outline"
            className="text-sm md:text-base tracking-wider opacity-55 hover:opacity-100 transition-opacity duration-300  border-solid border-[1.5px] border-[#000000] rounded-[54px] bg-transparent hover:bg-transparent p-5 px-6  mx-auto"
            onClick={toggleShowAll}
          >
            {showAll ? "Скрыть" : <>{`Показать все `}</>}
          </Button>
        </div>
      )}
      <CaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        caseData={selectedCase}
      />
    </section>
  );
}
