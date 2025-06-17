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
  ];
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
      setIsMobile(window.innerWidth < 768); // 768px - стандартный брейкпойнт для mobile
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
        const distance = 8; // Максимальное смещение зрачков
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
        <div className="text-[60px] sm:text-[100px] md:text-[130px] font-black font-mycustom text-center leading-[1] -mt-40 mainScreenTextBlock">
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
                  // Мобильная версия - просто статичное изображение
                  <Image
                    src="/images/eyes_Group127.png"
                    alt="глаза"
                    layout="fill"
                    objectFit="contain"
                  />
                ) : (
                  // Десктопная версия с анимацией
                  <>
                    <Image
                      src="/images/eyes0.png"
                      alt="глаза"
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
                          src="/images/eyes1.png"
                          alt="зрачки"
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
          {/* <div className="md:-mt-4"></div> */}

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

      {/* Левая картинка */}
      <div
        className="absolute left-2 sm:left-4 top-10 sm:top-10 z-10"
        style={leftImageStyle}
      >
        <div className="relative w-[180px] sm:w-[260px] md:w-[365px] rounded-xl overflow-hidden hidden md:block">
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
      <div
        className="absolute -right-4 sm:-right-5 bottom-4 sm:top-20 z-10 mt-60"
        style={rightImageStyle}
      >
        <div className="relative w-[180px] sm:w-[280px] md:w-[360px] h-[280px] sm:h-[400px] md:h-[450px] overflow-hidden hidden md:block">
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
