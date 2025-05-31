"use client";

import { useState } from 'react';
import { CaseCard } from '@/components/ui/CaseCard';
import { CaseModal } from '@/components/ui/CaseModal';
import { Button } from '@/components/ui/button';
import type { Case } from '@/types';

const casesData: Case[] = [
  { id: '1', title: 'Мобильное приложение', category: 'UX/UI', imgSrc: 'https://placehold.co/360x220.png', description: 'Интерфейс для приложения.', fullDescription: 'Разработка интуитивно понятного интерфейса для мобильного приложения, сфокусированного на пользовательском опыте и легкости использования.', aiHint: "mobile app blue" },
  { id: '2', title: 'GOLOD DESIGN', category: 'Веб-дизайн', imgSrc: 'https://placehold.co/360x220.png', description: 'Редизайн сайта.', fullDescription: 'Комплексный редизайн веб-сайта для студии дизайна интерьеров GOLOD DESIGN, улучшение визуальной привлекательности и навигации.', aiHint: "desktop design gold" },
  { id: '3', title: 'Рекламный постер NEMGO', category: 'Граф. дизайн', imgSrc: 'https://placehold.co/360x220.png', description: 'Постер для мероприятия.', fullDescription: 'Создание яркого и привлекающего внимание рекламного постера для музыкального мероприятия NEMGO.', aiHint: "poster design jazz" },
  { id: '4', title: 'Кампания ARARAT', category: 'Маркетинг', imgSrc: 'https://placehold.co/360x220.png', description: 'Промо-материалы.', fullDescription: 'Разработка серии промо-материалов для бренда ARARAT, подчеркивающих премиальность и традиции.', aiHint: "lifestyle wine cheers" },
  { id: '5', title: 'Coca-Cola Promo', category: 'Digital', imgSrc: 'https://placehold.co/360x220.png', description: 'Digital кампания.', fullDescription: 'Запуск интерактивной digital-кампании для Coca-Cola, нацеленной на молодежную аудиторию.', aiHint: "laptop brand red" },
  { id: '6', title: 'Optimising Technologies', category: 'Брендинг', imgSrc: 'https://placehold.co/360x220.png', description: 'Фирменный стиль.', fullDescription: 'Разработка фирменного стиля и брендбука для технологической компании Optimising Technologies.', aiHint: "brochure graphic design" },
];

export function CasesSection() {
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
    <section id="cases" className="py-16 md:py-24">
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">КЕЙСЫ</h2>
        <Button variant="outline" className="text-xs uppercase tracking-wider hover:bg-accent hover:text-accent-foreground hover:border-accent">СМОТРЕТЬ ВСЕ ({casesData.length})</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {casesData.map((caseItem) => (
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
