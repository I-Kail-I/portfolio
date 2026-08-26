'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';

const navItems = ['Work', 'About', 'Service'];

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

export function Navbar() {
  const { scrollY } = useScroll();
  const [scroll, setScroll] = useState(true);

  // Safely listen to scroll updates without infinite re-renders
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScroll(latest < 5);
  });

  return (
    <nav className='fixed z-50 w-full'>
      <div
        className={cn(
          'mx-auto flex h-20 w-full items-center justify-between transition-all duration-300',
          scroll ? 'max-w-3xl' : 'max-w-2xl rounded-full bg-black/40 px-5 backdrop-blur-2xl',
        )}
      >
        {/* Left Section */}
        <div>
          <Link
            href='/'
            className='group relative inline-block h-[1.5em] overflow-hidden font-semibold'
          >
            <HoverText>
              <span>Mikail Arianos</span>
              <span aria-hidden='true'>Mikail Arianos</span>
            </HoverText>
          </Link>
        </div>

        {/* Middle Section */}
        <div className='flex gap-x-10'>
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className='group relative inline-block h-[1.5em] overflow-hidden font-semibold'
            >
              <HoverText>
                <span>{item}</span>
                <span aria-hidden='true'>{item}</span>
              </HoverText>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div>
          <Button className='cursor-pointer px-6 py-5'>Contact</Button>
        </div>
      </div>
    </nav>
  );
}
