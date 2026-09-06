'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkList } from '@/app/(user)/work/_hooks/hook.client';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/errors';
import { BlogsTable, BlogsTableSkeleton } from '../_components/blogs-table';
import { ImagesTable, ImagesTableSkeleton } from '../_components/images-table';
import { WorksTable, WorksTableSkeleton } from '../_components/works-table';
import { useBlogs, useImages } from '../_hooks/hook.client';

type ContentTab = 'works' | 'blogs' | 'images';
type StatusFilter = 'all' | 'selected' | 'standard';

const CONTENT_TABS: { value: ContentTab; label: string }[] = [
  { value: 'works', label: 'Works' },
  { value: 'blogs', label: 'Blogs' },
  { value: 'images', label: 'Images' },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'selected', label: 'Selected' },
  { value: 'standard', label: 'Standard' },
];

const SEARCH_PLACEHOLDER: Record<ContentTab, string> = {
  works: 'Search works by name or description…',
  blogs: 'Search blogs by title or description…',
  images: 'Search images by file name…',
};

export function TableSection() {
  const {
    data: works,
    isLoading: isWorksLoading,
    isError: isWorksError,
    error: worksError,
  } = useWorkList();
  const {
    data: blogs,
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    error: blogsError,
  } = useBlogs();
  const {
    data: images,
    isLoading: isImagesLoading,
    isError: isImagesError,
    error: imagesError,
  } = useImages();

  const [tab, setTab] = useState<ContentTab>('works');
  const { register, watch, setValue } = useForm<{ search: string; status: StatusFilter }>({
    defaultValues: { search: '', status: 'all' },
  });
  const { search, status } = watch();

  useEffect(() => {
    const failed = [
      { isError: isWorksError, error: worksError, title: 'Failed to load works' },
      { isError: isBlogsError, error: blogsError, title: 'Failed to load blogs' },
      { isError: isImagesError, error: imagesError, title: 'Failed to load images' },
    ].find((entry) => entry.isError);

    if (failed) {
      toast.add({ title: failed.title, description: getApiErrorMessage(failed.error), type: 'error' });
    }
  }, [isWorksError, worksError, isBlogsError, blogsError, isImagesError, imagesError]);

  const filteredWorks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (works ?? []).filter((work) => {
      if (status === 'selected' && !work.is_selected) return false;
      if (status === 'standard' && work.is_selected) return false;
      if (!query) return true;
      return (
        work.name.toLowerCase().includes(query) || work.description.toLowerCase().includes(query)
      );
    });
  }, [works, search, status]);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return blogs ?? [];
    return (blogs ?? []).filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query),
    );
  }, [blogs, search]);

  const filteredImages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return images ?? [];
    return (images ?? []).filter((image) => image.file_name.toLowerCase().includes(query));
  }, [images, search]);

  const isLoading = isWorksLoading || isBlogsLoading || isImagesLoading;
  const counts: Record<ContentTab, number> = {
    works: filteredWorks.length,
    blogs: filteredBlogs.length,
    images: filteredImages.length,
  };
  const totals: Record<ContentTab, number> = {
    works: works?.length ?? 0,
    blogs: blogs?.length ?? 0,
    images: images?.length ?? 0,
  };

  return (
    <Reveal delay={0.3} className='mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            {isLoading
              ? 'All portfolio entries.'
              : `${counts[tab]} of ${totals[tab]} ${tab} shown.`}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex gap-2'>
              {CONTENT_TABS.map((entry) => (
                <Button
                  key={entry.value}
                  variant={tab === entry.value ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setTab(entry.value)}
                >
                  {entry.label}
                </Button>
              ))}
            </div>
            <Input
              placeholder={SEARCH_PLACEHOLDER[tab]}
              {...register('search')}
              className='sm:max-w-xs'
            />
          </div>

          {tab === 'works' && (
            <div className='min-h-[320px] space-y-4'>
              <div className='flex gap-2'>
                {STATUS_FILTERS.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={status === filter.value ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setValue('status', filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              {isWorksLoading ? (
                <WorksTableSkeleton />
              ) : isWorksError ? (
                <p className='text-muted-foreground text-sm'>
                  Could not load works. Please try again.
                </p>
              ) : (
                <WorksTable works={filteredWorks} />
              )}
            </div>
          )}

          {tab === 'blogs' && (
            <div className='min-h-[320px]'>
              {isBlogsLoading ? (
                <BlogsTableSkeleton />
              ) : isBlogsError ? (
                <p className='text-muted-foreground text-sm'>
                  Could not load blogs. Please try again.
                </p>
              ) : (
                <BlogsTable blogs={filteredBlogs} />
              )}
            </div>
          )}

          {tab === 'images' && (
            <div className='min-h-[320px]'>
              {isImagesLoading ? (
                <ImagesTableSkeleton />
              ) : isImagesError ? (
                <p className='text-muted-foreground text-sm'>
                  Could not load images. Please try again.
                </p>
              ) : (
                <ImagesTable images={filteredImages} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Reveal>
  );
}
