import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  scale?: number;
  duration?: number;
  className?: string;
  isVisible?: boolean;
}

export default function ScaleIn({
  children,
  delay = 0,
  scale = 0.9,
  duration = 0.5,
  className = '',
  isVisible = true,
}: ScaleInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={className}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : scale }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : scale }}
          transition={{
            duration: shouldReduceMotion ? 0 : duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
