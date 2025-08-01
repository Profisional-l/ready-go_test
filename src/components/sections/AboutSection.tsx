"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIsMac } from "@/hooks/isSafari";

const images = [
  "/images/ForAbout/about1 (1).webp",
  "/images/ForAbout/about2 (1).webp",
  "/images/ForAbout/about4 (1).webp",
  "/images/ForAbout/about5 (1).webp",
  "/images/ForAbout/about6 (1).webp",
  "/images/ForAbout/about8 (1).webp",
];

export function AboutSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [blockHeight, setBlockHeight] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const textBlockRef = useRef<HTMLDivElement | null>(null);

  // Автосмена изображений
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Эффект парения
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const { x, y } = mouse.current;

      const moveX = (x - centerX) * 0.01;
      const moveY = (y - centerY) * 0.01;

      setHoverStyle({
        transform: `translate(${moveX}px, ${moveY}px)`,
        transition: "transform 0.2s ease-out",
      });

      requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Получаем высоту текстового блока
  useEffect(() => {
    const updateHeight = () => {
      if (textBlockRef.current) {
        setBlockHeight(textBlockRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const isSafariOrIOS = useIsMac();

  return (
    <section className="py-16 md:py-24 mt-[45px] mb-[30px]">
      <div className="m-0 max-w-[100%]">
        <div className="flex flex-col lg:flex-row md:items-center">
          {/* Текстовый блок */}
          <div
            ref={textBlockRef}
            className="md:w-4/6 about-block-adapt flex flex-col max-w-[330px] md:max-w-none"
          >
            <h2
              className={`text-[60px] md:text-[70px] lg:text-[90px] xl:text-[12vh] 2xl:text-[9.5vh] font-mycustom mb-7 ${isSafariOrIOS ? "safari-fix" : ""
                }`}
            >
              О НАС
            </h2>
            <p className="leading-[1.21em] mb-[15px] text-[18px] md:text-[33px] font-medium tight-spacing-3">
              Новое и креативное — наша  стихия.
            </p>
            <p className="leading-[1.21em] mb-[15px] text-[18px] md:text-[33px] font-medium tight-spacing-3">
              Однажды мы женили людей в KFC, делали{" "}
              <br className="hidden xl:inline" /> витрину для ТЦ в Витебске  и
              запускали <br className="hidden xl:inline" /> шестиметровый
              дирижабль в центре Минска.
            </p>
            <p className="leading-[1.21em] text-[18px] md:text-[33px] font-medium tight-spacing-3">
              Мы любим и умеем работать  с крупными{" "}
              <br className="hidden xl:inline" />
              брендами. Наша  команда из Минска была{" "}
              <br className="hidden xl:inline" /> частью  Red Graphic — агентства
              с 30-летней <br className="hidden xl:inline" /> историей.
            </p>
          </div>

          {/* Блок с картинкой */}
          <div
            className="m-0 -mt-8 md:mt-[0px] md:w-3/6 w-full aspect-square relative overflow-hidden rounded-xl"
            style={{ ...hoverStyle, maxWidth: "578px" }} // Добавлено maxWidth
          >
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`About image ${index}`}
                fill
                unoptimized={true}
                className={`object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
