"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CaseCard } from "@/components/ui/CaseCard";
import { CaseModal } from "@/components/ui/CaseModal";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const [isMobile, setIsMobile] = useState(false);

  const INITIAL_CASES_TO_SHOW = isMobile ? 3 : 6;
  const casesToDisplay = casesDataFromProps.slice(0, INITIAL_CASES_TO_SHOW);

  return (
    <section id="cases" className="py-10 md:py-24 px-3 md:px-0 overflow-hidden">
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
      {casesDataFromProps.length > INITIAL_CASES_TO_SHOW && (
        <div className="self-end md:self-auto mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="text-sm md:text-base tracking-wider opacity-55 hover:opacity-100 transition-opacity duration-300  border-solid border-[1.5px] border-[#000000] rounded-[54px] bg-transparent hover:bg-transparent p-5 px-6  mx-auto "
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
  );
}
