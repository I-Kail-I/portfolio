import { StarIcon } from 'lucide-react';
import { ContentTable, ContentTableSkeleton, type Column } from '../../(dashboard)/_components/content-table';
import type { AdminWork } from '../works.dto';
import { DeleteWorkDialog } from './delete-work-dialog';

const WORKS_COLUMNS: Column<AdminWork>[] = [
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
    header: 'Badges',
    cell: (work) => <span className='text-muted-foreground'>{work.badge.length}</span>,
  },
  {
    header: 'Selected',
    cell: (work) =>
      work.is_selected ? <StarIcon className='size-4 text-[#f5bd22]' aria-label='Selected' /> : null,
  },
  {
    header: 'Created',
    cell: (work) => (
      <span className='text-muted-foreground'>
        {new Date(work.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    header: 'Actions',
    className: 'text-right',
    cell: (work) => (
      <span className='flex justify-end gap-1' onClick={(event) => event.stopPropagation()}>
        <DeleteWorkDialog id={work.id} name={work.name} />
      </span>
    ),
  },
];

export function AdminWorksTable({
  works,
  onSelect,
}: {
  works: AdminWork[];
  onSelect: (id: string) => void;
}) {
  return (
    <ContentTable
      rows={works}
      columns={WORKS_COLUMNS}
      emptyText='No works yet.'
      onRowClick={(work) => onSelect(work.id)}
    />
  );
}

export function AdminWorksTableSkeleton() {
  return <ContentTableSkeleton columns={6} rows={5} />;
}
