'use client';

import { useWorkList } from '@/app/(user)/work/_hooks/hook.client';
import { Reveal } from '@/components/reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentChart } from '../_components/content-chart';
import { WorksTableSkeleton } from '../_components/works-table';
import { useBlogs, useImages } from '../_hooks/hook.client';

export function ChartsSection() {
  const { data: works, isLoading: isWorksLoading } = useWorkList();
  const { data: blogs, isLoading: isBlogsLoading } = useBlogs();
  const { data: images, isLoading: isImagesLoading } = useImages();

  const isLoading = isWorksLoading || isBlogsLoading || isImagesLoading;

  return (
    <Reveal delay={0.25} className='mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Content over time</CardTitle>
          <CardDescription>Works, blogs and images created per month, last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <WorksTableSkeleton />
          ) : (
            <ContentChart
              worksDates={(works ?? []).map((work) => work.created_at)}
              blogDates={(blogs ?? []).map((blog) => blog.created_at)}
              imageDates={(images ?? []).map((image) => image.created_at)}
            />
          )}
        </CardContent>
      </Card>
    </Reveal>
  );
}
