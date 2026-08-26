'use client';
import { ReactLenis } from 'lenis/react';

export function Layout({ children }: { children: React.ReactNode }) {
  const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: false,
    infinite: false,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      <div className='mx-5 md:mx-1'>{children}</div>
    </ReactLenis>
  );
}
