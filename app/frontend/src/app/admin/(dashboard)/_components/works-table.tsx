import { StarIcon } from 'lucide-react';
import type { WorkType } from '@/app/(user)/work/work.dto';
import { ContentTable, ContentTableSkeleton, type Column } from './content-table';

const WORK_COLUMNS: Column<WorkType>[] = [
  {
    header: 'Name',
    cell: (work) => <span className='font-medium'>{work.name}</span>,
  },
  {
    header: 'Description',
    cell: (work) => (
      <span className='block max-w-60 truncate text-muted-foreground'>{work.description}</span>
    ),
  },
  {
    header: 'Selected',
    cell: (work) =>
      work.is_selected ? <StarIcon className='size-4 text-[#f5bd22]' aria-label='Selected' /> : null,
  },
];

export function WorksTable({ works }: { works: WorkType[] }) {
  return <ContentTable rows={works} columns={WORK_COLUMNS} emptyText='No works yet.' />;
}

export function WorksTableSkeleton() {
  return <ContentTableSkeleton columns={3} rows={3} />;
}
