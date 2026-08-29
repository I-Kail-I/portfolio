import { Reveal } from '@/components/reveal';
import { TextAnimations } from '@/components/text-animations';

export function HeroSection() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='container'>
        <div className='w-full max-w-5xl'>
          <Reveal>
            <p className='mb-3 font-bold text-sm sm:mb-4'>
              <span className='text-[#00AEEF]'>DEVOPS</span> ·{' '}
              <span className='text-[#f5bd22]'>FULL STACK DEVELOPER</span>
            </p>
          </Reveal>

          <h1 className='mb-6 max-w-150 font-semibold text-5xl text-gray-300 leading-tight sm:mb-9 sm:text-8xl lg:text-8xl lg:leading-20'>
            <TextAnimations text='I help founders shape their product, not just build it.' />
          </h1>

          <p className='max-w-4xl font-nunito text-2xl text-zinc-300 sm:text-xl lg:text-3xl'>
            <TextAnimations text='From uncertainty to a product ready to ship — architecture, development and DevOps in one ongoing partnership.' />
          </p>
        </div>
      </div>
    </div>
  );
}
