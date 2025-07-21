
"use client";

import { useLenis } from '@studio-freight/react-lenis';
import { useRef } from 'react';

export function ProgressBar() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useLenis(({ scroll, limit }) => {
    const progress = scroll / limit;
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    }
  });

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
