"use client";

import { useState, useEffect, useRef } from 'react';

export function ProgressBar({ progress }: { progress: number }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const velocity = useRef(0);
  const targetProgress = useRef(progress);

  useEffect(() => {
    targetProgress.current = progress;
  }, [progress]);

  useEffect(() => {
    const animate = () => {
      const stiffness = 0.1;
      const damping = 0.9;

      const distance = targetProgress.current - displayProgress;
      const acceleration = distance * stiffness;

      velocity.current = velocity.current * damping + acceleration;
      const newProgress = displayProgress + velocity.current;
      
      // Stop animation when it's close enough to prevent infinite loop
      if (Math.abs(distance) < 0.01 && Math.abs(velocity.current) < 0.01) {
        setDisplayProgress(targetProgress.current);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        return;
      }
      
      setDisplayProgress(newProgress);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [displayProgress]); // Rerun effect when displayProgress changes to continue animation


  return (
    <div className="fixed top-0 left-0 w-full h-[7.2px] z-[1000] bg-transparent">
      <div
        className="h-full bg-accent"
        style={{
          width: `${displayProgress}%`,
        }}
      />
    </div>
  );
}
