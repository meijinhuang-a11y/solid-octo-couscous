import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export default function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [dragY, setDragY] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      setCurrentDate(`${month}月${day}日 ${weekDays[now.getDay()]}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLocked) {
      setDragY(0);
    }
  }, [isLocked]);

  const handleDragStart = useCallback((clientY: number) => {
    isDraggingRef.current = true;
    startYRef.current = clientY - dragY;
  }, [dragY]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDraggingRef.current) return;
    const newY = clientY - startYRef.current;
    if (newY < 0) {
      setDragY(newY);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (dragY < -120) {
      onUnlock();
    } else {
      setDragY(0);
    }
  }, [dragY, onUnlock]);

  useEffect(() => {
    if (!isLocked) return;

    const onMouseDown = (e: MouseEvent) => handleDragStart(e.clientY);
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => handleDragEnd();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragStart(e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isLocked, handleDragStart, handleDragMove, handleDragEnd]);

  const dragProgress = Math.min(Math.max(-dragY / 200, 0), 1);

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            cursor: 'grab',
            userSelect: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: dragY,
          }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div
            className="absolute top-0 left-0 right-0 flex flex-col items-center pt-20"
            style={{
              opacity: 1 - dragProgress * 0.5,
              transform: `translateY(${dragProgress * 30}px)`,
            }}
          >
            <motion.div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '5rem',
                fontWeight: 300,
                color: 'white',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {currentTime}
            </motion.div>
            <motion.div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.7)',
                marginTop: '8px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {currentDate}
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-12"
            style={{
              opacity: 1 - dragProgress * 0.8,
              transform: `translateY(${dragProgress * 50}px)`,
            }}
          >
            <motion.div
              className="flex items-center gap-2 mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
              <span
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                向上滑动解锁
              </span>
            </motion.div>

            <div
              style={{
                width: '120px',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  borderRadius: '2px',
                  background: 'white',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${dragProgress * 100}%` }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-8"
            style={{
              width: '120px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.3)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
