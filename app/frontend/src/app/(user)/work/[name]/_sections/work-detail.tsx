'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Reveal } from '@/components/reveal';
import { useWorkByName } from '../_hooks/hook.client';
import { WorkMarkdown } from '../_components/work-markdown';
import { WorkDetailSkeleton } from '../_components/work-detail-skeleton';
import { toast } from '@/components/ui/toast';

type Props = {
  name: string;
};

export function WorkDetailSection({ name }: Props) {
  const { data, isLoading, isError, error } = useWorkByName(name);

  useEffect(() => {
    if (isError) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast.add({
        title: 'Failed to load work',
        description: msg,
        type: 'error',
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return <WorkDetailSkeleton />;
  }

  if (isError) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return (
      <div className='container mx-auto'>
        <div className='mt-46 min-h-[40vh]'>
          <Reveal>
            <Link
              href='/work'
              className='inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground'
            >
              <ArrowLeft className='h-4 w-4' /> Back to works
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className='mt-8 font-semibold text-3xl'>Work not found</h1>
            <p className='mt-4 text-muted-foreground'>{msg}</p>
          </Reveal>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto'>
        <div className='mt-46'>
          <Reveal>
            <Link
              href='/work'
              className='inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground'
            >
              <ArrowLeft className='h-4 w-4' /> Back to works
            </Link>
          </Reveal>

          {/* header like work.tsx ServiceSection style */}
          <Reveal delay={0.05}>
            <div className='mt-8 flex flex-wrap gap-x-5 gap-y-1 font-medium text-muted-foreground text-xs uppercase'>
              {data.badge.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className='mt-4 max-w-4xl font-semibold text-4xl leading-tight sm:text-6xl'>
              {data.name}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className='mt-5 max-w-3xl text-lg text-muted-foreground'>
              {data.description}
              {data.hover_text ? (
                <span className='text-orange-300'> — {data.hover_text}</span>
              ) : null}
            </p>
          </Reveal>

          {/* hero image - same aspect as SelectWorkCard / WorkCard */}
          <Reveal delay={0.2} className='mt-12'>
            <div className='relative mx-auto aspect-11/6 w-full max-w-275 overflow-hidden rounded-xl bg-muted'>
              {data.image_url ? (
                <Image
                  src='https://www.mariajoaoabrantes.work/_next/image?url=%2Fmedia%2Fprojects%2Freach-users%2Freachusers-grid-desktop.webp&w=1920&q=75'
                  alt={data.name}
                  fill
                  priority
                  sizes='(max-width: 1280px) 100vw, 1100px'
                  className='object-cover'
                />
              ) : null}
            </div>
          </Reveal>

          {/* README / content as markdown */}
          <Reveal delay={0.25} className='mx-auto mt-16 max-w-3xl'>
            <WorkMarkdown content={data.content} />
          </Reveal>

          <Reveal
            delay={0.3}
            className='mx-auto mt-16 max-w-3xl border-t pt-8 text-muted-foreground text-sm'
          >
            <p>
              Last updated: {new Date(data.updated_at).toLocaleDateString()} · Created:{' '}
              {new Date(data.created_at).toLocaleDateString()}
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
