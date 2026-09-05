'use client';

import { useEffect } from 'react';
import { WorkCard, WorkCardSkeleton } from '../_components/work-card';
import { Reveal } from '@/components/reveal';
import { useWorkList } from '../_hooks/hook.client';
import { toast } from '@/components/ui/toast';

export function WorkSection() {
  const { data, isLoading, isError, error } = useWorkList();

  useEffect(() => {
    if (isError) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast.add({
        title: 'Failed to load works',
        description: msg,
        type: 'error',
      });
    }
  }, [isError, error]);

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto'>
        <div className='mt-46'>
          <div>
            <h1 className='font-semibold text-6xl'>All of my works</h1>
            <p className='mt-5 text-lg text-muted-foreground'>
              All of my works that I already done with - Products partnerships and consulting
              engagements.
            </p>
          </div>

          <div className='mt-20 space-y-15'>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Reveal once key={i}>
                  <WorkCardSkeleton />
                </Reveal>
              ))
            ) : isError ? (
              <p className='text-muted-foreground text-sm'>
                Could not load works. Please try again.
              </p>
            ) : (
              data?.map((work) => (
                <Reveal once key={work.id}>
                  <WorkCard
                    title={work.name}
                    description={work.description}
                    hoverText={work.hover_text}
                    imageUrl={work.image_url}
                    link={`/work/${work.name.toLowerCase().split(' ').join('-')}`}
                    badge={work.badge}
                  />
                </Reveal>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
