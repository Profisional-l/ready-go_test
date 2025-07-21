'use client';

import { useState } from 'react';
import { CaseCard } from '@/components/ui/CaseCard';
import type { Case } from '@/types';
import { CaseViewer } from '@/components/ui/CaseViewer';

interface AllCasesClientProps {
    cases: Case[];
}

export default function AllCasesClient({ cases }: AllCasesClientProps) {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);

    const openCase = (caseItem: Case) => {
        if (caseItem.type === 'modal') {
            setSelectedCase(caseItem);
        }
    };

    const closeCase = () => {
        setSelectedCase(null);
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-2">
                {cases.map((caseItem) => (
                    <CaseCard
                        key={caseItem.id}
                        {...caseItem}
                        onClick={() => openCase(caseItem)}
                    />
                ))}
            </div>
            {selectedCase && (
                 <CaseViewer
                    caseData={selectedCase}
                    onClose={closeCase}
                />
            )}
        </>
    );
}
