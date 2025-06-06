'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const keywords = ["СТРАТЕГИЯМИ", "SMM", "ВЕБ-РАЗРАБОТКОЙ", "БРЕНДИНГОМ", "КРЕАТИВОМ"];
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [leftImageStyle, setLeftImageStyle] = useState<React.CSSProperties>({});
  const [rightImageStyle, setRightImageStyle] = useState<React.CSSProperties>({});
  const mouse = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number | null>(null);

  // Плавное движение изображений
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const { x, y } = mouse.current;

      const moveX1 = (x - centerX) * 0.01;
      const moveY1 = (y - centerY) * 0.01;

      const moveX2 = (centerX - x) * 0.015;
      const moveY2 = (centerY - y) * 0.015;

      setLeftImageStyle({
        transform: `translate(${moveX1}px, ${moveY1}px)`,
        transition: 'transform 0.2s ease-out',
      });

      setRightImageStyle({
        transform: `translate(${moveX2}px, ${moveY2}px)`,
        transition: 'transform 0.2s ease-out',
      });

      animFrame.current = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animFrame.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  // Плавная смена слов
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % keywords.length);
        setIsAnimating(false);
      }, 600);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentWord = keywords[index];
  const nextWord = keywords[(index + 1) % keywords.length];

  return (
    <section className="relative min-h-screen w-full bg-white">
      {/* Центрированный контент */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
        <div className="text-[13vw] sm:text-[100px] md:text-[130px] font-black font-mycustom text-center leading-[1] -mt-40">
          <div className="whitespace-nowrap">
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
          </div>
          <div className="whitespace-nowrap mt-2">
            АГЕНТСТВО{" "}
            <span className="inline-block align-middle h-[1em]">
              <Image
                src="/images/eyes_Group127.png"
                alt="Анимированные глаза"
                width={100}
                height={100}
              />
            </span>{" "}
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>READY GO</span>
          </div>
          <div className="whitespace-nowrap -mt-4">К НАМ ПРИХОДЯТ ЗА</div>

          {/* Слова с анимацией */}
          <div className="relative h-[1.3em] mt-2 overflow-hidden">
            <div
              key={`word-${index}`}
              className={cn(
                "absolute w-full text-center transition-all duration-700",
                isAnimating
                  ? "-translate-y-full opacity-0"
                  : "translate-y-0 opacity-100",
                "ease-[cubic-bezier(0.77,0,0.175,1)]"
              )}
            >
              {currentWord}
            </div>

            <div
              key={`word-next-${index}`}
              className={cn(
                "absolute w-full text-center transition-all duration-700",
                isAnimating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0",
                "ease-[cubic-bezier(0.77,0,0.175,1)]"
              )}
            >
              {nextWord}
            </div>
          </div>
        </div>
      </div>

      {/* Левая картинка */}
      <div className="absolute left-4 sm:-left-6 top-10 z-10" style={leftImageStyle}>
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

      {/* Правая картинка */}
      <div className="absolute -right-4 sm:-right-5 bottom-4 sm:top-20 z-10 mt-60" style={rightImageStyle}>
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
