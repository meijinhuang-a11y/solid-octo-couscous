import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  duration?: number;
  delay?: number;
  decimals?: number;
  start?: number;
}

export function useCountUp(target: number, options: UseCountUpOptions = {}) {
  const { duration = 1500, delay = 0, decimals = 0, start = 0 } = options;
  const [count, setCount] = useState(start);
  const countRef = useRef(start);

  useEffect(() => {
    const startTime = performance.now() + delay;
    const startValue = countRef.current;
    const endValue = target;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (currentTime < startTime) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;

      const rounded = Number(currentValue.toFixed(decimals));
      setCount(rounded);
      countRef.current = rounded;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, delay, decimals]);

  return count;
}
