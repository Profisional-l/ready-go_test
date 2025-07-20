
"use client";

import { useRef } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export function ProgressBar() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useLenis(({ progress }) => {
    // Directly manipulate the style via a ref to avoid React state updates on every frame,
    // which is a major performance boost.
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
