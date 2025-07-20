'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis root options={{ lerp: 0.06, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
