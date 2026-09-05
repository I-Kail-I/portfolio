'use client';

import { useEffect } from 'react';
import { Reveal } from '@/components/reveal';
import { SelectWorkCard, SelectWorkCardSkeleton } from '../_components/select-work-card';
import { useSelectedWorks } from '../_hooks/hooks.client';
import { toast } from '@/components/ui/toast';

export function SelectedWorkSection() {
  const { data, isLoading, error, isError } = useSelectedWorks();

  useEffect(() => {
    if (isError) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast.add({
        title: 'Failed to load selected works',
        description: msg,
        type: 'error',
      });
    }
  }, [isError, error]);

  return (
    <div className='mt-20 flex min-h-screen justify-center md:mt-35'>
      <div className='container'>
        <div className='w-full'>
          <Reveal>
            <p className='font-semibold text-muted-foreground text-xs uppercase'>Selected Work</p>
          </Reveal>
        </div>

        <div className='mt-10 space-y-12 md:mt-20 md:space-y-27'>
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Reveal key={i} once>
                <SelectWorkCardSkeleton />
              </Reveal>
            ))
          ) : isError ? (
            <p className='text-muted-foreground text-sm'>
              Could not load selected works. Please try again.
            </p>
          ) : (
            data?.map((card) => (
              <Reveal key={card.id}>
                <SelectWorkCard
                  title={card.name ?? 'title'}
                  link={`/work/${card.name.toLowerCase().split(' ').join('-')}`}
                  badge={card.badge}
                  imageUrl={card.image_url}
                  hoverText={card.hover_text}
                />
              </Reveal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
