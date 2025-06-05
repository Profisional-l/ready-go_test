'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const keywords = ["СТРАТЕГИЯМИ", "SMM", "ВЕБ-РАЗРАБОТКОЙ", "БРЕНДИНГОМ", "КРЕАТИВОМ"];
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % keywords.length);
        setIsAnimating(false);
      }, 600); // match duration of animation
    }, 2600);
    return () => clearInterval(interval);
  }, [keywords.length]);

  const currentWord = keywords[index];
  const nextWord = keywords[(index + 1) % keywords.length];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
        <div className="text-[13vw] sm:text-[100px] md:text-[130px] font-black font-mycustom text-center leading-[1]">
          <div className="whitespace-nowrap">
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
          </div>
          <div className="whitespace-nowrap mt-2">
            АГЕНТСТВО{" "}
            <span className="inline-block align-middle h-[1em] w-[1em]">
              <Image
                src="/images/eyes_Group127.png"
                alt="Анимированные глаза"
                width={130}
                height={130}
                className="h-full w-full"
              />
            </span>{" "}
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>READY GO</span>
          </div>
          <div className="whitespace-nowrap mt-4">К НАМ ПРИХОДЯТ ЗА</div>

          {/* Word animation */}
          <div className="relative h-[1.3em] mt-2 overflow-hidden">
            <span className="sr-only">{currentWord}</span>

            {/* Outgoing word */}
            <div
              key={`out-${index}`}
              className={cn(
                "absolute left-0 w-full text-center transition-transform duration-600 ease-in-out",
                isAnimating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
              )}
            >
              {currentWord}
            </div>

            {/* Incoming word */}
            <div
              key={`in-${index}`}
              className={cn(
                "absolute left-0 w-full text-center transition-transform duration-600 ease-in-out",
                isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              )}
            >
              {nextWord}
            </div>
          </div>
        </div>
      </div>

      {/* Left Image */}
      <div className="absolute left-4 sm:left-8 bottom-8 sm:top-1/2 sm:-translate-y-1/2 z-10">
        <div className="relative w-[180px] sm:w-[260px] md:w-[365px] rounded-xl overflow-hidden">
          <Image
            src="/images/back-1.png"
            alt="Черное худи с бирюзовым принтом"
            width={365}
            height={365}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Image */}
      <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 z-10">
        <div className="relative w-[180px] sm:w-[280px] md:w-[360px] h-[280px] sm:h-[400px] md:h-[450px] overflow-hidden">
          <Image
            src="/images/back-2.png"
            alt="3D рендер карточки Progress on velocity"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
