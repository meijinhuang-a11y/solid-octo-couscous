import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function WeatherWidget() {
  const [location, setLocation] = useState('北京市 · 朝阳区');
  const [isLoading, setIsLoading] = useState(false);

  const weatherData = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    const baseWeather = [
      { icon: '☀️', high: 35, low: 25 },
      { icon: '⛅', high: 33, low: 24 },
      { icon: '🌤️', high: 34, low: 25 },
      { icon: '🌧️', high: 29, low: 23 },
      { icon: '⛈️', high: 27, low: 22 },
      { icon: '☀️', high: 32, low: 24 },
      { icon: '🌤️', high: 33, low: 24 },
    ];

    const result = [];
    for (let i = 0; i < 7; i++) {
      const idx = (dayOfWeek + i) % 7;
      result.push({
        day: i === 0 ? '今天' : weekDays[idx],
        ...baseWeather[i],
      });
    }
    return result;
  }, []);

  const handleLocationClick = () => {
    const mapUrl = `https://uri.amap.com/marker?position=${encodeURIComponent(location)}&name=${encodeURIComponent(location)}`;
    window.open(mapUrl, '_blank');
  };

  const handleRefreshLocation = async () => {
    setIsLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const mapUrl = `https://uri.amap.com/marker?position=${longitude.toFixed(6)},${latitude.toFixed(6)}&name=当前位置`;
            window.open(mapUrl, '_blank');
            setLocation(`纬度: ${latitude.toFixed(4)} · 经度: ${longitude.toFixed(4)}`);
          },
          (error) => {
            console.error('获取位置失败:', error);
            setLocation('定位失败，请手动选择');
          },
          { timeout: 10000 }
        );
      } else {
        setLocation('您的浏览器不支持定位');
      }
    } catch (error) {
      setLocation('定位失败');
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <motion.section
      className="p-4 rounded-2xl flex flex-col"
      style={{
        background: 'var(--cream-bg)',
        border: '1px solid var(--cream-border)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '4px',
              height: '16px',
              borderRadius: '2px',
              background: 'linear-gradient(180deg, var(--soft-blue), var(--moss-green))',
            }}
          />
          <motion.h3
            className="m-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--cream-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            我的位置与天气
          </motion.h3>
        </div>
        <motion.button
          type="button"
          onClick={handleLocationClick}
          className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{
            fontFamily: "'Lora',var(--font-sans)",
            fontSize: '0.75rem',
            color: 'var(--soft-blue)',
            background: 'color-mix(in srgb, var(--soft-blue) 8%, transparent)',
            border: 'none',
            cursor: 'pointer',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location}
        </motion.button>
      </div>
      <motion.div
        style={{
          width: '16px',
          height: '2px',
          background: 'var(--soft-blue)',
          borderRadius: '1px',
          marginBottom: '8px',
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />

      <motion.button
        type="button"
        onClick={handleLocationClick}
        className="w-full rounded-xl relative overflow-hidden mb-3 flex-shrink-0"
        style={{
          aspectRatio: '16/7',
          cursor: 'pointer',
          border: '1px solid var(--cream-border)',
          background: `
            linear-gradient(135deg, 
              color-mix(in srgb, var(--soft-blue) 12%, var(--cream-bg)) 0%, 
              color-mix(in srgb, var(--moss-green) 8%, var(--cream-bg)) 50%,
              color-mix(in srgb, var(--warm-orange) 10%, var(--cream-bg)) 100%
            )
          `,
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(color-mix(in srgb, var(--cream-border) 60%, transparent) 1px, transparent 1px),
              linear-gradient(90deg, color-mix(in srgb, var(--cream-border) 60%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            opacity: 0.5,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(color-mix(in srgb, var(--cream-border) 40%, transparent) 1px, transparent 1px),
              linear-gradient(90deg, color-mix(in srgb, var(--cream-border) 40%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
            opacity: 0.3,
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 175"
          preserveAspectRatio="none"
        >
          <path
            d="M50 120 Q100 80 180 100 T320 90 T400 110"
            fill="none"
            stroke="color-mix(in srgb, var(--soft-blue) 40%, transparent)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M30 60 Q80 90 150 70 T280 80 T380 60"
            fill="none"
            stroke="color-mix(in srgb, var(--moss-green) 30%, transparent)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect x="120" y="50" width="40" height="30" rx="4" fill="color-mix(in srgb, var(--warm-orange) 15%, transparent)" stroke="color-mix(in srgb, var(--warm-orange) 30%, transparent)" strokeWidth="1"/>
          <rect x="220" y="90" width="50" height="35" rx="4" fill="color-mix(in srgb, var(--soft-blue) 12%, transparent)" stroke="color-mix(in srgb, var(--soft-blue) 25%, transparent)" strokeWidth="1"/>
          <rect x="300" y="40" width="35" height="25" rx="4" fill="color-mix(in srgb, var(--moss-green) 12%, transparent)" stroke="color-mix(in srgb, var(--moss-green) 25%, transparent)" strokeWidth="1"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <motion.div
            style={{
              position: 'relative',
              zIndex: 2,
            }}
            animate={{ 
              y: isLoading ? [0, -4, 0] : 0,
            }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'easeInOut' }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="var(--warm-orange)"
                stroke="white"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          </motion.div>
          <span
            className="relative z-10"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--cream-dark)',
              background: 'var(--cream-bg)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--cream-border)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}
          >
            {isLoading ? '定位中...' : '点击查看地图'}
          </span>
        </div>
      </motion.button>

      <div
        className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 hide-scrollbar"
      >
        {weatherData.map((weather, index) => (
          <motion.div
            key={index}
            className="text-center rounded-xl flex-shrink-0"
            style={{
              padding: '10px 12px',
              minWidth: '56px',
              background: 'var(--surface)',
              border: '1px solid rgba(232,230,220,0.8)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.75rem',
                color: 'var(--cream-text-muted)',
                marginBottom: '4px',
              }}
            >
              {weather.day}
            </div>
            <div
              className="text-base my-1"
              style={{ lineHeight: 1 }}
            >
              {weather.icon}
            </div>
            <div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--cream-dark)',
                marginTop: '4px',
              }}
            >
              {weather.high}°
            </div>
            <div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.75rem',
                color: 'var(--cream-text-muted)',
              }}
            >
              {weather.low}°
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
