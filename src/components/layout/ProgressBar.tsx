
"use client";

import { useState, useEffect, useRef } from 'react';

export function ProgressBar() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const scrollFraction = currentScroll / totalScroll;
    setProgress(scrollFraction);
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
    }
  }, [progress])

  return (
    <div className="fixed top-0 left-0 w-full h-[7.2px] z-[1000] bg-transparent transform-gpu">
      <div
        ref={progressBarRef}
        className="h-full bg-accent"
        style={{
          transformOrigin: 'left',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
