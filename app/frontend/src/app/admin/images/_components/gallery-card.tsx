import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Image as GalleryImage } from '../images.dto';
import { DeleteImageDialog } from './delete-image-dialog';

// Raw bytes stream (GET /file-upload/:id), not the JSON metadata endpoint.
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? '/api';

type GalleryCardProps = {
  image: GalleryImage;
};

export function GalleryCard({ image }: GalleryCardProps) {
  return (
    <Card className='overflow-hidden py-0'>
      <div className='relative aspect-video w-full bg-muted'>
        <Image
          src={`${API_PREFIX}/file-upload/${image.id}`}
          alt={image.file_name}
          fill
          sizes='(max-width: 1024px) 50vw, 33vw'
          className='object-cover'
        />
      </div>
      <CardContent className='flex items-center justify-between gap-2 py-3'>
        <div className='min-w-0'>
          <p className='truncate font-medium text-sm'>{image.file_name}</p>
          <p className='text-muted-foreground text-xs'>
            {image.status} ·{' '}
            {new Date(image.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <DeleteImageDialog id={image.id} fileName={image.file_name} />
      </CardContent>
    </Card>
  );
}

export function GalleryCardSkeleton() {
  return (
    <Card className='overflow-hidden py-0'>
      <Skeleton className='aspect-video w-full rounded-none' />
      <CardContent className='space-y-2 py-3'>
        <Skeleton className='h-4 w-2/3' />
        <Skeleton className='h-3 w-1/3' />
      </CardContent>
    </Card>
  );
}
