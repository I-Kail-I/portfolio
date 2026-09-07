'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Reveal } from '@/components/reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/errors';
import { GalleryCard, GalleryCardSkeleton } from '../_components/gallery-card';
import { useGalleryImages } from '../_hooks/hook.client';

export function GallerySection() {
  const { data: images, isLoading, isError, error } = useGalleryImages();
  const { register, watch } = useForm<{ search: string }>({ defaultValues: { search: '' } });
  const { search } = watch();

  useEffect(() => {
    if (isError) {
      toast.add({
        title: 'Failed to load images',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    }
  }, [isError, error]);

  const total = images?.length ?? 0;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return images ?? [];
    return (images ?? []).filter((image) => image.file_name.toLowerCase().includes(query));
  }, [images, search]);

  return (
    <Reveal delay={0.1} className='mt-4'>
      <Card className='mt-10'>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
          <CardDescription>
            {isLoading ? 'All uploaded images.' : `${filtered.length} of ${total} shown.`}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Input
            placeholder='Search by file name…'
            {...register('search')}
            className='sm:max-w-xs'
          />
          <div className='grid min-h-[320px] content-start gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cards have no stable id
                <GalleryCardSkeleton key={i} />
              ))
            ) : isError ? (
              <p className='text-muted-foreground text-sm'>
                Could not load images. Please try again.
              </p>
            ) : filtered.length === 0 ? (
              <p className='text-muted-foreground text-sm'>No images yet.</p>
            ) : (
              filtered.map((image) => <GalleryCard key={image.id} image={image} />)
            )}
          </div>
        </CardContent>
      </Card>
    </Reveal>
  );
}
