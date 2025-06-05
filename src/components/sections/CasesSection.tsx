
"use client";

import { useState } from 'react';
import { CaseCard } from '@/components/ui/CaseCard';
import { CaseModal } from '@/components/ui/CaseModal';
import { Button } from '@/components/ui/button';
import type { Case } from '@/types';

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
          <Button
            variant="outline"
            className="text-xs uppercase tracking-wider hover:bg-accent hover:text-accent-foreground hover:border-accent"
            onClick={toggleShowAll}
          >
            {showAll ? 'Скрыть' : `Смотреть все (${casesDataFromProps.length})`}
          </Button>
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
      <CaseModal isOpen={isModalOpen} onClose={closeModal} caseData={selectedCase} />
    </section>
  );
}
