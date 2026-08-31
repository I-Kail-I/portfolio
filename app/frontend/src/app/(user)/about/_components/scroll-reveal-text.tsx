'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import Lenis from 'lenis';

interface ScrollRevealTextProps {
  /** Paragraphs separated by a blank line. */
  text: string;
  className?: string;
  paragraphClassName?: string;
  /**
   * Fraction of total scroll progress each word takes to go
   * dim -> bright -> dim. Smaller = tighter "spotlight", larger = softer.
   */
  window?: number;
  /** Opacity for words outside the focus window. */
  restOpacity?: number;
  /** Blur (px) applied to words outside the focus window. */
  restBlur?: number;
}

interface RevealWordProps {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  window: number;
  restOpacity: number;
  restBlur: number;
}

function RevealWord({
  word,
  index,
  total,
  progress,
  window: fadeWindow,
  restOpacity,
  restBlur,
}: RevealWordProps) {
  // Where in the 0-1 scroll timeline this word's "moment" sits.
  const center = total <= 1 ? 0.5 : index / (total - 1);

  const opacity = useTransform(
    progress,
    [center - fadeWindow, center, center + fadeWindow],
    [restOpacity, 1, restOpacity],
  );

  const blur = useTransform(
    progress,
    [center - fadeWindow, center, center + fadeWindow],
    [restBlur, 0, restBlur],
  );
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.span style={{ opacity, filter }} className='inline-block will-change-[opacity,filter]'>
      {word}
    </motion.span>
  );
}

/**
 * Renders `text` as scroll-driven "spotlight" prose: words brighten and
 * come into focus as they cross the reading band, then fade back out —
 * the effect from mariajoaoabrantes.work/about.
 *
 * Usage:
 *   <div className="min-h-[220vh] bg-black flex justify-center">
 *     <ScrollRevealText
 *       text={BIO_TEXT}
 *       className="max-w-2xl px-6 py-[50vh] text-3xl font-medium text-white"
 *     />
 *   </div>
 *
 * The tall wrapper + large vertical padding on the text block is what gives
 * scroll room for the effect to play out — without it every word reaches
 * the focus band at once.
 */
export function ScrollRevealText({
  text,
  className,
  paragraphClassName = 'mb-8 leading-snug',
  window: fadeWindow = 0.06,
  restOpacity = 0.18,
  restBlur = 3,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // scrollYProgress goes 0 -> 1 as the block travels from "just below the
  // reading band" to "just above it", so words in the middle of the text
  // hit their bright moment roughly at the middle of that scroll range.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0', 'end 1'],
  });

  const paragraphs = useMemo(
    () =>
      text
        .trim()
        .split(/\n\s*\n/)
        .map((p) => p.trim().replace(/\s+/g, ' ').split(' '))
        .filter((p) => p.length > 0 && p[0] !== ''),
    [text],
  );

  const total = useMemo(() => paragraphs.reduce((sum, p) => sum + p.length, 0), [paragraphs]);

  let cursor = -1;

  return (
    <div ref={containerRef} className={className}>
      {paragraphs.map((words, pi) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: ()
        <p key={pi} className={paragraphClassName}>
          {words.map((word, wi) => {
            cursor += 1;
            const i = cursor;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: ()
              <span key={wi}>
                <RevealWord
                  word={word}
                  index={i}
                  total={total}
                  progress={scrollYProgress}
                  window={fadeWindow}
                  restOpacity={restOpacity}
                  restBlur={restBlur}
                />{' '}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
