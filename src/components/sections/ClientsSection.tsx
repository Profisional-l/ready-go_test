"use client";

import Image from "next/image";

const clientLogos = [
  { id: "1", name: "CocaCola", src: "/images/companies/cocacola.svg" },
  { id: "2", name: "KFC", src: "/images/companies/kfc.svg" },
  { id: "3", name: "MTBank", src: "/images/companies/mtbank.svg" },
  { id: "4", name: "ARARAT", src: "/images/companies/ararat.svg" },
  { id: "5", name: "Nivea", src: "/images/companies/nivea.svg" },
  { id: "6", name: "BonAqua", src: "/images/companies/bonaqua.svg" },
  { id: "7", name: "Sportmaster", src: "/images/companies/sportmaster.svg" },
  { id: "8", name: "Aps", src: "/images/companies/aps.svg" },
  { id: "9", name: "Glenlivent", src: "/images/companies/glenlivent.svg" },
];

export function ClientsSection() {
  // Дублируем массив, чтобы получить бесшовный цикл
  const logosLoop = [...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <section className="bg-transparent overflow-hidden my-32">
      <div className="flex w-max animate-scroll">
        {logosLoop.map((logo, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center"
            style={{ width: 253, height: 253 }}
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={253}
              height={253}
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
          animation: scroll 100s linear infinite;
        }
      `}</style>
    </section>
  );
}
