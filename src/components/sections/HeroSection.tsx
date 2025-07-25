
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from 'next/dynamic';

const HeroDesktopImages = dynamic(() => import('./HeroDesktopImages'), { ssr: false });
const HeroMobileImages = dynamic(() => import('./HeroMobileImages'), { ssr: false });


export function HeroSection() {
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [eyeStyle, setEyeStyle] = useState<React.CSSProperties>({});
  const mouse = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number | null>(null);
  const eyesRef = useRef<HTMLDivElement>(null);


  // Плавное движение глаз
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      // Движение глаз
      if (eyesRef.current) {
        const eyesRect = eyesRef.current.getBoundingClientRect();
        const eyesCenterX = eyesRect.left + eyesRect.width / 2;
        const eyesCenterY = eyesRect.top + eyesRect.height / 2;

        const angle = Math.atan2(mouse.current.y - eyesCenterY, mouse.current.x - eyesCenterX);
        const distance = 8;
        const eyeX = Math.cos(angle) * distance;
        const eyeY = Math.sin(angle) * distance * 1.7;

        setEyeStyle({
          transform: `translate(${eyeX}px, ${eyeY}px)`,
          transition: "transform 0.22s ease-out",
        });
      }

      animFrame.current = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animFrame.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  const keywordImagesData = [
    { desktop: "/images/svgWords/strategy.svg", mobile: "/images/svgWords/m_strategy.svg" },
    { desktop: "/images/svgWords/smm.svg", mobile: "/images/svgWords/m_smm.svg" },
    { desktop: "/images/svgWords/web.svg", mobile: "/images/svgWords/m_web.svg" },
    { desktop: "/images/svgWords/branding.svg", mobile: "/images/svgWords/m_branding.svg" },
    { desktop: "/images/svgWords/creative.svg", mobile: "/images/svgWords/m_creative.svg" },
    { desktop: "/images/svgWords/production.svg", mobile: "/images/svgWords/m_production.svg" },
    { desktop: "/images/svgWords/merch.svg", mobile: "/images/svgWords/m_merch.svg" },
  ];

  const keywordImages = keywordImagesData.map(item => isMobile ? item.mobile : item.desktop);

  // Плавная смена слов
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % keywordImages.length);
        setIsAnimating(false);
      }, 700);
    }, 3000);

    return () => clearInterval(interval);
  }, [keywordImages.length]);


  const rgSrc = isMobile ? "/images/svgWords/readygo.png" : "/images/svgWords/readygo.svg"
  const weSrc = isMobile ? "/images/svgWords/we.png" : "/images/svgWords/we.svg"

  return (
    <section className="relative h-full w-full bg-background flex items-center justify-center">
      {/* Центрированный контент */}
      <div className="relative px-4 sm:px-8 md:mt-28 lg:mt-0">
        <div className="text-[60px] md:text-[80px] lg:text-[100px] xl:text-[130px] font-black font-mycustom text-center leading-[1] mainScreenTextBlock max-w-[1000px] text-[#0E0E0E]">
          <div className="whitespace-normal lg:-mb-3">
            <span>
              <span
                className="relative inline-block"
                style={{ height: ".83em", width: "calc(303/124 * 1em)" }}
                ref={eyesRef}
              >
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Image
                    src={weSrc}
                    alt="мы"
                    quality={100}
                    priority
                    fill
                    sizes="(max-width: 768px) 150px, 300px"
                    className="object-contain"
                  />
                </div>
              </span>
              DIGITAL
            </span>
          </div>
          <div className="whitespace-normal ">
            АГЕНТСТВО{" "}
            <span
              className="relative inline-block"
              style={{ height: ".83em", width: "calc(95/103 * 1em)" }}
              ref={eyesRef}
            >
              <div
                style={{ position: "relative", height: "100%", width: "100%" }}
              >
                {isMobile ? (
                  <Image
                    src="/images/eyes_Group127.svg"
                    alt="глаза"
                    fill
                    className="object-contain"
                    priority
                    sizes="100px"
                  />
                ) : (
                  <>
                    <Image
                      src="/images/eyes0.svg"
                      alt="глаза"
                      priority
                      fill
                      sizes="100px"
                      className="object-contain"
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "100%",
                        height: "100%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "33%",
                          left: "33%",
                          width: "50%",
                          height: "auto",
                          aspectRatio: "59/35",
                          transform: "translate(-50%, -50%)",
                          ...eyeStyle,
                        }}
                      >
                        <Image
                          src="/images/eyes1.svg"
                          alt="зрачки"
                          priority
                          fill
                          sizes="50px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </span>{" "}
            <span>
              <span
                className="relative inline-block"
                style={{ height: ".83em", width: "calc(390/124 * 1em)" }}
                ref={eyesRef}
              >
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Image
                    src={rgSrc}
                    alt="глаза"
                    quality={100}
                    priority
                    loading="eager"
                    fill
                    sizes="(max-width: 768px) 200px, 400px"
                    className="object-contain"
                  />
                </div>
              </span>
            </span>{" "}
            <div className="lg:-mt-3">
              <span>К НАМ ПРИХОДЯТ ЗА</span>
            </div>
          </div>

          {/* Слова как SVG-изображения с той же анимацией */}
          <div className="relative h-[160px] md:h-[220px] lg:h-[110px] xl:h-[145px] flex items-center justify-center overflow-y-hidden">
            <div className="relative w-full max-w-[1550px] h-full min-h-[60px]">
              {keywordImages.map((src, i) => (
                <div
                  key={`svg-word-${i}`}
                  className={cn(
                    "absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]",
                    index === i && !isAnimating && "translate-y-0 opacity-100",
                    index === i &&
                    isAnimating &&
                    "-translate-y-[140%] opacity-0",
                    index !== i &&
                    (i === (index + 1) % keywordImages.length && isAnimating
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0")
                  )}
                >
                  <Image
                    src={src}
                    alt={`слово ${i}`}
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width: 768px) 90vw, 800px"
                    className="object-contain mt-2 md:mt-3 lg:-mt-1 xl:mt-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isMobile === false && <HeroDesktopImages currentIndex={index} isAnimating={isAnimating} />}
      {isMobile === true && <HeroMobileImages currentIndex={index} />}
      
    </section>
  );
}
