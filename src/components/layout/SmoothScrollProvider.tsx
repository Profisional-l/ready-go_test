'use client';

import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { useState, type ReactNode } from 'react';
import { ProgressBar } from './ProgressBar';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [progress, setProgress] = useState(0);

  // We need a component that has access to the lenis instance
  const LenisUpdater = () => {
    useLenis(({ progress }) => {
      setProgress(progress * 100);
    });
    return null;
  };

  return (
    <ReactLenis root options={{ lerp: 0.06, smoothWheel: true }}>
      <ProgressBar progress={progress} />
      <LenisUpdater />
      {children}
    </ReactLenis>
  );
}
