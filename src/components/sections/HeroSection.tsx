'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const keywords = ["СТРАTЕГИЯМИ", "SMM", "BЕб-рAзрAботкOй", "БPЕНДИHГOM", "Kреативом"];
  const [currentKeyword, setCurrentKeyword] = useState(keywords[0]);
  const [isKeywordFading, setIsKeywordFading] = useState(false); // Controls the fade transition state

  useEffect(() => {
    // Initial text appearance animation
    const textAppearTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 100); // Short delay to ensure transition triggers

    // Rotating keywords animation
    let keywordIndex = 0;
    const wordDisplayDuration = 2700; // How long a word stays fully visible
    const fadeDuration = 300;       // How long the fade transition takes

    const intervalId = setInterval(() => {
      setIsKeywordFading(true); // Trigger fade out (opacity becomes 0)

      setTimeout(() => {
        keywordIndex = (keywordIndex + 1) % keywords.length;
        setCurrentKeyword(keywords[keywordIndex]);
        setIsKeywordFading(false); // Trigger fade in (opacity becomes 1)
      }, fadeDuration); // Wait for fade out to complete before changing word and starting fade in

    }, wordDisplayDuration + fadeDuration); // Total cycle time for a word

    return () => {
      clearTimeout(textAppearTimer);
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array, runs once on mount

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Text Block - Centered */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[10080px] z-0",
          "transition-all duration-700 ease-out", // Animation properties for slide up
          isTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20" // Target and initial states for slide up
        )}
        style={{ lineHeight: 1.05 }}
      >
        <div className="text-[130px] font-black font-mycustom text-foreground">
          <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
        </div>
        <div className="text-[130px] font-black font-mycustom text-foreground mt-3">
          АГЕНТСТВО{" "}
          <span className="inline-block align-middle h-[1em]"> {/* Adjusted for vertical alignment */}
            <Image
              src="/images/eyes_Group127.png"
              alt="Анимированные глаза" // More descriptive alt text
              width={130} // Adjusted to better fit inline with 130px text
              height={130} // Adjusted
              objectFit="contain"
              className="h-full w-auto" // Image will scale within the span's height
              data-ai-hint="animated eyes logo" // Updated AI hint
            />
          </span>{" "}
          <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>READY GO</span>
        </div>
        <div className="text-[130px] font-black font-mycustom text-foreground mt-3">
          К НАМ ПРИХОДЯТ ЗА
        </div>
        <div className="text-[130px] font-black font-mycustom text-foreground mt-3">
          <span
            className={cn(
              "inline-block transition-opacity duration-300 ease-in-out",
              isKeywordFading ? "opacity-0" : "opacity-100" // Apply opacity based on fading state
            )}
          >
            {currentKeyword}
          </span>
        </div>
      </div>

      {/* Left Image (Hoodie) */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="relative w-[365px] rounded-xl overflow-hidden">
          <Image
            src="/images/back-1.png" // Placeholder, original aspect ratio maintained by height:auto
            alt="Черное худи с бирюзовым принтом"
            width={365}
            height={365} // Approximate height, actual height will be auto based on width
            objectFit="contain"
            className="w-full h-auto"
            data-ai-hint="black hoodie turquoise print"
          />
        </div>
      </div>

      {/* Right Image (3D Card) */}
      <div className="absolute right-8 bottom-8 z-10">
        <div className="relative w-[360px] h-[450px]  overflow-hidden">
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
