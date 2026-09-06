import * as motion from 'motion/react-client';
import { useInView } from 'motion/react';
import { useEffect, useRef } from 'react';
import { texts } from '../app/(user)/(home)/_sections/how-i-work-section';

export function TextBlock({
  text,
  index,
  onActive,
}: {
  text: (typeof texts)[number];
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className='flex min-h-[60vh] items-center py-10 lg:min-h-[70vh] lg:py-0'>
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className='font-light text-4xl sm:text-5xl lg:text-7xl'>{text.title}</h1>

        <p className='mt-6 text-muted-foreground text-xl sm:text-2xl lg:mt-10 lg:text-4xl'>
          {text.description}
        </p>
      </motion.div>
    </div>
  );
}
