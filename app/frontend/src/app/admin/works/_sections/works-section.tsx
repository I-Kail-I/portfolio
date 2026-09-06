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
import { AdminWorksTable, AdminWorksTableSkeleton } from '../_components/works-table';
import { useAdminWorks } from '../_hooks/hook.client';

type StatusFilter = 'all' | 'selected' | 'standard';
type SortOrder = 'newest' | 'oldest' | 'name';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'selected', label: 'Selected' },
  { value: 'standard', label: 'Standard' },
];

const SORT_ORDERS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name' },
];

type Filters = {
  search: string;
  status: StatusFilter;
  sort: SortOrder;
};

export function WorksSection() {
  const router = useRouter();
  const { data: works, isLoading, isError, error } = useAdminWorks();
  const { register, watch, setValue } = useForm<Filters>({
    defaultValues: { search: '', status: 'all', sort: 'newest' },
  });
  const { search, status, sort } = watch();

  useEffect(() => {
    if (isError) {
      toast.add({
        title: 'Failed to load works',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    }
  }, [isError, error]);

  const total = works?.length ?? 0;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = (works ?? []).filter((work) => {
      if (status === 'selected' && !work.is_selected) return false;
      if (status === 'standard' && work.is_selected) return false;
      if (!query) return true;
      return (
        work.name.toLowerCase().includes(query) ||
        work.description.toLowerCase().includes(query) ||
        work.badge.some((badge) => badge.toLowerCase().includes(query))
      );
    });

    return [...rows].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'oldest') return +new Date(a.created_at) - +new Date(b.created_at);
      return +new Date(b.created_at) - +new Date(a.created_at);
    });
  }, [works, search, status, sort]);

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <Reveal>
          <div>
            <h1 className='font-semibold text-4xl sm:text-5xl'>Works</h1>
            <p className='mt-2 text-lg text-muted-foreground'>
              {isLoading ? 'All portfolio entries.' : `${total} entries.`}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className='mt-10'>
          <Card>
            <CardHeader>
              <CardTitle>All works</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading entries.' : `${filtered.length} of ${total} shown.`}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                <Input
                  placeholder='Search name, description or badge…'
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

              <div className='min-h-[320px]'>
                {isLoading ? (
                  <AdminWorksTableSkeleton />
                ) : isError ? (
                  <p className='text-muted-foreground text-sm'>
                    Could not load works. Please try again.
                  </p>
                ) : (
                  <AdminWorksTable works={filtered} onSelect={(id) => router.push(`/admin/works/${id}`)} />
                )}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
