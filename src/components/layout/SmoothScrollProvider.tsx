
'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import type { PropsWithChildren } from 'react';

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  useSmoothScroll();

  return <>{children}</>;
}
