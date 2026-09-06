'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkList } from '@/app/(user)/work/_hooks/hook.client';
import { Reveal } from '@/components/reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import { WorksTable, WorksTableSkeleton } from '../_components/works-table';
import { useMe } from '../_hooks/hook.client';

export function DashboardSection() {
  const router = useRouter();
  const { data: me, isError: isMeError } = useMe();
  const { data: works, isLoading, isError, error } = useWorkList();

  useEffect(() => {
    if (isMeError) {
      router.replace('/login?next=/admin');
    }
  }, [isMeError, router]);

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

  const total = works?.length ?? 0;
  const selected = works?.filter((work) => work.is_selected).length ?? 0;

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <Reveal>
          <div>
            <h1 className='font-semibold text-4xl sm:text-5xl'>Dashboard</h1>
            <p className='mt-2 text-lg text-muted-foreground'>
              {me ? `Welcome back, ${me.first_name}.` : 'Welcome back.'}
            </p>
          </div>
        </Reveal>

        <div className='mt-10 grid gap-4 sm:grid-cols-2'>
          <Reveal delay={0.05}>
            <Card>
              <CardHeader>
                <CardDescription>Total works</CardDescription>
                <CardTitle className='text-4xl'>{isLoading ? '–' : total}</CardTitle>
              </CardHeader>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card>
              <CardHeader>
                <CardDescription>Selected works</CardDescription>
                <CardTitle className='text-4xl'>{isLoading ? '–' : selected}</CardTitle>
              </CardHeader>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={0.15} className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Works</CardTitle>
              <CardDescription>
                All portfolio entries. Deletion takes effect immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <WorksTableSkeleton />
              ) : isError ? (
                <p className='text-muted-foreground text-sm'>
                  Could not load works. Please try again.
                </p>
              ) : (
                <WorksTable works={works ?? []} />
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
