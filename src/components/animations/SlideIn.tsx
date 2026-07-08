import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  isOpen: boolean;
  className?: string;
  duration?: number;
}

export default function SlideIn({
  children,
  direction = 'left',
  isOpen,
  className = '',
  duration = 0.3,
}: SlideInProps) {
  const shouldReduceMotion = useReducedMotion();

  const getVariants = () => {
    const hidden = { opacity: 0 };
    const visible = { opacity: 1 };

    if (shouldReduceMotion) {
      return { hidden, visible };
    }

    switch (direction) {
      case 'left':
        return {
          hidden: { ...hidden, x: '-100%' },
          visible: { ...visible, x: 0 },
        };
      case 'right':
        return {
          hidden: { ...hidden, x: '100%' },
          visible: { ...visible, x: 0 },
        };
      case 'top':
        return {
          hidden: { ...hidden, y: '-100%' },
          visible: { ...visible, y: 0 },
        };
      case 'bottom':
        return {
          hidden: { ...hidden, y: '100%' },
          visible: { ...visible, y: 0 },
        };
      default:
        return { hidden, visible };
    }
  };

  const variants = getVariants();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={className}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
          transition={{
            duration: shouldReduceMotion ? 0 : duration,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
