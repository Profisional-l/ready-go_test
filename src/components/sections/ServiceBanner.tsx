"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function ServiceBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageSrc = "/images/Group103.svg";
  const imageHeight = isMobile ? 99 : 190;

  const BannerItem = () => (
    <div className="flex items-center justify-center h-[99px] md:h-[190px]">
      <div className="relative" style={{ height: `${imageHeight}px` }}>
        <Image
          src={imageSrc}
          alt="Service banner"
          width={isMobile ? 1827 : 3560}
          height={imageHeight}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );

  return (
    <section className="bg-accent text-accent-foreground overflow-hidden h-[99px] md:h-[190px] py-0 ">
      <div className="relative flex w-max animate-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          <BannerItem key={i} />
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
      `}</style>
    </section>
  );
}
