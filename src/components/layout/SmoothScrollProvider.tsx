
'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import type { PropsWithChildren } from 'react';

// Options for react-lenis
// https://github.com/studio-freight/lenis#options
const lenisOptions = {
  lerp: 0.1, // Lower values create a smoother, more 'jelly-like' effect
  duration: 1.5,
  smoothTouch: true,
};

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
