
'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const keywords = ["СТРАTЕГИЯМИ", "SMM", "BЕб-рAзрAботкOй", "БPЕНДИHГOM", "Kреативом"];
  const [currentKeyword, setCurrentKeyword] = useState(keywords[0]);
  // State for animation classes: transform, opacity, and transition behavior
  const [keywordAnimClass, setKeywordAnimClass] = useState('translate-y-0 opacity-100');

  useEffect(() => {
    const textAppearTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 100);

    let keywordIndex = 0;
    const animationSlideDuration = 300; // Duration for slide in/out
    const wordDisplayDuration = 2700;   // How long a word stays visible before animating out

    const intervalId = setInterval(() => {
      // 1. Current word slides UP and FADES OUT
      setKeywordAnimClass('-translate-y-full opacity-0 transition-transform transition-opacity duration-300 ease-in-out');

      setTimeout(() => {
        keywordIndex = (keywordIndex + 1) % keywords.length;
        setCurrentKeyword(keywords[keywordIndex]);

        // 2. New word is INSTANTLY set at the bottom, invisible (NO animation for this step)
        //    'transition-none' is key here to prevent animating from the old -translate-y-full position
        setKeywordAnimClass('translate-y-full opacity-0 transition-none');

        // 3. Force a reflow or wait for the next frame to apply new transition classes for the IN-animation
        requestAnimationFrame(() => {
          // New word slides UP and FADES IN
          setKeywordAnimClass('translate-y-0 opacity-100 transition-transform transition-opacity duration-300 ease-in-out');
        });
      }, animationSlideDuration); // Wait for the out-animation to complete

    }, wordDisplayDuration); // Time from start of one word's full display to start of its out-animation

    return () => {
      clearTimeout(textAppearTimer);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Text Block - Centered */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-0",
          "transition-all duration-700 ease-out",
          isTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="text-[130px] font-black font-mycustom text-foreground leading-none">
          <div>
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
          </div>
          <div className="mt-0">
            АГЕНТСТВО{" "}
            <span className="inline-block align-middle h-[1em] w-[1em]">
              <Image
                src="/images/eyes_Group127.png"
                alt="Анимированные глаза"
                width={130}
                height={130}
                objectFit="contain"
                className="h-full w-full"
                data-ai-hint="animated eyes logo"
              />
            </span>{" "}
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>READY GO</span>
          </div>
          <div className="mt-0">
            К НАМ ПРИХОДЯТ ЗА
          </div>
          <div className="mt-0 h-[1em] overflow-hidden"> {/* Container for animated keyword */}
            <span
              className={cn(
                "inline-block", // Base style
                keywordAnimClass    // Dynamic animation classes
              )}
            >
              {currentKeyword}
            </span>
          </div>
        </div>
      </div>

      {/* Left Image (Hoodie) */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="relative w-[365px] rounded-xl overflow-hidden">
          <Image
            src="/images/back-1.png"
            alt="Черное худи с бирюзовым принтом"
            width={365}
            height={365}
            objectFit="contain"
            className="w-full h-auto"
            data-ai-hint="black hoodie turquoise print"
          />
        </div>
      </div>

      {/* Right Image (3D Card) */}
      <div className="absolute right-8 bottom-8 z-10">
        <div className="relative w-[360px] h-[450px] overflow-hidden">
          <Image
            src="/images/back-2.png"
            alt="3D рендер карточки Progress on velocity"
            layout="fill"
            objectFit="cover"
            data-ai-hint="3d card progress dashboard"
          />
        </div>
      </div>
    </section>
  );
}
