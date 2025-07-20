"use client";

import { useState } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  
  // This hook will re-render the component on every scroll frame
  // but since it's self-contained, it won't cause a loop in the provider.
  useLenis(({ progress }) => {
    setProgress(progress * 100);
  });

  return (
    <div className="fixed top-0 left-0 w-full h-[7.2px] z-[1000] bg-transparent">
      <div
        className="h-full bg-accent"
        style={{
          width: `${progress}%`,
          transition: 'width 0.1s ease-out',
        }}
      />
    </div>
  );
}
