import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/6285342468951';
const LINKEDIN_URL = 'https://www.linkedin.com/in/mikail-arianos-30a268356/';
const EMAIL = 'arianosmikail5@gmail.com';

export default function ContactSection() {
  return (
    <div className='mt-45 w-full'>
      <div className='mt-16 border-neutral-800 border-t py-8 max-lg:mx-0' />

      <div>
        <div className='mx-55 max-lg:mx-0'>
          <h2 className='max-w-xl font-light text-4xl lg:text-5xl'>
            Not sure what your product needs?
            <br />
            Let&apos;s figure it out together.
          </h2>

          <Button
            render={<Link href={WHATSAPP_URL} target='_blank' rel='noopener noreferrer' />}
            nativeButton={false}
            className='group relative mt-10 inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-6 font-semibold text-neutral-900 transition-all duration-300 hover:bg-white hover:pr-14'
          >
            <span>Ask for further question</span>
            <ArrowRight className='absolute right-5 h-5 w-5 -translate-x-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100' />
          </Button>
        </div>

        <div className='mt-24 overflow-hidden'>
          <p className='font-semibold text-base text-neutral-800 leading-none max-lg:text-8xl md:text-center lg:text-[17rem]'>
            Mikail Arianos
          </p>
        </div>

        <div className='mx-4 mt-5 md:mx-56'>
          <p className='max-w-2xs text-lg text-muted-foreground md:max-w-none md:text-2xl'>
            DevOps and Full Stack Developer for founded startup
          </p>

          <div className='mt-8 flex flex-wrap gap-3'>
            <Button
              render={<Link href={`mailto:${EMAIL}`} />}
              nativeButton={false}
              className='group relative inline-flex items-center justify-center rounded-full bg-neutral-800/60 px-5 py-6 font-semibold text-neutral-100 transition-all duration-300 hover:bg-neutral-800 hover:pr-14'
            >
              <span>{EMAIL}</span>
              <Mail className='absolute top-1/2 right-5 h-4 w-4 -translate-x-4 -translate-y-1/2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100' />
            </Button>
            <Button
              render={<Link href={LINKEDIN_URL} target='_blank' rel='noopener noreferrer' />}
              nativeButton={false}
              className='group relative inline-flex items-center justify-center rounded-full bg-neutral-800/60 px-5 py-6 font-semibold text-neutral-100 transition-all duration-300 hover:bg-neutral-800 hover:pr-14'
            >
              <span>LinkedIn</span>
              <ArrowRight className='absolute top-1/2 right-5 h-4 w-4 -translate-x-4 -translate-y-1/2 -rotate-30 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
