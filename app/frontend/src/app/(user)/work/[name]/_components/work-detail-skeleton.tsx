import { Skeleton } from '@/components/ui/skeleton';

export function WorkDetailSkeleton() {
  return (
    <div className='container mx-auto'>
      <div className='mt-46'>
        <div className='flex flex-wrap gap-2'>
          <Skeleton className='h-5 w-16' />
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-14' />
        </div>
        <Skeleton className='mt-8 h-12 w-3/4 max-w-2xl' />
        <Skeleton className='mt-4 h-6 w-full max-w-3xl' />
        <Skeleton className='mt-12 aspect-11/6 w-full max-w-275 rounded-xl' />
        <div className='mt-12 space-y-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-4/6' />
          <Skeleton className='mt-8 h-6 w-48' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>
      </div>
    </div>
  );
}
