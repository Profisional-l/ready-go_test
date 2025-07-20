"use client";

import { useState } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  
  useLenis(({ progress }) => {
    setProgress(progress); // progress is a value from 0 to 1
  });

  return (
    <div className="fixed top-0 left-0 w-full h-[7.2px] z-[1000] bg-transparent transform-gpu">
      <div
        className="h-full bg-accent origin-left"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left', // Ensure scaling happens from the left
          willChange: 'transform', // Hint to the browser for optimization
        }}
      />
    </div>
  );
}
