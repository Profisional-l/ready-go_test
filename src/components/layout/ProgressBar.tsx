
"use client";

import { useState, useEffect } from 'react';

export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const scrollProgress = totalHeight > 0 ? scrollPosition / totalHeight : 0;
      setProgress(scrollProgress);
    };

    // Слушаем нативное событие, так как наш кастомный скролл обновляет window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[7.2px] z-[1000] bg-transparent transform-gpu">
      <div
        className="h-full bg-accent"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
