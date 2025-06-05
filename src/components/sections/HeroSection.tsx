
'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const keywords = ["СТРАTЕГИЯМИ", "SMM", "BЕб-рAзрAботкOй", "БPЕНДИHГOM", "Kреативом"];
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [currentKeyword, setCurrentKeyword] = useState(keywords[0]);

  // Animation states for the keyword:
  // 'visible': current word is shown, or animating in.
  // 'exiting': current word is animating out (sliding up).
  // 'entering': new word is positioned below (instantly, no transition), ready to slide in.
  const [animationState, setAnimationState] = useState<'visible' | 'exiting' | 'entering'>('visible');

  useEffect(() => {
    const textAppearTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 100);

    const totalCycleDuration = 3000; // A new word will be fully visible roughly every 3 seconds.
    const animationSlideDuration = 300; // Duration for slide in/out.
    // Static display time = totalCycleDuration - animationSlideDuration (exit) - animationSlideDuration (entry)
    // This isn't directly used for setInterval, but good for understanding.

    const intervalId = setInterval(() => {
      setAnimationState('exiting'); // Start exiting animation for the current word

      setTimeout(() => {
        // This block runs after the 'exiting' animation has completed.
        setKeywordIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % keywords.length;
          setCurrentKeyword(keywords[nextIndex]); // Update to the new keyword
          return nextIndex;
        });
        setAnimationState('entering'); // Position the new keyword below, ready to enter (instantly, no animation yet)

        // Force a reflow or wait for the next frame to apply 'entering' state with 'transition-none'
        // before switching to 'visible' state which will trigger the entrance animation.
        requestAnimationFrame(() => {
          setAnimationState('visible'); // Trigger the entrance animation for the new keyword
        });

      }, animationSlideDuration); // Wait for the exit animation to complete

    }, totalCycleDuration); // The interval at which the entire change cycle restarts

    return () => {
      clearTimeout(textAppearTimer);
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Determine animation classes based on the current state
  let keywordBaseClasses = "inline-block";
  let keywordPositionAndTransitionClasses = "";

  if (animationState === 'visible') {
    // Word is fully visible or animating in
    keywordPositionAndTransitionClasses = "translate-y-0 opacity-100 transition-transform transition-opacity duration-300 ease-in-out";
  } else if (animationState === 'exiting') {
    // Word is animating out (sliding up)
    keywordPositionAndTransitionClasses = "-translate-y-full opacity-0 transition-transform transition-opacity duration-300 ease-in-out";
  } else if (animationState === 'entering') {
    // New word is positioned below, invisible, and importantly, with no transition for this specific state.
    // This allows it to "snap" into place before the 'visible' state animates it in.
    keywordPositionAndTransitionClasses = "translate-y-full opacity-0 transition-none";
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Text Block - Centered */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-0",
          "transition-all duration-700 ease-out",
          isTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5" // Adjusted initial translate-y
        )}
      >
        <div className="text-[130px] font-black font-mycustom text-foreground leading-none">
          <div>
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
          </div>
          <div> {/* Removed mt-0, leading-none should handle spacing */}
            АГЕНТСТВО{" "}
            <span className="inline-block align-middle h-[1em] w-[1em]"> {/* Ensure image scales with text */}
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
          <div> {/* Removed mt-0 */}
            К НАМ ПРИХОДЯТ ЗА
          </div>
          <div className="h-[1em] overflow-hidden"> {/* Container for animated keyword, mt-0 removed */}
            <span className={cn(keywordBaseClasses, keywordPositionAndTransitionClasses)}>
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
