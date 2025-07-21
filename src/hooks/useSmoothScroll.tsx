
'use client';

import { useEffect, useRef } from 'react';

const LERP_FACTOR = 0.1; // Чем меньше, тем более плавно и "желейно"
const STOP_THRESHOLD = 0.5; // Порог для остановки анимации

export const useSmoothScroll = () => {
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const isScrolling = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Инициализация при монтировании
    targetScroll.current = window.scrollY;
    currentScroll.current = window.scrollY;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animateScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Если нечего скроллить, ничего не делаем
      if (scrollableHeight <= 0) {
        animationFrameId.current = requestAnimationFrame(animateScroll);
        return;
      }
      
      currentScroll.current = lerp(currentScroll.current, targetScroll.current, LERP_FACTOR);

      if (Math.abs(targetScroll.current - currentScroll.current) < STOP_THRESHOLD) {
        currentScroll.current = targetScroll.current;
        isScrolling.current = false;
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      } else {
        window.scrollTo(0, currentScroll.current);
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // *** THE FIX IS HERE ***
      // Если модальное окно открыто (определяем по классу на html),
      // то полностью игнорируем событие и не вызываем preventDefault.
      // Это позволяет браузеру обрабатывать скролл нативно (внутри модального окна).
      if (document.documentElement.classList.contains('modal-open')) {
        return;
      }
      
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Если нечего скроллить, игнорируем событие
      if (scrollableHeight <= 0) return;

      e.preventDefault();
      targetScroll.current += e.deltaY;

      // Ограничиваем целевую прокрутку границами страницы
      targetScroll.current = Math.max(0, Math.min(targetScroll.current, scrollableHeight));
      
      if (!isScrolling.current) {
        isScrolling.current = true;
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };
    
    // Используем опцию { passive: false }, чтобы иметь возможность вызвать e.preventDefault()
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
};
