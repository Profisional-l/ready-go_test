'use client';

import { useState } from 'react';
import { CaseCard } from '@/components/ui/CaseCard';
import { CaseModal } from '@/components/ui/CaseModal';
import type { Case } from '@/types';

interface AllCasesClientProps {
    cases: Case[];
}

export default function AllCasesClient({ cases }: AllCasesClientProps) {
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

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-2">
                {cases.map((caseItem) => (
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
        </>
    );
}
