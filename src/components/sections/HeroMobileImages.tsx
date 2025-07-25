
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const mobileImageGroups = [
  { src: "/images/ForHeroSection/mobile-1.webp", alt: "СТРАТЕГИЯМИ" },
  { src: "/images/ForHeroSection/mobile-2.webp", alt: "SMM" },
  { src: "/images/ForHeroSection/mobile-3.webp", alt: "WEB" },
  { src: "/images/ForHeroSection/mobile-4.webp", alt: "БРЕНДИНГ" },
  { src: "/images/ForHeroSection/mobile-5.webp", alt: "КРЕАТИВ" },
  { src: "/images/ForHeroSection/mobile-6.webp", alt: "ПРОДАКШН" },
  { src: "/images/ForHeroSection/mobile-7.webp", alt: "МЕРЧ" },
];

interface HeroMobileImagesProps {
    currentIndex: number;
}

export default function HeroMobileImages({ currentIndex }: HeroMobileImagesProps) {
    return (
        <>
            {mobileImageGroups.map((group, groupIndex) => (
                <div
                    key={`mobile-image-${groupIndex}`}
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 w-[280px] h-[350px]",
                        {
                            "opacity-100": currentIndex === groupIndex,
                            "opacity-0": currentIndex !== groupIndex,
                        }
                    )}
                >
                    <Image
                        src={group.src}
                        alt={group.alt}
                        priority
                        fill
                        sizes="80vw"
                        className="object-contain"
                    />
                </div>
            ))}
        </>
    );
}
