import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const { year, month, days, firstDayOfWeek, today } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const today = new Date();

    return { year, month, days, firstDayOfWeek, today };
  }, [currentDate]);

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const remindersByDay = useMemo(() => {
    const reminders: Record<number, number> = {};
    const d = new Date();
    const currentMonth = d.getMonth();
    const currentYear = d.getFullYear();
    if (month === currentMonth && year === currentYear) {
      const sampleDays = [5, 12, 18, 25];
      sampleDays.forEach((day, i) => {
        if (day <= days.length) {
          reminders[day] = i + 1;
        }
      });
    } else {
      reminders[10] = 2;
      reminders[20] = 1;
    }
    return reminders;
  }, [month, year, days]);

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonthDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    prevMonthDays.push(null);
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
    }),
  };

  return (
    <motion.section
      className="p-4 rounded-2xl"
      style={{
        background: 'var(--cream-bg)',
        border: '1px solid var(--cream-border)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center justify-between mb-3">
        <motion.button
          type="button"
          onClick={prevMonth}
          className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl sm:rounded-lg flex items-center justify-center"
          style={{ cursor: 'pointer' }}
          whileTap={{ scale: 0.97 }}
          aria-label="上个月"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
        <motion.h3
          key={`${month}-${year}`}
          className="m-0"
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--cream-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {monthNames[month]} {year}
        </motion.h3>
        <motion.button
          type="button"
          onClick={nextMonth}
          className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl sm:rounded-lg flex items-center justify-center"
          style={{ cursor: 'pointer' }}
          whileTap={{ scale: 0.97 }}
          aria-label="下个月"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>

      <div className="grid grid-cols-7 text-center gap-1 mb-2 place-items-center">
        {weekDays.map((day, index) => (
          <motion.span
            key={day}
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
              padding: '6px 0',
              width: '38px',
            }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.03, duration: 0.3 }}
          >
            {day}
          </motion.span>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          className="grid grid-cols-7 text-center gap-1 place-items-center"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {prevMonthDays.map((_, index) => (
            <span key={`empty-${index}`} style={{ width: '38px', height: '38px' }} />
          ))}
          {days.map((day, index) => {
            const today = isToday(day);
            const reminderCount = remindersByDay[day];
            return (
              <motion.span
                key={day}
                className="inline-flex items-center justify-center relative"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.875rem',
                  color: today ? 'var(--cream-bg)' : 'var(--cream-dark)',
                  fontWeight: today ? 600 : 400,
                  background: today ? 'var(--warm-orange)' : 'transparent',
                  cursor: 'pointer',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01, duration: 0.25 }}
                whileTap={{ scale: 0.9 }}
              >
                {today && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: '2px solid var(--warm-orange)',
                    }}
                  />
                )}
                {day}
                {reminderCount && reminderCount > 0 && (
                  <span
                    className="absolute"
                    style={{
                      top: '2px',
                      right: '2px',
                      minWidth: '14px',
                      height: '14px',
                      padding: '0 3px',
                      borderRadius: '7px',
                      background: 'var(--soft-blue)',
                      color: 'white',
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      fontFamily: "'Poppins',var(--font-sans)",
                      lineHeight: '14px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {reminderCount > 9 ? '9+' : reminderCount}
                  </span>
                )}
              </motion.span>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
