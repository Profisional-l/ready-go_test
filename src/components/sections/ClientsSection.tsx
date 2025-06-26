"use client";

import Image from 'next/image';

const clientLogos = [
  { id: '1', name: 'CocaCola', src: '/images/companies/cocacola.svg', aiHint: "CocaCola logo" },
  { id: '2', name: 'KFC', src: '/images/companies/kfc.svg', aiHint: "KFC logo" },
  { id: '3', name: 'MTBank', src: '/images/companies/mtbank.svg', aiHint: "MTBank logo" },
  { id: '4', name: 'ARARAT', src: '/images/companies/ararat.svg', aiHint: "ARARAT logo" },
  { id: '5', name: 'Nivea', src: '/images/companies/nivea.svg', aiHint: "Nivea logo" },
  { id: '6', name: 'BonAqua', src: '/images/companies/bonaqua.svg', aiHint: "BonAqua logo" },
  // Duplicate logos to create a seamless loop
  { id: '7', name: 'CocaCola', src: '/images/companies/cocacola.svg', aiHint: "CocaCola logo" },
  { id: '8', name: 'KFC', src: '/images/companies/kfc.svg', aiHint: "KFC logo" },
  { id: '9', name: 'MTBank', src: '/images/companies/mtbank.svg', aiHint: "MTBank logo" },
  { id: '10', name: 'ARARAT', src: '/images/companies/ararat.svg', aiHint: "ARARAT logo" },
  { id: '11', name: 'Nivea', src: '/images/companies/nivea.svg', aiHint: "Nivea logo" },
  { id: '12', name: 'BonAqua', src: '/images/companies/bonaqua.svg', aiHint: "BonAqua logo" },
];

export function ClientsSection() {
  return (
    <section className="py-16 md:py-24 px-4 overflow-hidden">
      <style jsx>{`
        @keyframes carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .carousel-container {
          display: flex;
          animation: carousel 20s linear infinite; /* Adjust time for speed */
        }
      `}</style>
      <div className="carousel-container">
        {clientLogos.map((logo) => (
          <div key={logo.id} className="relative flex-shrink-0 w-[120px] h-[60px] md:w-[150px] md:h-[80px] mx-8 flex items-center justify-center">
            <Image
              src={logo.src}
              alt={logo.name}
              width={150}
              height={80}
              objectFit="contain"
              className="filter"
              data-ai-hint={logo.aiHint}
            />
          </div>
        ))}
      </div>
    </section>
  );
}