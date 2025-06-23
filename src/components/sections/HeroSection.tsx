"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const keywords = [
    "СТРАТЕГИЯМИ",
    "SMM",
    "ВЕБ-РАЗРАБОТКОЙ",
    "БРЕНДИНГОМ",
    "КРЕАТИВОМ",
    "ПРОДАКШЕНОМ",
    "МЕРЧОМ",
  ];
  
  // Группируем изображения по 2 для каждого ключевого слова
 const imageGroups = [
    [
      { 
        src: "/images/ForHeroSection/back-1.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 305,
        height: 352,
        maxHeight: 352
      },
      { 
        src: "/images/ForHeroSection/back-2.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 308,
        height: 378,
        maxHeight: 378
      }
    ],
    [
      { 
        src: "/images/ForHeroSection/back-3.png", 
        alt: "SMM",
        width: 288,
        height: 360,
        maxHeight: 360
      },
      { 
        src: "/images/ForHeroSection/back-4.png", 
        alt: "SMM",
        width: 302,
        height: 353,
        maxHeight: 420
      }
    ],
    [
      { 
        src: "/images/ForHeroSection/back-5.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 254,
        height: 351,
        maxHeight: 351
      },
      { 
        src: "/images/ForHeroSection/back-6.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 396,
        height: 308,
        maxHeight: 308
      }
    ],
        [
      { 
        src: "/images/ForHeroSection/back-7.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 290,
        height: 364,
        maxHeight: 364
      },
      { 
        src: "/images/ForHeroSection/back-8.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 338,
        height: 338,
        maxHeight: 338
      }
    ],
            [
      { 
        src: "/images/ForHeroSection/back-9.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 387,
        height: 259,
        maxHeight: 259
      },
      { 
        src: "/images/ForHeroSection/back-10.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 311,
        height: 311,
        maxHeight: 311
      }
    ],
            [
      { 
        src: "/images/ForHeroSection/back-11.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 290,
        height: 371,
        maxHeight: 371
      },
      { 
        src: "/images/ForHeroSection/back-12.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 272,
        height: 338,
        maxHeight: 338
      }
    ],
            [
      { 
        src: "/images/ForHeroSection/back-13.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 339,
        height: 339,
        maxHeight: 339
      },
      { 
        src: "/images/ForHeroSection/back-14.png", 
        alt: "СТРАТЕГИЯМИ",
        width: 285,
        height: 359,
        maxHeight: 359
      }
    ],
  ];

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagePosition, setImagePosition] = useState(true);
  const [imageOpacity, setImageOpacity] = useState(1);

  const [leftImageStyle, setLeftImageStyle] = useState<React.CSSProperties>({});
  const [rightImageStyle, setRightImageStyle] = useState<React.CSSProperties>({});
  const [eyeStyle, setEyeStyle] = useState<React.CSSProperties>({});
  const mouse = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number | null>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Плавное движение изображений и глаз
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const { x, y } = mouse.current;

      // Движение фоновых изображений
      const moveX1 = (x - centerX) * 0.01;
      const moveY1 = (y - centerY) * 0.01;
      const moveX2 = (centerX - x) * 0.015;
      const moveY2 = (centerY - y) * 0.015;

      setLeftImageStyle({
        transform: `translate(${moveX1}px, ${moveY1}px)`,
        transition: "transform 0.2s ease-out",
      });

      setRightImageStyle({
        transform: `translate(${moveX2}px, ${moveY2}px)`,
        transition: "transform 0.2s ease-out",
      });

      // Движение глаз
      if (eyesRef.current) {
        const eyesRect = eyesRef.current.getBoundingClientRect();
        const eyesCenterX = eyesRect.left + eyesRect.width / 2;
        const eyesCenterY = eyesRect.top + eyesRect.height / 2;

        const angle = Math.atan2(y - eyesCenterY, x - eyesCenterX);
        const distance = 8;
        const eyeX = Math.cos(angle) * distance;
        const eyeY = Math.sin(angle) * distance * 1.7;

        setEyeStyle({
          transform: `translate(${eyeX}px, ${eyeY}px)`,
          transition: "transform 0.1s ease-out",
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

  // Плавная смена слов и изображений
  useEffect(() => {
    const interval = setInterval(() => {
      // Фаза 1: плавное исчезновение картинок
      setImageOpacity(0);
      
      setTimeout(() => {
        // Фаза 2: мгновенное изменение позиции и изображений
        setImagePosition((prev) => !prev);
        
      }, 400);
       // Фаза 3: плавное появление картинок
        setTimeout(() => {
           setImageOpacity(1);
        }, 650)
    }, 3500);
    
    return () => clearInterval(interval);
  }, []);

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
  const currentImages = imageGroups[index % imageGroups.length];
  const nextImages = imageGroups[(index + 1) % imageGroups.length];

  return (
    <section className="relative min-h-screen w-full bg-background">
      {/* Центрированный контент */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
        <div className="text-[60px] sm:text-[100px] md:text-[130px] font-black font-mycustom text-center leading-[1] -mt-40 mainScreenTextBlock max-w-[1000px]">
          <div className="whitespace-normal">
            <span className="textToBorder">МЫ — </span>DIGITAL
          </div>
          <div className="whitespace-normal mt-2">
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
                    unoptimized={true}
                    layout="fill"
                    objectFit="contain"
                  />
                ) : (
                  <>
                    <Image
                      src="/images/eyes0.svg"
                      alt="глаза"
                      unoptimized={true}
                      layout="fill"
                      objectFit="contain"
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
                          unoptimized={true}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </span>{" "}
            <span className="textToBorder">READY GO.</span> <span>К НАМ ПРИХОДЯТ ЗА</span>
          </div>

          {/* Слова с анимацией */}
          <div className="relative h-[2em] mt-1 overflow-hidden">
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

      {/* Левая картинка с анимацией */}
       <div
        className={cn(
          "absolute left-2 sm:left-4 z-10 transition-all duration-700",
          imagePosition ? 'bottom-56' : 'top-10'
        )}
        style={{
          ...leftImageStyle,
          opacity: imageOpacity,
          transition: 'opacity 0.35s cubic-bezier(0.77,0,0.175,1), transform 0.2s ease-out'
        }}
      >
        <div 
          className="relative overflow-hidden hidden md:block"
          style={{
            width: `${currentImages[0].width}px`,
            height: `${currentImages[0].height}px`
          }}
        >
          <div className="w-full h-full rounded-[12px] overflow-hidden">
            <Image
              src={currentImages[0].src}
              alt={currentImages[0].alt}
              unoptimized={true}
              width={currentImages[0].width}
              height={currentImages[0].height}
              className="w-full h-full object-cover"
              style={{ maxHeight: `${currentImages[0].maxHeight}px` }}
            />
          </div>
        </div>
      </div>

      {/* Правая картинка с анимацией */}
      <div
        className={cn(
          "absolute -right-4 sm:-right-5 z-10 transition-all duration-700",
          imagePosition ? 'top-10' : 'bottom-48'
        )}
        style={{
          ...rightImageStyle,
          opacity: imageOpacity,
          transition: 'opacity 0.35s cubic-bezier(0.77,0,0.175,1), transform 0.2s ease-out'
        }}
      >
        <div 
          className="relative overflow-hidden hidden md:block"
          style={{
            width: `${currentImages[1].width}px`,
            height: `${currentImages[1].height}px`
          }}
        >
          <div className="w-full h-full rounded-[12px] overflow-hidden">
            <Image
              src={currentImages[1].src}
              alt={currentImages[1].alt}
              unoptimized={true}
              width={currentImages[1].width}
              height={currentImages[1].height}
              className="w-full h-full object-cover"
              style={{ maxHeight: `${currentImages[1].maxHeight}px` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}