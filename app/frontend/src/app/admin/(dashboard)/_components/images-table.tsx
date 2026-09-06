import type { Image } from '../../images/images.dto';
import { ContentTable, ContentTableSkeleton, type Column } from './content-table';

const IMAGE_COLUMNS: Column<Image>[] = [
  {
    header: 'File name',
    cell: (image) => <span className='font-medium'>{image.file_name}</span>,
  },
  {
    header: 'Status',
    cell: (image) => <span className='text-muted-foreground'>{image.status}</span>,
  },
];

export function ImagesTable({ images }: { images: Image[] }) {
  return <ContentTable rows={images} columns={IMAGE_COLUMNS} emptyText='No images yet.' />;
}

export function ImagesTableSkeleton() {
  return <ContentTableSkeleton columns={2} rows={3} />;
}
