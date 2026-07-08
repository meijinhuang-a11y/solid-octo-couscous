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
      <div className="flex items-center justify-between mb-1.5">
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
        <motion.button
          type="button"
          onClick={handleLocationClick}
          style={{
            fontFamily: "'Lora',var(--font-sans)",
            fontSize: '0.75rem',
            color: 'var(--soft-blue)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationColor: 'color-mix(in srgb, var(--soft-blue) 30%, transparent)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
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
        onClick={handleRefreshLocation}
        className="w-full rounded-2xl relative overflow-hidden mb-3 flex-shrink-0 flex items-center justify-center gap-2"
        style={{
          aspectRatio: '16/7',
          background: 'linear-gradient(135deg, var(--cream-border), color-mix(in srgb, var(--cream-bg) 50%, var(--cream-border)))',
          border: '1px solid var(--cream-border)',
          cursor: 'pointer',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex flex-col items-center gap-1">
          <motion.div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--warm-orange)',
              boxShadow: '0 0 0 3px color-mix(in srgb, var(--warm-orange) 30%, transparent)',
            }}
            animate={{ scale: isLoading ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.8, repeat: isLoading ? Infinity : 0 }}
          />
          <span
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
              background: 'var(--cream-bg)',
              padding: '2px 6px',
              borderRadius: '4px',
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
