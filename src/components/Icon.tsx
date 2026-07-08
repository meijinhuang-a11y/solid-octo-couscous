import { CSSProperties } from 'react';

interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  color?: string;
  style?: CSSProperties;
}

export default function Icon({ name, size = 20, className = '', color, style }: IconProps) {
  const iconMap: Record<string, string> = {
    dashboard: '/icons/image_0_tgt36j.svg',
    tasks: '/icons/image_1_tgt36j.svg',
    notes: '/icons/image_2_tgt36j.svg',
    photo: '/icons/image_3_tgt36j.svg',
    copywriting: '/icons/image_4_tgt36j.svg',
    video: '/icons/image_5_tgt36j.svg',
    files: '/icons/image_6_tgt36j.svg',
    news: '/icons/image_7_tgt36j.svg',
    'trending-video': '/icons/image_8_tgt36j.svg',
    'trending-product': '/icons/image_9_tgt36j.svg',
    whitepaper: '/icons/image_17_tgt36j.svg',
    'product-extractor': '/icons/image_17_tgt36j.svg',
    arrow: '/icons/image_10_tgt36j.svg',
    check: '/icons/image_11_tgt36j.svg',
    'image-12': '/icons/image_12_tgt36j.svg',
    'image-13': '/icons/image_13_tgt36j.svg',
    'image-14': '/icons/image_14_tgt36j.svg',
    'image-15': '/icons/image_15_tgt36j.svg',
    'image-16': '/icons/image_16_tgt36j.svg',
    'image-17': '/icons/image_17_tgt36j.svg',
  };

  const iconUrl = iconMap[name] || iconMap.dashboard;

  return (
    <img
      src={iconUrl}
      alt={name}
      className={className}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        color: color || 'currentColor',
        ...style,
      }}
    />
  );
}
