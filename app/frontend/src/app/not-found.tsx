import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6 pb-28 text-center'>
      <Reveal>
        <h1 className='font-bold font-heading text-[#333333] text-[clamp(8rem,28vw,26rem)] leading-none'>
          404
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <p className='mt-10 max-w-xl font-medium text-foreground/70 text-sm'>
          Not all those who wander are lost. You, unfortunately, are.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <Button
          nativeButton={false}
          size='lg'
          render={<Link href='/' />}
          className='mt-10 inline-flex rounded-full border border-border bg-foreground/3 px-7 py-6 text-bg-foreground text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4'
        >
          Back to home
        </Button>
      </Reveal>
    </div>
  );
}
