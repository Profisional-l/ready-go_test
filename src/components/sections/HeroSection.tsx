
'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const keywords = ["СТРАTЕГИЯМИ", "SMM", "BЕб-рAзрAботкOй", "БPЕНДИHГOM", "Kреативом"];
  const [currentKeyword, setCurrentKeyword] = useState(keywords[0]);
  // State to manage animation classes for keywords
  const [keywordAnimClass, setKeywordAnimClass] = useState('translate-y-0 opacity-100');

  useEffect(() => {
    // Initial text appearance animation
    const textAppearTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 100); // Short delay to ensure transition triggers

    // Rotating keywords animation
    let keywordIndex = 0;
    const animationSlideDuration = 300; // Duration for slide out/in
    const wordDisplayDuration = 2700;   // How long a word stays fully visible

    const intervalId = setInterval(() => {
      // Trigger slide out: current word slides up
      setKeywordAnimClass('-translate-y-full opacity-0');

      setTimeout(() => {
        keywordIndex = (keywordIndex + 1) % keywords.length;
        setCurrentKeyword(keywords[keywordIndex]);
        // Prepare for slide in: new word positioned at the bottom, invisible, no transition yet
        setKeywordAnimClass('translate-y-full opacity-0 duration-0'); // duration-0 to snap to position

        // In the next frame, trigger slide in animation
        requestAnimationFrame(() => {
          setKeywordAnimClass('translate-y-0 opacity-100'); // Default duration (300ms) will apply
        });
      }, animationSlideDuration);

    }, wordDisplayDuration + animationSlideDuration); // Total cycle time for a word

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
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[10080px] z-0 leading-none", // Added leading-none for better height calculation
          "transition-all duration-700 ease-out",
          isTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10" // Adjusted initial animation
        )}
      >
        <div className="text-[130px] font-black font-mycustom text-foreground">
          <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
        </div>
        <div className="text-[130px] font-black font-mycustom text-foreground mt-1"> {/* Reduced mt slightly due to leading-none */}
          АГЕНТСТВО{" "}
          <span className="inline-block align-middle h-[1em] w-[1em]"> {/* Ensure span has defined aspect for image */}
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
        <div className="text-[130px] font-black font-mycustom text-foreground mt-1"> {/* Reduced mt slightly */}
          К НАМ ПРИХОДЯТ ЗА
        </div>
        <div className="text-[130px] font-black font-mycustom text-foreground mt-1 h-[1em] overflow-hidden"> {/* Reduced mt, Added fixed height and overflow for sliding animation */}
          <span
            className={cn(
              "inline-block transition-all ease-in-out",
              // Apply animation classes. Duration is 300ms by default unless duration-0 is part of keywordAnimClass
              keywordAnimClass.includes('duration-0') ? 'duration-0' : 'duration-300',
              keywordAnimClass.replace('duration-0', '').trim() // Remove duration-0 if present, apply other classes
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
