'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';

const LERP_FACTOR    = 0.075;
const STOP_THRESHOLD = 0.33;

export const useSmoothScroll = () => {
  const targetScroll     = useRef(0);
  const currentScroll    = useRef(0);
  const isScrolling      = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  // 1) полная синхронизация рефов
  const syncScroll = () => {
    const pos = window.scrollY;
    targetScroll.current  = pos;
    currentScroll.current = pos;
  };

  // 2) отменяем native scroll-restoration и обнуляем скролл ДО рендера
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // прямо перед первым рендером сбрасываем позицию в 0
    window.scrollTo(0, 0);
    syncScroll();
  }, []);

  // 3) слушаем hashchange (для якорей)
  useEffect(() => {
    window.addEventListener('hashchange', syncScroll);
    return () => {
      window.removeEventListener('hashchange', syncScroll);
    };
  }, []);

  // 4) основной эффект для плавного скролла
  useEffect(() => {
    const lerp = (start: number, end: number, f: number) => start + (end - start) * f;

    const animateScroll = () => {
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (maxY <= 0) {
        animationFrameId.current = requestAnimationFrame(animateScroll);
        return;
      }

      currentScroll.current = lerp(currentScroll.current, targetScroll.current, LERP_FACTOR);

      if (Math.abs(targetScroll.current - currentScroll.current) < STOP_THRESHOLD) {
        currentScroll.current = targetScroll.current;
        window.scrollTo(0, currentScroll.current);
        isScrolling.current = false;
        if (animationFrameId.current !== null) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      } else {
        window.scrollTo(0, currentScroll.current);
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (document.documentElement.classList.contains('modal-open')) return;

      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (maxY <= 0) return;

      e.preventDefault();

      if (!isScrolling.current) {
        syncScroll();
      }

      targetScroll.current = Math.max(
        0,
        Math.min(targetScroll.current + e.deltaY, maxY)
      );

      if (!isScrolling.current) {
        isScrolling.current = true;
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return null;
};
