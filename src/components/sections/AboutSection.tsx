"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const images = [
  "/images/ForAbout/about1.png",
  "/images/ForAbout/about2.png",
  "/images/ForAbout/about3.png",
  "/images/ForAbout/about4.png",
  "/images/ForAbout/about5.png",
  "/images/ForAbout/about6.png",
  "/images/ForAbout/about7.png",
  "/images/ForAbout/about8.png",
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

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="max-w-[1380px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-16">
          {/* Текстовый блок */}
          <div
            ref={textBlockRef}
            className="md:w-4/6 flex flex-col justify-between"
          >
            <h2 className="text-6xl md:text-[130px] font-mycustom mb-10">
              О НАС
            </h2>
            <p className="text-[18px] md:text-[33px]">
              Когда-то наша команда из Минска была частью Red Graphic —
              агентства с 30-летней историей. <br />
              Мы любим и умеем работать с крупными брендами. Однажды мы женили
              людей в KFC, делали витрину для ТЦ в Витебске и запускали
              шестиметровый дирижабль в центре Минска.
            </p>
          </div>

          {/* Блок с картинкой */}
          <div
            className="m-0 mt-10 md:mt-[30px] md:w-3/6 w-full aspect-square relative overflow-hidden rounded-xl shadow-lg"
            style={hoverStyle}
          >
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`About image ${index}`}
                fill
                unoptimized={true}
                className={`object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
