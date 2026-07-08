import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  isTouch: boolean;
}

function detectDevice(width: number): DeviceType {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function detectTouch(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

export function useDeviceDetect(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>(() => ({
    type: detectDevice(window.innerWidth),
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    width: window.innerWidth,
    height: window.innerHeight,
    isTouch: detectTouch(),
  }));

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const type = detectDevice(w);
        setDevice({
          type,
          isMobile: type === 'mobile',
          isTablet: type === 'tablet',
          isDesktop: type === 'desktop',
          width: w,
          height: h,
          isTouch: detectTouch(),
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return device;
}
