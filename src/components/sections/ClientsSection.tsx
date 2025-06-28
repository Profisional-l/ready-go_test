"use client";

import Image from "next/image";

const clientLogos = [
  { id: "1", name: "CocaCola", src: "/images/companies/cocacola.svg" },
  { id: "2", name: "KFC", src: "/images/companies/kfc.svg" },
  { id: "3", name: "MTBank", src: "/images/companies/mtbank.svg" },
  { id: "4", name: "ARARAT", src: "/images/companies/ararat.svg" },
  { id: "5", name: "Nivea", src: "/images/companies/nivea.svg" },
  { id: "6", name: "BonAqua", src: "/images/companies/bonaqua.svg" },
];

export function ClientsSection() {
  // Дублируем массив, чтобы получить бесшовный цикл
  const logosLoop = [...clientLogos, ...clientLogos];

  return (
    <section className="py-16 md:py-24 px-4 bg-transparent overflow-hidden">
      <div className="flex w-max animate-scroll">
        {logosLoop.map((logo, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center mx-8"
            style={{ width: 120, height: 60 }}
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={120}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          /* 20s — время, за которое карточки пройдут расстояние одного полного набора */
          animation: scroll 10s linear infinite;
        }
      `}</style>
    </section>
  );
}
