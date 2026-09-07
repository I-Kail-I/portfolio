'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkList } from '@/app/(user)/work/_hooks/hook.client';
import { Reveal } from '@/components/reveal';
import { AccountCard } from '../_components/account-card';
import { ApiStatusCard } from '../_components/api-status-card';
import { QuickLinksCard } from '../_components/quick-links-card';
import { StatCard } from '../_components/stat-card';
import { useBlogs, useHealth, useImages, useMe } from '../_hooks/hook.client';

const QUICK_LINKS = [
  { label: 'Works', href: '/admin/works' },
  { label: 'Images', href: '/admin/images' },
  { label: 'Blogs', href: '/admin/blogs' },
  { label: 'View site', href: '/' },
];

const STATS = [
  { key: 'works', label: 'Total works' },
  { key: 'selected', label: 'Selected works' },
  { key: 'blogs', label: 'Total blogs' },
  { key: 'images', label: 'Total images' },
] as const;

export function CardsSection() {
  const router = useRouter();
  const { data: me, isError: isMeError } = useMe();
  const { data: health, isError: isHealthError } = useHealth();
  const { data: works, isLoading: isWorksLoading } = useWorkList();
  const { data: blogs, isLoading: isBlogsLoading } = useBlogs();
  const { data: images, isLoading: isImagesLoading } = useImages();

  useEffect(() => {
    if (isMeError) {
      router.replace('/login?next=/admin');
    }
  }, [isMeError, router]);

  const values: Record<(typeof STATS)[number]['key'], number> = {
    works: works?.length ?? 0,
    selected: works?.filter((work) => work.is_selected).length ?? 0,
    blogs: blogs?.length ?? 0,
    images: images?.length ?? 0,
  };

  const loading: Record<(typeof STATS)[number]['key'], boolean> = {
    works: isWorksLoading,
    selected: isWorksLoading,
    blogs: isBlogsLoading,
    images: isImagesLoading,
  };

  const name = me ? `${me.first_name} ${me.last_name}` : undefined;
  const memberSince = me
    ? new Date(me.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : undefined;

  return (
    <>
      <Reveal>
        <div>
          <h1 className='font-semibold text-4xl sm:text-5xl'>Dashboard</h1>
          <p className='mt-2 text-lg text-muted-foreground'>
            {me ? `Welcome back, ${me.first_name}.` : 'Welcome back.'}
          </p>
        </div>
      </Reveal>

      <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {STATS.map((stat, index) => (
          <Reveal key={stat.key} delay={0.05 * index}>
            <StatCard label={stat.label} value={values[stat.key]} isLoading={loading[stat.key]} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15} className='mt-4'>
        <div className='grid gap-4 md:grid-cols-3'>
          <AccountCard name={name} email={me?.email} memberSince={memberSince} />
          <ApiStatusCard status={health?.status} isOffline={isHealthError} />
          <QuickLinksCard links={QUICK_LINKS} />
        </div>
      </Reveal>
    </>
  );
}
