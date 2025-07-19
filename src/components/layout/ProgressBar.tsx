"use client";

import { useState, useEffect, useRef } from 'react';

export function ProgressBar() {
  const [displayProgress, setDisplayProgress] = useState(0);
  const targetProgress = useRef(0);
  const animationRef = useRef<number | null>(null);
  const velocity = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const animate = () => {
    const stiffness = 0.1;
    const damping = 0.8;

    const distance = targetProgress.current - displayProgress;
    const acceleration = distance * stiffness;

    velocity.current = velocity.current * damping + acceleration;

    const newProgress = displayProgress + velocity.current;
    setDisplayProgress(newProgress);

    if (Math.abs(velocity.current) > 0.01 || Math.abs(distance) > 0.1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayProgress(targetProgress.current);
      animationRef.current = null;
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    if (sections.length === 0) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentSection = Array.from(sections).indexOf(entry.target);
          const totalSections = sections.length;

          // Ключевое изменение: добавляем +1 для полного заполнения на последней секции
          const progress = currentSection === totalSections - 1
            ? 100
            : (currentSection / (totalSections - 1)) * 100;

          targetProgress.current = progress;

          if (!animationRef.current) {
            animationRef.current = requestAnimationFrame(animate);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
      rootMargin: "0px 0px -15% 0px"
    });

    sections.forEach(section => observerRef.current?.observe(section));

    // Инициализация
    const visibleSection = Array.from(sections).find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    });

    if (visibleSection) {
      const currentSection = Array.from(sections).indexOf(visibleSection);
      const totalSections = sections.length;
      targetProgress.current = currentSection === totalSections - 1
        ? 100
        : (currentSection / (totalSections - 1)) * 100;
      setDisplayProgress(targetProgress.current);
    }

    return () => {
      observerRef.current?.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[7.2px] z-[1000] bg-transparent">
      <div
        className="h-full bg-accent transition-all duration-75 ease-out"
        style={{
          width: `${displayProgress * 2}%`,
        }}
      />
    </div>
  );
}