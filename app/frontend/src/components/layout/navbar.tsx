'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = ['Work', 'About', 'Service'];

export function Navbar() {
  return (
    <>
      <div className='hidden md:block'>
        <DesktopNavbar />
      </div>
      <div className='md:hidden'>
        <MobileNavbar />
      </div>
    </>
  );
}

function HoverText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2',
        className,
      )}
    >
      {children}
    </div>
  );
}

function DesktopNavbar() {
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = useState(true);

  const path = usePathname();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setAtTop(latest < 5);
  });

  return (
    <nav className='fixed z-50 w-full'>
      <div
        className={cn(
          'mx-auto mt-4 flex h-15 w-full items-center justify-between transition-all duration-300',
          atTop ? 'max-w-3xl' : 'max-w-2xl rounded-full bg-black/40 px-5 py-1 backdrop-blur-2xl',
        )}
      >
        {/* Left Section */}
        <div>
          <Link
            href='/'
            className='group relative inline-block h-[1.5em] overflow-hidden rounded-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
          >
            <HoverText>
              <span>Mikail Arianos</span>
              <span aria-hidden='true'>Mikail Arianos</span>
            </HoverText>
          </Link>
        </div>

        {/* Middle Section */}
        <div className='flex gap-x-10'>
          {navItems.map((item) => {
            const slug = item.toLowerCase();
            const isActive = path.startsWith(`/${slug}`) || path === item;

            return (
              <Link
                key={item}
                href={`/${slug}`}
                className='group relative inline-block h-[1.5em] overflow-hidden rounded-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
              >
                <HoverText>
                  <span className={isActive ? 'text-violet-400' : ''}>{item}</span>
                  <span className={isActive ? 'text-violet-400' : ''} aria-hidden='true'>
                    {item}
                  </span>
                </HoverText>
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div>
          <Button className='cursor-pointer px-6 py-5'>
            <Link href='/contact'>Contact</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape, lock body scroll while open
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <nav className='fixed inset-x-0 bottom-6 z-50 flex justify-center px-4'>
      <motion.div
        layout
        animate={{ borderRadius: open ? 16 : 9999 }}
        transition={{
          layout: { type: 'spring', stiffness: 400, damping: 32 },
          borderRadius: { duration: 0.3, delay: open ? 0 : 0.2, ease: 'easeInOut' },
        }}
        className='w-full max-w-sm overflow-hidden bg-[#1a1a1a]/50 p-5 backdrop-blur-2xl'
        style={{ borderRadius: 9999 }}
      >
        {/* Toggle row */}
        <button
          type='button'
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls='mobile-nav-links'
          className='flex w-full items-center justify-between px-5 py-4 focus-visible:outline-none'
        >
          <span className='font-semibold text-sm text-white'>Mikail Arianos</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className='text-white/80'
          >
            <ChevronUp size={18} />
          </motion.span>
        </button>

        {/* Expanded links */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key='links'
              id='mobile-nav-links'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className='flex flex-col px-2 pb-2'
            >
              {['Home', ...navItems].map((item) => {
                const isHomeItem = item === 'Home';
                const targetHref = isHomeItem ? '/' : `/${item.toLowerCase()}`;
                const isActive = path === targetHref;

                return (
                  <Link
                    key={item}
                    href={targetHref}
                    onClick={close}
                    className={cn(
                      'rounded-2xl px-4 py-3 font-medium text-sm transition-colors hover:bg-white/10',
                      isActive ? 'bg-white/15 text-violet-300' : 'text-white/90',
                    )}
                  >
                    {item}
                  </Link>
                );
              })}
              <Link
                href='/contact'
                onClick={close}
                className={cn(
                  'mx-2 my-2 rounded-2xl px-4 py-3 text-center font-medium text-sm transition-colors hover:bg-white/10',
                  path === '/contact' ? 'bg-white/15 text-violet-300' : 'text-white',
                )}
              >
                Contact
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
