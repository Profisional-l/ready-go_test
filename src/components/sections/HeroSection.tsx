
'use client';

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const keywords = ["СТРАТЕГИЯМИ", "SMM", "ВЕБ-РАЗРАБОТКОЙ", "БРЕНДИНГОМ", "КРЕАТИВОМ"];
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [keywordAnimationState, setKeywordAnimationState] = useState<'in' | 'out' | 'prepare'>('in');
  const [heroTextVisible, setHeroTextVisible] = useState(false);

  const [leftImageStyle, setLeftImageStyle] = useState<React.CSSProperties>({});
  const [rightImageStyle, setRightImageStyle] = useState<React.CSSProperties>({});

  const animationDuration = 500; // ms
  const displayDuration = 2500; // ms (3000ms total cycle - 500ms for animation)

  useEffect(() => {
    setHeroTextVisible(true); // Trigger intro animation for text

    const interval = setInterval(() => {
      setKeywordAnimationState('out'); // Start fade out

      setTimeout(() => {
        setKeywordAnimationState('prepare'); // Prepare next word (move down, set opacity 0, no transition)
        setCurrentKeywordIndex((prevIndex) => (prevIndex + 1) % keywords.length);

        requestAnimationFrame(() => { // Ensure 'prepare' state is rendered
          setKeywordAnimationState('in'); // Start fade in for new word
        });
      }, animationDuration);
    }, displayDuration + animationDuration); // Total cycle time

    return () => clearInterval(interval);
  }, [keywords.length]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate movement based on cursor position from center
      const moveX1 = (clientX - centerX) * 0.01; // Left image moves with cursor slightly
      const moveY1 = (clientY - centerY) * 0.01;

      const moveX2 = (centerX - clientX) * 0.015; // Right image moves opposite to cursor, slightly more
      const moveY2 = (centerY - clientY) * 0.015;

      setLeftImageStyle({
        transform: `translate(${moveX1}px, ${moveY1}px)`,
      });
      setRightImageStyle({
        transform: `translate(${moveX2}px, ${moveY2}px)`,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  const currentWord = keywords[currentKeywordIndex];

  let keywordClasses = "absolute inset-0 text-center transition-transform transition-opacity duration-500 ease-in-out";
  if (keywordAnimationState === 'in') {
    keywordClasses += " translate-y-0 opacity-100";
  } else if (keywordAnimationState === 'out') {
    keywordClasses += " -translate-y-full opacity-0";
  } else { // prepare
    keywordClasses += " translate-y-full opacity-0 transition-none";
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Centered content */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-all duration-1000 ease-out",
        heroTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        <div className="text-[13vw] sm:text-[100px] md:text-[130px] font-black font-mycustom text-center text-foreground leading-none">
          <div className="whitespace-nowrap">
            <span style={{ color: "var(--background)", WebkitTextStroke: "3.3px hsl(var(--foreground))" }}>МЫ — </span>DIGITAL
          </div>
          <div className="whitespace-nowrap">
            АГЕНТСТВО{" "}
            <span className="inline-block align-middle h-[0.8em] w-[0.8em] relative top-[-0.05em]"> {/* Adjusted size and position */}
              <Image
                src="/images/eyes_Group127.png"
                alt="Анимированные глаза"
                width={100} // Base size, will scale with text
                height={100} // Base size
                className="h-full w-full object-contain"
              />
            </span>{" "}
            <span style={{ color: "var(--background)", WebkitTextStroke: "3.3px hsl(var(--foreground))" }}>READY GO</span>
          </div>
          <div className="whitespace-nowrap">К НАМ ПРИХОДЯТ ЗА</div>
          
          <div className="relative h-[1em] overflow-hidden mt-0"> {/* Adjusted to 1em and mt-0 */}
            <span className={keywordClasses}>
              {currentWord}
            </span>
          </div>
        </div>
      </div>

      {/* Left Image */}
      <div 
        className="absolute left-4 sm:left-8 bottom-8 sm:top-1/2 sm:-translate-y-1/2 z-10 transition-transform duration-500 ease-out"
        style={leftImageStyle}
      >
        <div className="relative w-[180px] sm:w-[260px] md:w-[365px] rounded-xl overflow-hidden">
          <Image
            src="/images/back-1.png"
            alt="Черное худи с бирюзовым принтом"
            width={365}
            height={365}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Right Image */}
      <div 
        className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 z-10 transition-transform duration-500 ease-out"
        style={rightImageStyle}
      >
        <div className="relative w-[180px] sm:w-[280px] md:w-[360px] h-[280px] sm:h-[400px] md:h-[450px] overflow-hidden">
          <Image
            src="/images/back-2.png"
            alt="3D рендер карточки Progress on velocity"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

