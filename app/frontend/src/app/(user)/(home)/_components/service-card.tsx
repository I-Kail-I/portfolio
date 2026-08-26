'use client';

import Link from 'next/link';
import * as motion from 'motion/react-client';
import { useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ServiceCardType = {
  eyebrow: string;
  title: string;
  description: string;
  link: string;
  className?: string;
  buttonClassName?: string;
};

const MAX_ROTATION = 10;

export default function ServiceCard({
  eyebrow,
  title,
  description,
  link,
  className,
  buttonClassName,
}: ServiceCardType) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [MAX_ROTATION, -MAX_ROTATION]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-MAX_ROTATION, MAX_ROTATION]),
    springConfig,
  );

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={cn(
        'flex min-h-125 flex-col rounded-3xl p-10 text-neutral-900 transition-shadow hover:shadow-2xl lg:p-12',
        className,
      )}
    >
      <span className='font-bold text-xs uppercase'>{eyebrow}</span>

      <h2 className='mt-8 max-w-md font-light text-4xl lg:text-5xl'>{title}</h2>

      <p className='mt-8 max-w-md text-lg'>{description}</p>

      <Button
        size='lg'
        className={cn('mt-auto w-fit rounded-full px-6', buttonClassName)}
        nativeButton={false}
        render={<Link href={link} />}
      >
        Learn more
      </Button>
    </motion.div>
  );
}
