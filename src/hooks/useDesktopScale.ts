import { useEffect, useState } from 'react';

const BASE_WIDTH = 1280;
const MOBILE_BREAKPOINT = 1024;

export function useDesktopScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const applyScale = () => {
      const w = window.innerWidth;

      // 移动端和平板端不缩放，使用原生响应式布局
      if (w < MOBILE_BREAKPOINT) {
        setScale(1);
        const root = document.documentElement;
        root.style.zoom = '1';
        root.style.setProperty('--desktop-scale', '1');
        return;
      }

      // 桌面端：窄屏缩放
      const newScale = Math.min(1, w / BASE_WIDTH);
      setScale(newScale);
      const root = document.documentElement;
      root.style.zoom = String(newScale);
      root.style.setProperty('--desktop-scale', String(newScale));
    };

    const debouncedApplyScale = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(applyScale, 100);
    };

    applyScale();
    window.addEventListener('resize', debouncedApplyScale);
    return () => {
      window.removeEventListener('resize', debouncedApplyScale);
      clearTimeout(timeoutId);
    };
  }, []);

  return scale;
}
