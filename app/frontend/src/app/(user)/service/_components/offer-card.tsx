import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type OfferCardProps = {
  badges: readonly string[];
  title: string;
  description: string;
  bullets: readonly string[];
  className?: string;
  buttonClassName?: string;
  htmlId: string;
};

const WHATSAPP_URL =
  'https://wa.me/6285342468951?text=Hi%20Mikail%20%E2%80%94%20I%27d%20like%20to%20book%20a%20meeting%20to%20discuss%20my%20project.';

export function OfferCard({
  badges,
  title,
  description,
  bullets,
  className,
  buttonClassName,
  htmlId,
}: OfferCardProps) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-135 w-full max-w-92.5 scroll-mt-28 flex-col rounded-[28px] p-8 text-neutral-900 lg:max-w-125 lg:scroll-mt-32 lg:p-9',
        className,
      )}
      id={htmlId}
    >
      <div className='flex flex-wrap gap-2'>
        {badges.map((badge) => (
          <span
            key={badge}
            className='rounded-full bg-white/80 px-3 py-1.5 font-medium text-neutral-900 text-xs'
          >
            {badge}
          </span>
        ))}
      </div>

      <h3 className='mt-8 font-medium text-2xl tracking-tight lg:text-[26px]'>{title}</h3>

      <p className='mt-3 max-w-prose text-[15px] text-neutral-800 leading-relaxed'>{description}</p>

      <div className='mt-8 border-black/10 border-t pt-8'>
        <p className='font-medium text-[15px] text-neutral-900'>This is for you if:</p>

        <ul className='mt-5 space-y-4'>
          {bullets.map((bullet) => (
            <li key={bullet} className='flex gap-3 text-[14px] text-neutral-800 leading-relaxed'>
              <span className='mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-black text-white'>
                <Check className='size-3' strokeWidth={3} />
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        size='lg'
        className={cn('mt-8 w-fit rounded-full px-6 font-medium', buttonClassName)}
        nativeButton={false}
        render={<a href={WHATSAPP_URL} target='_blank' rel='noopener noreferrer' />}
      >
        Book a meeting
      </Button>
    </div>
  );
}
