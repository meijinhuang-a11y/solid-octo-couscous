import { motion } from 'framer-motion';

const weatherData = [
  { day: '今天', icon: '☀️', high: 35, low: 25 },
  { day: '周一', icon: '⛅', high: 33, low: 24 },
  { day: '周二', icon: '🌤️', high: 34, low: 25 },
  { day: '周三', icon: '🌧️', high: 29, low: 23 },
  { day: '周四', icon: '⛈️', high: 27, low: 22 },
  { day: '周五', icon: '☀️', high: 32, low: 24 },
  { day: '周六', icon: '🌤️', high: 33, low: 24 },
];

export default function WeatherWidget() {
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
        <motion.span
          style={{
            fontFamily: "'Lora',var(--font-sans)",
            fontSize: '0.75rem',
            color: 'var(--cream-text-muted)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          北京市 · 朝阳区
        </motion.span>
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

      <motion.div
        className="w-full rounded-2xl relative overflow-hidden mb-3 flex-shrink-0"
        style={{
          aspectRatio: '16/7',
          background: 'linear-gradient(135deg, var(--cream-border), color-mix(in srgb, var(--cream-bg) 50%, var(--cream-border)))',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--warm-orange)',
              boxShadow: '0 0 0 3px color-mix(in srgb, var(--warm-orange) 30%, transparent)',
            }}
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
            当前位置
          </span>
        </div>
      </motion.div>

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
