'use client';

import * as motion from 'motion/react-client';
import { AnimatePresence, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useRef, useState } from 'react';
import { BenefitText } from '../_components/benefit-text';

const steps = [
  {
    id: 'architecture',
    num: '01',
    title: 'Architecture before code',
    description:
      'Start with domain, data flow and infra constraints. Right primitives from day one — faster features, less rework before first commit, no blind building.',
  },
  {
    id: 'prototypes',
    num: '02',
    title: 'Production-ready prototypes',
    description:
      'Usable Next.js + API scaffolds that run real. Typed, testable, deployable from the start. No Figma-to-limbo — dev handoff disappears, iteration stays live.',
  },
  {
    id: 'foundations',
    num: '03',
    title: 'Scale-ready foundations',
    description:
      'Design system, CI/CD and IaC that grow with traffic. Reusable patterns, preview envs, K8s · AWS · Terraform baked in. Add services and flows without debt piling up.',
  },
  {
    id: 'clarity',
    num: '04',
    title: 'Clarity to ship',
    description:
      'Priorities ranked, decisions logged, tradeoffs visible. Sharper scope, fewer loops, safe deploys and rollbacks. Idea to production without fog.',
  },
] as const;

// Arc geometry — big shallow circle, matches screenshots
const VIEW_W = 1000;
const VIEW_H = 420;
const R = 720;
const START_X = 70;
const END_X = 930;
const BASE_Y = 390;
const CHORD = END_X - START_X; // 860
const HALF = CHORD / 2; // 430
// center below baseline
const CY = BASE_Y + Math.sqrt(R * R - HALF * HALF); // ~967
const CX = 500;
const START_ANGLE = (Math.atan2(BASE_Y - CY, START_X - CX) * 180) / Math.PI; // ~233
const END_ANGLE = (Math.atan2(BASE_Y - CY, END_X - CX) * 180) / Math.PI; // ~307
const SWEEP = END_ANGLE - START_ANGLE;

function pointAt(t: number) {
  const deg = START_ANGLE + t * SWEEP;
  const rad = (deg * Math.PI) / 180;
  return {
    x: Number.parseFloat((CX + R * Math.cos(rad)).toFixed(2)),
    y: Number.parseFloat((CY + R * Math.sin(rad)).toFixed(2)),
  };
}

const DOT_T = [0.06, 0.31, 0.69, 0.94];
const dotPoints = DOT_T.map(pointAt);

// SVG path for the arc (same geometry)
const arcPathD = `M ${START_X} ${BASE_Y} A ${R} ${R} 0 0 1 ${END_X} ${BASE_Y}`;

export function BenefitSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    mass: 0.6,
  });

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length + 0.001)));
    // also handle near-end snap
    if (v >= 0.99) {
      setActive(steps.length - 1);
      return;
    }
    setActive(idx);
  });

  return (
    <div suppressHydrationWarning>
      <div
        ref={containerRef}
        className='relative -mt-16 h-[400vh] lg:-mt-24'
        suppressHydrationWarning
      >
        <div
          className='sticky top-0 flex h-screen flex-col items-center justify-start gap-16 overflow-hidden pt-6 lg:gap-24 lg:pt-8'
          suppressHydrationWarning
        >
          {/* Arc — peeks while still in capabilities section */}
          <div
            className='relative flex w-full shrink-0 justify-center px-2 lg:px-8'
            suppressHydrationWarning
          >
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className='h-[26vh] w-full max-w-5xl lg:h-[38vh]'
              preserveAspectRatio='xMidYMid meet'
              aria-hidden
              suppressHydrationWarning
            >
              {/* base track */}
              <path
                d={arcPathD}
                fill='none'
                stroke='currentColor'
                strokeWidth={1}
                className='text-white/15'
                strokeLinecap='round'
              />
              {/* progress */}
              <motion.path
                d={arcPathD}
                fill='none'
                stroke='white'
                strokeWidth={1.15}
                strokeLinecap='round'
                style={{ pathLength: smoothProgress }}
              />
              {/* dots */}
              {dotPoints.map((p, i) => {
                const isActive = i === active;
                const isDone = i < active;
                return (
                  <motion.circle
                    key={steps[i].id}
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 5.5 : 3.5}
                    animate={{
                      scale: isActive ? 1.25 : 1,
                      opacity: isActive ? 1 : isDone ? 0.95 : 0.35,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    fill={isActive || isDone ? 'white' : 'white'}
                    stroke='black'
                    strokeWidth={0}
                    className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''}
                  />
                );
              })}
            </svg>
          </div>

          <div className='container mx-auto flex justify-center px-5'>
            <div className='w-full max-w-md lg:max-w-lg'>
              <div className='min-h-45 lg:min-h-50'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.38, ease: 'easeOut' }}
                  >
                    <BenefitText
                      num={steps[active].num}
                      title={steps[active].title}
                      description={steps[active].description}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* mobile progress dots indicator */}
              <div className='mt-6 flex items-center gap-2 lg:hidden'>
                {steps.map((s, i) => (
                  <div
                    key={s.id}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= active ? 'bg-white' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
