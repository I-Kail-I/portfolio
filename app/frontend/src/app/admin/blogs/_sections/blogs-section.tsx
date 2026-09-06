'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/errors';
import { AdminBlogsTable, AdminBlogsTableSkeleton } from '../_components/blogs-table';
import { useAdminBlogs } from '../_hooks/hook.client';

type SortOrder = 'newest' | 'oldest' | 'title';

const SORT_ORDERS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'Title' },
];

type Filters = {
  search: string;
  sort: SortOrder;
};

export function BlogsSection() {
  const router = useRouter();
  const { data: blogs, isLoading, isError, error } = useAdminBlogs();
  const { register, watch, setValue } = useForm<Filters>({
    defaultValues: { search: '', sort: 'newest' },
  });
  const { search, sort } = watch();

  useEffect(() => {
    if (isError) {
      toast.add({
        title: 'Failed to load blogs',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    }
  }, [isError, error]);

  const total = blogs?.length ?? 0;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = (blogs ?? []).filter((blog) => {
      if (!query) return true;
      return (
        blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.badge.some((badge) => badge.toLowerCase().includes(query))
      );
    });

    return [...rows].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'oldest') return +new Date(a.created_at) - +new Date(b.created_at);
      return +new Date(b.created_at) - +new Date(a.created_at);
    });
  }, [blogs, search, sort]);

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <Reveal>
          <div>
            <h1 className='font-semibold text-4xl sm:text-5xl'>Blogs</h1>
            <p className='mt-2 text-lg text-muted-foreground'>
              {isLoading ? 'All blog entries.' : `${total} entries.`}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className='mt-10'>
          <Card>
            <CardHeader>
              <CardTitle>All blogs</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading entries.' : `${filtered.length} of ${total} shown.`}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                <Input
                  placeholder='Search title, description or badge…'
                  {...register('search')}
                  className='lg:max-w-xs'
                />
                <div className='flex flex-wrap gap-2'>
                  {SORT_ORDERS.map((entry) => (
                    <Button
                      key={entry.value}
                      variant={sort === entry.value ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setValue('sort', entry.value)}
                    >
                      {entry.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className='min-h-[320px]'>
                {isLoading ? (
                  <AdminBlogsTableSkeleton />
                ) : isError ? (
                  <p className='text-muted-foreground text-sm'>
                    Could not load blogs. Please try again.
                  </p>
                ) : (
                  <AdminBlogsTable
                    blogs={filtered}
                    onSelect={(id) => router.push(`/admin/blogs/${id}`)}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
