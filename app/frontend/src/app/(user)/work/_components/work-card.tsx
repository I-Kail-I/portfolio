import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type WorkCardType = {
  title: string;
  description: string;
  hoverText?: string;
  imageUrl?: string;
  link: string;
  badge: string[];
};

export function WorkCard({ title, description, hoverText, imageUrl, link, badge }: WorkCardType) {
  return (
    <div className='group space-y-4 sm:space-y-6'>
      <Card className='relative mx-auto aspect-11/6 w-full max-w-275 gap-0 overflow-hidden rounded-xl py-0 transition-all duration-300 hover:scale-[1.01]'>
        <Link href={link} className='block h-full w-full'>
          {/* Default image */}
          {imageUrl && (
            <Image
              alt={title}
              src='https://www.mariajoaoabrantes.work/_next/image?url=%2Fmedia%2Fprojects%2Freach-users%2Freachusers-grid-desktop.webp&w=1920&q=75'
              fill
              sizes='(max-width: 1280px) 100vw, 1100px'
              className='object-cover transition-opacity duration-500'
            />
          )}
        </Link>
      </Card>

      <div className='mx-auto w-full max-w-275 px-2'>
        <div className='flex flex-wrap gap-x-5 gap-y-1 font-medium text-muted-foreground text-xs uppercase'>
          {badge.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className='mt-2 flex flex-col gap-y-1 md:flex-row md:items-start md:gap-3'>
          <h2 className='font-light text-foreground text-xl sm:text-2xl lg:text-3xl'>
            {description}
          </h2>

          {hoverText && (
            <p className='shrink-0 font-light text-lg text-orange-300 opacity-0 transition-all duration-300 sm:text-xl lg:translate-y-3 lg:text-3xl lg:group-hover:translate-y-0 lg:group-hover:opacity-100'>
              – {hoverText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function WorkCardSkeleton() {
  return (
    <div className='space-y-4 sm:space-y-6'>
      <Card className='relative mx-auto aspect-11/6 w-full max-w-275 gap-0 overflow-hidden rounded-xl py-0'>
        <Skeleton className='h-full w-full rounded-none' />
      </Card>

      <div className='mx-auto w-full max-w-275 px-2'>
        <div className='flex flex-wrap gap-x-5 gap-y-1'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-20' />
        </div>

        <div className='mt-3 flex flex-col gap-y-2 md:flex-row md:items-start md:gap-3'>
          <Skeleton className='h-7 w-3/4 sm:h-8 lg:h-9' />
        </div>
      </div>
    </div>
  );
}
