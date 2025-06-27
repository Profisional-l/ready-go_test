"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  // const keywords = [
  //   "СТРАТЕГИЯМИ",
  //   "SMM",
  //   "ВЕБ-РАЗРАБОТКОЙ",
  //   "БРЕНДИНГОМ",
  //   "КРЕАТИВОМ",
  //   "ПРОДАКШЕНОМ",
  //   "МЕРЧОМ",
  // ];

  // Группируем изображения по 2 для каждого ключевого слова
  const imageGroups = [
    [
      {
        src: "/images/ForHeroSection/back-1.png",
        alt: "СТРАТЕГИЯМИ",
        width: 305,
        height: 352,
        maxHeight: 352,
      },
      {
        src: "/images/ForHeroSection/back-2.png",
        alt: "СТРАТЕГИЯМИ",
        width: 308,
        height: 388,
        maxHeight: 378,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-3.png",
        alt: "SMM",
        width: 288,
        height: 360,
        maxHeight: 360,
      },
      {
        src: "/images/ForHeroSection/back-4.png",
        alt: "SMM",
        width: 302,
        height: 353,
        maxHeight: 420,
      },
    ],
    [
      {
        src: "/images/ForHeroSection/back-5.png",
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
        src: "/images/ForHeroSection/Comp-12.gif",
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
  const imageCache = useRef<Record<string, HTMLImageElement>>({});

  const [leftImageStyle, setLeftImageStyle] = useState<React.CSSProperties>({});
  const [rightImageStyle, setRightImageStyle] = useState<React.CSSProperties>(
    {}
  );
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cache: Record<string, HTMLImageElement> = {};
    imageGroups.flat().forEach(({ src }) => {
      if (!cache[src]) {
        const img = new window.Image();
        img.src = src;
        cache[src] = img;
      }
    });
    imageCache.current = cache;
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

  return (
    <section className="relative min-h-screen w-full bg-background">
      {/* Центрированный контент */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
        <div className="text-[60px] md:text-[130px] font-black font-mycustom text-center leading-[1] -mt-10 md:-mt-44 mainScreenTextBlock max-w-[1000px] text-[#0E0E0E]">
          <div className="whitespace-normal md:-mb-3">
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
                    src="/images/svgWords/we.svg"
                    alt="глаза"
                    unoptimized={true}
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
                    src="/images/svgWords/readygo.svg"
                    alt="глаза"
                    unoptimized={true}
                    quality={100}
                    priority
                    loading="eager"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </span>
            </span>{" "}
            <div className="md:-mt-3">
              <span>К НАМ ПРИХОДЯТ ЗА</span>
            </div>
          </div>

          {/* Слова как SVG-изображения с той же анимацией */}
          <div className="relative h-[160px] md:h-[135px] flex items-center justify-center overflow-y-hidden">
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
                    unoptimized
                    priority
                    loading="eager"
                    className="object-contain mt-2 md:mt-3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Левая картинка с анимацией */}
      {/* Отрисовываем все изображения сразу, но показываем только нужные */}
      {imageGroups.map((group, groupIndex) => {
        // Допустим, у тебя есть массив для позиции левых картинок
        const leftImagePositionArray = [true, false, true, false];
        const isBottomPosition = leftImagePositionArray[groupIndex]; // true => bottom-56, false => top-10

        return (
          <div
            key={`left-image-${groupIndex}`}
            className={cn(
              "absolute left-2 sm:left-4 z-10 transition-all duration-700",
              isBottomPosition ? "bottom-56" : "top-10"
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
              className="relative overflow-hidden hidden md:block"
              style={{
                width: `${group[0].width}px`,
                height: `${group[0].height}px`,
              }}
            >
              <div className="w-full h-full rounded-[12px] overflow-hidden">
                <Image
                  src={group[0].src}
                  alt={group[0].alt}
                  unoptimized={true}
                  priority
                  loading="eager"
                  width={group[0].width}
                  height={group[0].height}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: `${group[0].maxHeight}px` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Правая картинка с анимацией */}
      {imageGroups.map((group, groupIndex) => {
        const imagePositionArray = [true, false, true, false]; // true — top-10, false — bottom-48

        // Условие для позиции: меняем top/bottom в зависимости от imagePosition или чего-то подобного, для каждого индекса
        const isTopPosition = imagePositionArray[groupIndex]; // например, булевый массив с позициями для каждого индекса
        return (
          <div
            key={`right-image-${groupIndex}`}
            className={cn(
              "absolute -right-4 sm:-right-5 z-10 transition-all duration-500",
              isTopPosition ? "top-10" : "bottom-48"
            )}
            style={{
              ...rightImageStyle,
              opacity: index === groupIndex ? imageOpacity : 0,
              pointerEvents: index === groupIndex ? "auto" : "none", // Чтобы скрытые не мешали кликам
              transition:
                "opacity 0.22s cubic-bezier(0.77,0,0.175,1), transform 0.2s ease-out",
            }}
          >
            <div
              className="relative overflow-hidden hidden md:block"
              style={{
                width: `${group[1].width}px`,
                height: `${group[1].height}px`,
              }}
            >
              <div className="w-full h-full rounded-[12px] overflow-hidden">
                <Image
                  src={group[1].src}
                  alt={group[1].alt}
                  unoptimized
                  priority
                  loading="eager"
                  width={group[1].width}
                  height={group[1].height}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: `${group[1].maxHeight}px` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
