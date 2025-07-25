
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroSection() {
  // Группируем изображения по 2 для каждого ключевого слова
  const imageGroups = [
    [
      {
        src: "/images/ForHeroSection/back-1.webp",
        alt: "СТРАТЕГИЯМИ",
        width: 305,
        height: 352,
        maxHeight: 352,
      },
      {
        src: "/images/ForHeroSection/back-2.webp",
        alt: "СТРАТЕГИЯМИ",
        width: 308,
        height: 388,
        maxHeight: 378,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-3.webp",
        alt: "SMM",
        width: 288,
        height: 360,
        maxHeight: 360,
      },
      {
        src: "/images/ForHeroSection/back-4.webp",
        alt: "SMM",
        width: 302,
        height: 353,
        maxHeight: 420,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-5.webp",
        alt: "СТРАТЕГИЯМИ",
        width: 254,
        height: 351,
        maxHeight: 351,
      },
      {
        src: "/images/ForHeroSection/back-6.png",
        alt: "СТРАТЕГИЯМИ",
        width: 396,
        height: 308,
        maxHeight: 308,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-7.webp",
        alt: "СТРАТЕГИЯМИ",
        width: 290,
        height: 364,
        maxHeight: 364,
      },
      {
        src: "/images/ForHeroSection/back-8.png",
        alt: "СТРАТЕГИЯМИ",
        width: 338,
        height: 338,
        maxHeight: 338,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-9.png",
        alt: "СТРАТЕГИЯМИ",
        width: 387,
        height: 259,
        maxHeight: 259,
      },
      {
        src: "/images/ForHeroSection/back-10.png",
        alt: "СТРАТЕГИЯМИ",
        width: 311,
        height: 311,
        maxHeight: 311,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-11.webp",
        alt: "СТРАТЕГИЯМИ",
        width: 290,
        height: 371,
        maxHeight: 371,
      },
      {
        src: "/images/ForHeroSection/back-12.webp",
        alt: "СТРАТЕГИЯМИ",
        width: 272,
        height: 338,
        maxHeight: 338,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-13.png",
        alt: "СТРАТЕГИЯМИ",
        width: 339,
        height: 339,
        maxHeight: 339,
      },
      {
        src: "/images/ForHeroSection/back-14.webp",
        alt: "СТРАТЕГИЯМИ",
        width: 285,
        height: 359,
        maxHeight: 359,
      },
    ],
  ];

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagePosition, setImagePosition] = useState(true);
  const [imageOpacity, setImageOpacity] = useState(1);

  const [leftImageStyle, setLeftImageStyle] = useState<React.CSSProperties>({});
  const [rightImageStyle, setRightImageStyle] = useState<React.CSSProperties>(
    {}
  );
  const [eyeStyle, setEyeStyle] = useState<React.CSSProperties>({});
  const mouse = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number | null>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isMid, setIsMid] = useState(false);

  const imgSizeIndex = 1.2;

    useEffect(() => {
    const checkMid = () => {
      setIsMid(window.innerWidth < 1400);
    };

    checkMid();
    window.addEventListener("resize", checkMid);
    return () => window.removeEventListener("resize", checkMid);
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
      if (!isMobile) {
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
      }

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
  }, [isMobile]);

  // Плавная смена слов и изображений
  useEffect(() => {
    const interval = setInterval(() => {
      // Фаза 1: плавное исчезновение картинок
      setImageOpacity(0);
      setTimeout(() => {
        setIsAnimating(true);
      }, 60);
      setTimeout(() => {
        setImagePosition((prev) => !prev);
      }, 360);
      setTimeout(() => {
        // Фаза 2: мгновенное изменение позиции и изображений
        setIndex((prev) => (prev + 1) % keywordImages.length);
        setIsAnimating(false);
      }, 700);
      // Фаза 3: плавное появление картинок
      setTimeout(() => {
        setImageOpacity(1);
      }, 700);
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  const keywordImages = [
    "/images/svgWords/strategy.svg",
    "/images/svgWords/smm.svg",
    "/images/svgWords/web.svg",
    "/images/svgWords/branding.svg",
    "/images/svgWords/creative.svg",
    "/images/svgWords/production.svg",
    "/images/svgWords/merch.svg",
  ].map((image) =>
    isMobile ? image.replace("/images/svgWords/", "/images/svgWords/m_") : image
  );

  // Теперь keywordImages содержит пути с приставкой m_ для мобильных устройств

  useEffect(() => {
    if (typeof window === "undefined") return;

    const svgCache: Record<string, HTMLImageElement> = {};
    const imagesToCache = [
      "/images/svgWords/strategy.svg",
      "/images/svgWords/smm.svg",
      "/images/svgWords/web.svg",
      "/images/svgWords/branding.svg",
      "/images/svgWords/creative.svg",
      "/images/svgWords/production.svg",
      "/images/svgWords/merch.svg",
    ];

    imagesToCache.forEach((image) => {
      const path = isMobile
        ? image.replace("/images/svgWords/", "/images/svgWords/m_")
        : image;

      if (!svgCache[path]) {
        const img = new window.Image();
        img.src = path;
        svgCache[path] = img;
      }
    });

    // Если хочешь использовать потом: svgCacheRef.current = svgCache
  }, [isMobile]);

  const currentWord = keywordImages[index];
  const nextWord = keywordImages[(index + 1) % keywordImages.length];
  const currentImages = imageGroups[index % imageGroups.length];
  const nextImages = imageGroups[(index + 1) % imageGroups.length];
  // const svgWidth = whatWidth ? 910 : 240
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
                    layout="fill"
                    objectFit="contain"
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
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                ) : (
                  <>
                    <Image
                      src="/images/eyes0.svg"
                      alt="глаза"
                      priority
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
                          priority
                          layout="fill"
                          objectFit="contain"
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
                    layout="fill"
                    objectFit="contain"
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
                    className="object-contain mt-2 md:mt-3 lg:-mt-1 xl:mt-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isMobile && (
        <>
          {/* Левая картинка с анимацией */}
          {imageGroups.map((group, groupIndex) => {
            const leftImagePositionArray = [true, false, true, false, false, false, true];
            const isBottomPosition = leftImagePositionArray[groupIndex]; 

            return (
              <div
                key={`left-image-${groupIndex}`}
                className={cn(
                  "absolute left-9 lg:left-10 z-100 transition-all duration-700 HeroLeftImg",
                  isBottomPosition ? "top-[53%] HeroImgAdapt" : "top-24"
                )}
                style={{
                  ...leftImageStyle,
                  opacity: index === groupIndex ? imageOpacity : 0,
                  pointerEvents: index === groupIndex ? "auto" : "none",
                  transition:
                    "opacity 0.22s cubic-bezier(0.77,0,0.175,1), transform 0.2s ease-out",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                      width: `${isMid ? group[0].width / imgSizeIndex : group[0].width}px`,
                      height: `${isMid ? group[0].height / imgSizeIndex : group[0].height}px`,
                  }}
                >
                  <div className="w-full h-full rounded-[12px] overflow-hidden">
                    <Image
                      src={group[0].src}
                      alt={group[0].alt}
                      priority
                      width={group[0].width}
                      height={group[0].height}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Правая картинка с анимацией */}
          {imageGroups.map((group, groupIndex) => {
            const imagePositionArray = [true, false, true, false, false, false, true]; 
            const isTopPosition = imagePositionArray[groupIndex]; 

            return (
              <div
                key={`right-image-${groupIndex}`}
                className={cn(
                  "absolute md:right-7 lg:right-12 z-100 transition-all duration-500 HeroRightImg",
                  isTopPosition ? "top-24  RightHeroImgAdapt" : "top-[53%] HeroImgAdapt"
                )}
                style={{
                  ...rightImageStyle,
                  opacity: index === groupIndex ? imageOpacity : 0,
                  pointerEvents: index === groupIndex ? "auto" : "none", 
                  transition:
                    "opacity 0.22s cubic-bezier(0.77,0,0.175,1), transform 0.2s ease-out",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: `${isMid ? group[1].width / imgSizeIndex : group[1].width}px`,
                    height: `${isMid ? group[1].height / imgSizeIndex : group[1].height}px`,
                  }}
                >
                  <div className="w-full h-full rounded-[12px] overflow-hidden">
                    <Image
                      src={group[1].src}
                      alt={group[1].alt}
                      priority
                      width={group[1].width}
                      height={group[1].height}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}

    