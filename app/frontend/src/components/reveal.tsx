'use client';

import * as motion from 'motion/react-client';
import type { Variants } from 'motion';

const variants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
};

export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      custom={delay}
      variants={variants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: once, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
