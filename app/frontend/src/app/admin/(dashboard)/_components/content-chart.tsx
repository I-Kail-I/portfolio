'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import { Legend, Tooltip } from 'recharts';

const MONTHS = 6;

type ContentBucket = {
  month: string;
  works: number;
  blogs: number;
  images: number;
};

function bucketize(dates: string[], buckets: ContentBucket[], key: 'works' | 'blogs' | 'images') {
  const now = new Date();
  for (const date of dates) {
    const created = new Date(date);
    const diff =
      (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    if (diff >= 0 && diff < MONTHS) {
      buckets[MONTHS - 1 - diff][key] += 1;
    }
  }
}

export function buildBuckets(worksDates: string[], blogDates: string[], imageDates: string[]) {
  const now = new Date();
  const buckets: ContentBucket[] = Array.from({ length: MONTHS }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      works: 0,
      blogs: 0,
      images: 0,
    };
  });

  bucketize(worksDates, buckets, 'works');
  bucketize(blogDates, buckets, 'blogs');
  bucketize(imageDates, buckets, 'images');

  return buckets;
}

const CHART_CONFIG = {
  works: { label: 'Works', color: 'var(--chart-1)' },
  blogs: { label: 'Blogs', color: 'var(--chart-2)' },
  images: { label: 'Images', color: 'var(--chart-3)' },
} satisfies Parameters<typeof ChartContainer>[0]['config'];

type ContentChartProps = {
  worksDates: string[];
  blogDates: string[];
  imageDates: string[];
};

export function ContentChart({ worksDates, blogDates, imageDates }: ContentChartProps) {
  const data = useMemo(() => buildBuckets(worksDates, blogDates, imageDates), [worksDates, blogDates, imageDates]);

  return (
    <ChartContainer config={CHART_CONFIG} className='aspect-auto h-64'>
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='month' tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Bar dataKey='works' fill='var(--color-works)' radius={6} />
        <Bar dataKey='blogs' fill='var(--color-blogs)' radius={6} />
        <Bar dataKey='images' fill='var(--color-images)' radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
