'use client';

import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Reveal } from '@/components/reveal';
import { TextBlock } from '../_components/text-block';

export const texts = [
  {
    id: 'business-first',
    title: 'I start with the business, not the deliverables.',
    description:
      'I dig into your goals, your users, and what success looks like - then decide on the architecture and stack that gets you there.',
  },
  {
    id: 'clear-updates',
    title: "You'll always know what's happening and why.",
    description:
      'Structured updates and regular check-ins - no surprises, just clear progress and space to course-correct together.',
  },
  {
    id: 'point-of-view',
    title: 'I bring a point of view, not just execution.',
    description:
      "I'll tell you what I think the right move is and why. You make the final call, but you won't be making it alone.",
  },
  {
    id: 'adaptability',
    title: 'I adapt to how you work.',
    description:
      "Every team is different. I'll fit into your stack and workflow - from Git flow to CI/CD and cloud - not the other way around.",
  },
];

export function HowIWorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='mt-24 w-full lg:mt-45'>
      <div className='container mx-auto'>
        <div className='font-semibold text-muted-foreground text-xs uppercase'>
          <Reveal>
            <p>HOW I WORK</p>
          </Reveal>
        </div>

        {/* MOBILE STICKY STEP-TRACKER */}
        <div className='sticky top-0 z-10 max-lg:block lg:hidden'>
          <div className='bg-background/80 py-4 backdrop-blur-sm'>
            {/* progress track with numbered stops */}
            <div className='relative flex items-center justify-between'>
              <div className='absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-border' />

              {texts.map((text, index) => {
                const isActive = index === activeIndex;
                const isDone = index < activeIndex;

                return (
                  <div key={text.id} className='relative z-10 flex items-center justify-center'>
                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className='relative flex h-7 w-7 items-center justify-center rounded-full bg-background'
                    >
                      {isActive && (
                        <motion.div
                          layoutId='active-step-pill'
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className='absolute inset-0 rounded-full bg-orange-200'
                        />
                      )}
                      <span
                        className={`relative font-semibold text-xs transition-colors duration-300 ${
                          isActive
                            ? 'text-background'
                            : isDone
                              ? 'text-orange-200'
                              : 'text-muted-foreground'
                        }`}
                      >
                        0{index + 1}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* crossfading title of the active step */}
            <div className='mt-4 overflow-hidden'>
              <AnimatePresence mode='wait'>
                <motion.p
                  key={activeIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className='text-balance font-semibold text-lg leading-snug'
                >
                  {texts[activeIndex].title}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className='mx-55 grid gap-24 max-lg:mx-0 max-lg:px-5 lg:grid-cols-[minmax(0,1fr)_3fr]'>
          <div className='hidden lg:block'>
            <div className='sticky top-0 flex h-screen items-center'>
              <span className='overflow-hidden font-semibold text-[12rem] leading-none'>
                <AnimatePresence mode='popLayout'>
                  <motion.span
                    key={activeIndex}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className='block text-orange-200'
                  >
                    0{activeIndex + 1}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </div>

          <div>
            {texts.map((text, index) => (
              <TextBlock key={text.id} text={text} index={index} onActive={setActiveIndex} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
