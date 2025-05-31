"use client";

import { useState } from 'react';
import { CaseCard } from '@/components/ui/CaseCard';
import { CaseModal } from '@/components/ui/CaseModal';
import { Button } from '@/components/ui/button';
import type { Case } from '@/types';

const casesData: Case[] = [
  { id: '1', title: 'Логотип для кофейни', category: 'Брендинг', imgSrc: 'https://placehold.co/360x220.png?a=1', description: 'Яркий и запоминающийся логотип.', fullDescription: 'Мы разработали полный фирменный стиль для новой сети кофеен, начиная от логотипа и заканчивая дизайном упаковки. Основной задачей было создать образ, который бы привлекал молодую аудиторию и передавал атмосферу уюта и качества.', aiHint: "coffee shop logo" },
  { id: '2', title: 'Редизайн сайта e-commerce', category: 'Веб-дизайн', imgSrc: 'https://placehold.co/360x220.png?a=2', description: 'Современный и удобный интерфейс.', fullDescription: 'Полный редизайн интернет-магазина с упором на улучшение пользовательского опыта и повышение конверсии. Была проведена аналитика, разработаны прототипы и новый дизайн.', aiHint: "ecommerce website" },
  { id: '3', title: 'SMM-стратегия для бренда одежды', category: 'Маркетинг', imgSrc: 'https://placehold.co/360x220.png?a=3', description: 'Увеличение охватов и вовлеченности.', fullDescription: 'Разработка и реализация комплексной SMM-стратегии для модного бренда. Включала контент-план, таргетированную рекламу и работу с инфлюенсерами.', aiHint: "fashion social media" },
  { id: '4', title: 'Мобильное приложение для фитнеса', category: 'UX/UI', imgSrc: 'https://placehold.co/360x220.png?a=4', description: 'Интуитивно понятный дизайн.', fullDescription: 'Проектирование интерфейса и пользовательского опыта для мобильного фитнес-приложения. Цель - создать мотивирующее и простое в использовании приложение.', aiHint: "fitness app interface" },
  { id: '5', title: 'Рекламная кампания для стартапа', category: 'Digital', imgSrc: 'https://placehold.co/360x220.png?a=5', description: 'Привлечение первых клиентов.', fullDescription: 'Запуск digital-кампании для технологического стартапа, направленной на повышение узнаваемости бренда и привлечение первых пользователей. Использовались контекстная реклама, PR и email-маркетинг.', aiHint: "startup campaign" },
  { id: '6', title: 'Корпоративный сайт для IT-компании', category: 'Веб-разработка', imgSrc: 'https://placehold.co/360x220.png?a=6', description: 'Солидный и информативный сайт.', fullDescription: 'Создание корпоративного сайта "под ключ" для IT-компании, отражающего ее экспертизу и ценности. Сайт адаптивен и оптимизирован для поисковых систем.', aiHint: "corporate website" },
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
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">КЕЙСЫ</h2>
        <Button variant="outline">СМОТРЕТЬ ВСЕ ({casesData.length})</Button>
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
