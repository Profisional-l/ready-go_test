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
  return (
    <section className="py-16 md:py-24 px-4 bg-[#00000000]">
      <div className="relative w-full">
        <div className="flex animate-loop-scroll">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex min-w-full shrink-0">
              {clientLogos.map((logo) => (
                <div
                  key={`${i}-${logo.id}`}
                  className="relative w-[120px] h-[60px] md:w-[150px] md:h-[80px] mx-8 flex items-center justify-center"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={100}
                    height={30}
                    objectFit="contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes loop-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-loop-scroll {
          animation: loop-scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
