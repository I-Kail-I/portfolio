'use client';

import { useEffect } from 'react';
import { BlogCard, BlogCardSkeleton } from '../_components/blog-card';
import { Reveal } from '@/components/reveal';
import { toast } from '@/components/ui/toast';
import { imageFileUrl } from '@/lib/images';
import { useBlogList } from '../_hooks/hook.client';

export function BlogSection() {
  const { data, isLoading, isError, error } = useBlogList();

  useEffect(() => {
    if (isError) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast.add({
        title: 'Failed to load blogs',
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
            <h1 className='font-semibold text-6xl'>All of my blogs</h1>
            <p className='mt-5 text-lg text-muted-foreground'>
              All of my blogs that I already done with - Thoughts partnerships and consulting
              engagements.
            </p>
          </div>

          <div className='mt-20 space-y-15'>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Reveal once key={i}>
                  <BlogCardSkeleton />
                </Reveal>
              ))
            ) : isError ? (
              <p className='text-muted-foreground text-sm'>
                Could not load blogs. Please try again.
              </p>
            ) : (
              data?.map((blog) => (
                <Reveal once key={blog.id}>
                  <BlogCard
                    title={blog.title}
                    description={blog.description}
                    hoverText={blog.hover_text}
                    imageUrl={imageFileUrl(blog.image_id)}
                    link={`/blog/${blog.title.toLowerCase().split(' ').join('-')}`}
                    badge={blog.badge}
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
