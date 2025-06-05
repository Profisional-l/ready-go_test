
'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [isMainTextVisible, setIsMainTextVisible] = useState(false);

  const keywords = ["СТРАТЕГИЯМИ", "SMM", "BЕб-рAзрAботкOй", "БPЕНДИHГOM", "Kреативом"];
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  // 'in': keyword is fully visible or sliding in
  // 'out': keyword is sliding out
  // 'prepare': new keyword is positioned below, ready to slide in (no transition)
  const [keywordAnimationState, setKeywordAnimationState] = useState<'in' | 'out' | 'prepare'>('in');

  // Main text entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMainTextVisible(true);
    }, 100); // Short delay before main text starts appearing
    return () => clearTimeout(timer);
  }, []);

  // Keyword cycling and animation logic
  useEffect(() => {
    const displayDuration = 2700; // How long a keyword stays visible
    const animationDuration = 300; // Duration of the slide animation (in/out)

    const cycle = () => {
      setKeywordAnimationState('out'); // Trigger slide-out animation

      setTimeout(() => {
        // This block executes after the slide-out animation (animationDuration)
        setCurrentKeywordIndex((prevIndex) => (prevIndex + 1) % keywords.length);
        setKeywordAnimationState('prepare'); // Instantly position the new keyword below, ready for slide-in

        // requestAnimationFrame ensures that the 'prepare' state (with transition-none)
        // is rendered before we switch to 'in' state (which re-enables transitions)
        requestAnimationFrame(() => {
          setKeywordAnimationState('in'); // Trigger slide-in animation for the new keyword
        });
      }, animationDuration);
    };

    // Start the cycle after the initial keyword has been displayed for displayDuration
    const intervalId = setInterval(cycle, displayDuration + animationDuration);

    return () => clearInterval(intervalId);
  }, [keywords.length]); // Re-run effect if keywords array length changes

  // Determine dynamic classes for keyword animation
  let keywordDynamicClasses = "";
  if (keywordAnimationState === 'in') {
    // Sliding in or fully visible
    keywordDynamicClasses = "translate-y-0 opacity-100 transition-transform transition-opacity duration-300 ease-in-out";
  } else if (keywordAnimationState === 'out') {
    // Sliding out (upwards)
    keywordDynamicClasses = "-translate-y-full opacity-0 transition-transform transition-opacity duration-300 ease-in-out";
  } else if (keywordAnimationState === 'prepare') {
    // Positioned below, invisible, no transition (ready to slide in)
    keywordDynamicClasses = "translate-y-full opacity-0 transition-none";
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Text Block - Centered */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-0",
          // Main text entrance animation classes
          "transition-all duration-700 ease-out",
          isMainTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        <div className="text-[130px] font-black font-mycustom text-foreground leading-none">
          <div>
            <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
          </div>
          <div>
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
          <div>
            К НАМ ПРИХОДЯТ ЗА
          </div>
          {/* Container for the animated keyword. h-[1em] and overflow-hidden are crucial for the effect. */}
          <div className="h-[1em] overflow-hidden relative">
            <span className={cn("inline-block", keywordDynamicClasses)}>
              {keywords[currentKeywordIndex]}
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
