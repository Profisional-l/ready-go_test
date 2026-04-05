"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Client {
  id: string;
  name: string;
  src: string;
  order: number;
}

export function ClientsSection() {
  const [clientLogos, setClientLogos] = useState<Client[]>([]);

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch('/api/clients');
        if (response.ok) {
          const data = await response.json();
          setClientLogos(data);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    }

    loadClients();
  }, []);

  if (clientLogos.length === 0) {
    return null;
  }

  // Дублируем массив, чтобы получить бесшовный цикл
  const logosLoop = Array(10).fill(null).flatMap(() => clientLogos);

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
